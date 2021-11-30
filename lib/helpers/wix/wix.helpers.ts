import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';

import { LoggerFactory } from '../../log/index';
import { HttpHelpers } from '../http/http.helpers';
import { services } from '../..';
import { Component } from '../../globals';
import { IComponentRequest } from '../component/component.helpers';
import { UserRole } from '../user/user.helpers';
import { Cache, RedisCache } from '../../cache';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const { ENABLE_REDIS, REDIS_URI } = config;
const ttl = 60 * 60 * 1; // 1 Hour
const cacheInstance = ENABLE_REDIS === 'true' ? new RedisCache(REDIS_URI, ttl) : new Cache(ttl);
const logger = LoggerFactory.getLogger(__filename);
const { getResult } = new HttpHelpers();
const APP_SECRET = config.WIX_APP_SECRET;

export interface IWixInstanceData {
  instanceId: string;
  signDate: string;
  uid: string;
  permissions: string;
  ipAndPort: string;
  vendorProductId: string;
  aid: string;
  originInstanceId: string;
  siteOwnerId: string;
}

export interface IWixInstanceDataWithComp extends IWixInstanceData {
  origCompId?: string;
  originCompId?: string;
  compId?: string;
}

export interface IWixInstanceResult {
  verified: boolean;
  data: IWixInstanceData;
}

export interface IWixInstanceRequest extends Request {
  wixInstanceData?: IWixInstanceDataWithComp;
}

export interface IWixComponentRequest extends IWixInstanceRequest, IComponentRequest {}

