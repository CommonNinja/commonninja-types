import { Application, Response } from 'express';

import { httpHelpers } from '..';
import { IGetUserAuthInfoRequest } from '../user/user.helpers';
import { assetService } from '../../services';
import { ServiceName } from '../../globals';
import { AssetType, IAssetSearchTerms, IAsset } from '../../services/asset/asset.service';
import { IPaginationResponse } from '../http/http.helpers';
import { Cache, RedisCache } from '../../cache';
import { LoggerFactory } from '../../log';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const uploadsBaseUrl = config.UPLOADS_BASE_URL;
const { 
  ENABLE_REDIS, 
  REDIS_URI, 
  AWS_ACCESS_KEY_ID, 
  AWS_SECRET_ACCESS_KEY, 
  S3_BUCKET_NAME, 
  S3_BUCKET_PATH,
} = config;
const ttl: number = 60 * 15; // 15 minutes
const cacheInstance = ENABLE_REDIS === 'true' && REDIS_URI ? new RedisCache(REDIS_URI, ttl) : new Cache(ttl);
const cachePrefix: string = 'userAssets';
const logger = LoggerFactory.getLogger(__filename);

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();

const s3Storage = multer({
  dest: '/uploads',
  storage: multerS3({
    s3,
    bucket: S3_BUCKET_NAME,
    cacheControl: 'max-age=31536000',
    acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${S3_BUCKET_PATH}${Date.now().toString()}_${file.originalname.replace(/ /g, '_').replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')}`);
    },
  }),
});

export interface IAssetUploadRequest extends IGetUserAuthInfoRequest {
  files: any;
}

export class AssetsHelpers {

  private flushCacheForUser(userId: string) {
    const key: string = `${cachePrefix}_${userId}`;
    logger.debug('Deleting cache for', key);
    cacheInstance.delStartWith(key);
  }

  public assetManagementRoutes(app: Application, serviceName: ServiceName, corsOptions: any, userResolver: () => void | (() => void)[], pathPrefix?: string) {
    this.uploadAssetRoute(app, serviceName, corsOptions, userResolver, pathPrefix);
  }

  public uploadAssetRoute(app: Application, serviceName: ServiceName, corsOptions: any, userResolver: () => void | (() => void)[] , pathPrefix: string = '', inputName: string = 'files[]', multi: boolean = true, numberOfFiles: number = 1) {
    app.post(`${pathPrefix}/asset`, cors(corsOptions), userResolver, s3Storage[multi ? 'array' : 'single'](inputName, numberOfFiles), (req: IAssetUploadRequest, res: Response) => {
      if (!req.user.guid) {
        res.send(httpHelpers.getResult(false, 'User is not logged in.'));
        return;
      }

      if (!req.files.length) {
        res.send(httpHelpers.getResult(false, 'Could not upload image.'));
        return;
      }

      const file = req.files[0];
      const fileUrl = file.key ? `${uploadsBaseUrl}/${file.key}` : file.location;
      const fileName = file.originalname;

      assetService.createAsset({
        serviceName,
        componentId: req.query.componentId as string || null,
        userId: req.user.guid,
        assetType: AssetType.IMAGE,
        name: fileName,
        url: fileUrl,
      });

      this.flushCacheForUser(req.user.guid);
      
      res.send(httpHelpers.getResult(true, null, {
        url: fileUrl,
        name: fileName,
      }));
    });

    app.get(
      `${pathPrefix}/asset`, 
      cors(corsOptions), 
      userResolver,
      async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { user } = req;
        const { q = '', limit = 10, page = 1 } = req.query;
    
        if (!user.isAuthenticated) {
          res.send(httpHelpers.getResult(false, 'User is not logged in.'));
          return;
        }
    
        const filter: IAssetSearchTerms = {
          assetType: AssetType.IMAGE,
          userId: user.guid,
          searchTerm: req.query.q as string || '',
        };
    
        // Filter by service name, only if it's a ninja service
        if (serviceName.includes('ninja')) {
          filter.serviceName = serviceName;
        }
    
        let finalPage: any = page;
        if (typeof finalPage !== 'number') {
          finalPage = parseInt(page as string, 10);
        }
    
        try {
          const key = `${cachePrefix}_${user.guid}_${serviceName}_${limit}_${page}_${q || ''}`;
          const assets: IPaginationResponse = await cacheInstance.get(key, async () => await assetService.getAssets(filter, parseInt(limit as string), finalPage));
          assets.docs = assets.docs.map((a: IAsset) => {
            delete a.__v;
            delete a.created;
            delete a.updated;
            delete a._id;
            delete a.userId;
            return a;
          });
          res.send(httpHelpers.getResult(true, '', assets));
        } catch (e) {
          logger.error('Could not load user assets', e);
          res.send(httpHelpers.getResult(false, 'Could not load user assets'));
        }
      },
    );

    app.put(
      `${pathPrefix}/asset/:assetId`, 
      cors(corsOptions), 
      userResolver,
      async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { user } = req;
        const { assetId } = req.params;
    
        if (!user.isAuthenticated) {
          res.send(httpHelpers.getResult(false, 'User is not logged in.'));
          return;
        }
    
        if (!assetId) {
          res.send(httpHelpers.getResult(false, 'Asset ID is not defined.'));
          return;
        }
    
        try {
          const result = await assetService.updateAsset(assetId, user.guid as string, { name: req.body.name } as IAsset);
          this.flushCacheForUser(user.guid || '');
          res.send(httpHelpers.getResult(true, 'GREAT SUCCESS!'));
        } catch (e) {
          logger.warn(`Could not update asset ${assetId}`, e);
          res.send(httpHelpers.getResult(false, 'Could not update asset'));
        }
      },
    );
    
    app.delete(
      `${pathPrefix}/asset/:assetId`, 
      cors(corsOptions), 
      userResolver,
      async (req: IGetUserAuthInfoRequest, res: Response) => {
        const { user } = req;
        const { assetId } = req.params;
    
        if (!user.isAuthenticated) {
          res.send(httpHelpers.getResult(false, 'User is not logged in.'));
          return;
        }
    
        if (!assetId) {
          res.send(httpHelpers.getResult(false, 'Asset ID is not defined.'));
          return;
        }
    
        try {
          const result = await assetService.deleteAsset(assetId, user.guid as string);
          this.flushCacheForUser(user.guid || '');
          res.send(httpHelpers.getResult(true, 'GREAT SUCCESS!'));
        } catch (e) {
          logger.warn(`Could not delete asset ${assetId}`, e);
          res.send(httpHelpers.getResult(false, 'Could not delete asset'));
        }
      },
    );
  }

}