export class WixHelpers {
  public decode(data: string, encodingType: string): string | Buffer {
    const encoding = encodingType === undefined ? 'utf8' : encodingType;
    const buf = new Buffer(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
    return encoding ? buf.toString(encoding) : buf;
  }

  public verifyInstance(instance: string, appSecret: string): IWixInstanceResult {
    if (!appSecret) {
      throw new Error('App secret is empty.');
    }
    
    if (!instance) {
      throw new Error('Instance parameter is empty.');
    }
    
    try {
      // spilt the instance into signature and data
      const pair = instance.split('.');
      const signature = this.decode(pair[0], 'binary');
      const data = pair[1];
      // sign the data using hmac-sha1-256
      const hmac = crypto.createHmac('sha256', appSecret);
      const newSignature = hmac.update(data).digest('binary' as crypto.HexBase64Latin1Encoding);
      const json: IWixInstanceData = JSON.parse(Buffer.from(data, 'base64').toString());

      return {
        verified: (signature === newSignature),
        data: json,
      };
    } catch (e) {
      logger.error('Could not validate instance', e);
      throw new Error('Could not validate instance');
    }
  }

  public loadInstanceWithSecretMiddleware(appSecret: string) {
    return async (req: IWixComponentRequest, res: Response, next: NextFunction) => {
      const { instance, origCompId, originCompId, compId } = req.query;
      let verifiedInstance;
  
      if (!instance) {
        res.send(getResult(false, 'Instance is missing in query parameters.'));
        return;
      }
  
      if (!appSecret) {
        res.send(getResult(false, 'Missing app secret key.'));
        return;
      }
      
      try {
        verifiedInstance = this.verifyInstance(instance as string, appSecret);
      } catch (e) {
        logger.error('Error while verifying instance.', e);
        res.send(getResult(false, 'Could not verify app.'));
        return;
      }
  
      if (!verifiedInstance.verified) {
        logger.info('Instance is not verified.');
        res.send(getResult(false, 'Could not verify app.'));
        return;
      }
  
      req.wixInstanceData = Object.assign({}, (verifiedInstance.data || {}), { origCompId, compId, originCompId });
  
      next();
    };
  }

  public loadInstanceMiddleware = (req: IWixInstanceRequest, res: Response, next: NextFunction) => {
    const { instance, origCompId, originCompId, compId } = req.query;
    let verifiedInstance;

    if (!instance) {
      res.send(getResult(false, 'Instance is missing in query parameters.'));
      return;
    }

    if (!APP_SECRET) {
      res.send(getResult(false, 'Missing app secret key.'));
      return;
    }
    
    try {
      verifiedInstance = this.verifyInstance(instance as string, APP_SECRET);
    } catch (e) {
      logger.error('Error while verifying instance.', e);
      res.send(getResult(false, 'Could not verify app.'));
      return;
    }

    if (!verifiedInstance.verified) {
      logger.info('Instance is not verified.');
      res.send(getResult(false, 'Could not verify app.'));
      return;
    }

    req.wixInstanceData = Object.assign({}, (verifiedInstance.data || {}), { origCompId, compId, originCompId });

    next();
  }

  public loadWixUserMiddleware(req: IWixComponentRequest, res: Response, next: NextFunction) {
    req.user = {
      isAuthenticated: false,
      guid: null,
      fullName: '',
      isPremium: false,
      role: UserRole.GUEST,
    };

    const { wixInstanceData } = req;

    if (wixInstanceData && wixInstanceData.instanceId) {
      req.user = {
        isAuthenticated: true,
        guid: wixInstanceData.instanceId,
        fullName: 'Wix User',
        role: UserRole.USER,
        isPremium: wixInstanceData.vendorProductId ? true : false,
      };
    }

    next();
  }

  public loadComponentForEditorMiddleware(componentType: Component, defaultData: object) {
    return async (req: IWixComponentRequest, res: Response, next: NextFunction) => {
      const { wixInstanceData } = req;
      const key = `getComponentIdByInstance_${componentType}_${wixInstanceData.instanceId}_${wixInstanceData.origCompId}`;
      req.component = null;

      try {
        const componentId = await cacheInstance.get(key, () => services.wixService.getComponentIdByInstance(wixInstanceData.instanceId, wixInstanceData.origCompId, componentType));
        if (componentId) {
          req.component = await services.componentService.getComponentByGuid(componentId);
          next();
          return;
        }
      } catch (e) {
        logger.info(`Component ID not found "${wixInstanceData.origCompId}", creating a new one.`);
      }

      try {
        req.component = await services.wixService.createComponent(req, {
          compId: wixInstanceData.origCompId,
          instanceId: wixInstanceData.instanceId,
          originCompId: wixInstanceData.originCompId,
          originInstanceId: wixInstanceData.originInstanceId,
          vendorProductId: wixInstanceData.vendorProductId,
        }, componentType, defaultData);
      } catch (e) {
        logger.error('Could not create wix component', e);
      }

      next();
    };
  }

  public loadComponentForViewerMiddleware(componentType: Component, defaultData: object, premiumManipulationMethod?: (data) => {}) {
    return async (req: IWixComponentRequest, res: Response, next: NextFunction) => {
      const { wixInstanceData } = req;
      const key = `getComponentIdByInstance_${componentType}_${wixInstanceData.instanceId}_${wixInstanceData.compId}`;
      req.component = null;

      try {
        const componentId = await cacheInstance.get(key, () => services.wixService.getComponentIdByInstance(wixInstanceData.instanceId, wixInstanceData.compId, componentType));
        if (componentId) {
          req.component = await services.componentService.getComponentByGuid(componentId);
          next();
          return;
        }
      } catch (e) {
        logger.debug(`Component ID not found for instance "${wixInstanceData.instanceId}" and component "${wixInstanceData.compId}", creating a new one`);
      }

      try {
        req.component = await services.wixService.createComponent(req, {
          compId: wixInstanceData.compId,
          instanceId: wixInstanceData.instanceId,
          originCompId: wixInstanceData.originCompId,
          originInstanceId: wixInstanceData.originInstanceId,
          vendorProductId: wixInstanceData.vendorProductId,
        }, componentType, defaultData, premiumManipulationMethod);
      } catch (e) {
        logger.error('Could not create wix component', e);
      }

      next();
    };
  }
}
