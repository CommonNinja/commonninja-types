import { Request, Response, NextFunction, RequestHandler } from 'express';
import * as isUUID from 'is-uuid';

import { LoggerFactory } from '../../log';
import { Component, ServiceName } from '../../globals';
import { services } from '../..';
import { Cache, RedisCache } from '../../cache';
import { UserRole, IUser } from '../user/user.helpers';
import { IComponent, IComponentType, IPermission, PermissionRoleLevelMap } from '../../services/component/component.service';
import { HttpHelpers, IPaginationResponse } from '../http/http.helpers';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();
const { ENABLE_REDIS, REDIS_URI } = config;
const ttl = 60 * 60 * 1; // 1 Hour
const cacheInstance = ENABLE_REDIS === 'true' ? new RedisCache(REDIS_URI, ttl) : new Cache(ttl);
const logger = LoggerFactory.getLogger(__filename);
const { getResult } = new HttpHelpers();

export interface IComponentRequest extends Request {
  user?: {
    isAuthenticated: boolean;
    guid: string;
    fullName: string;
    role: UserRole;
    isPremium?: boolean;
  };
  components?: {
    docs: [IComponent?];
  };
  component?: IComponent;
  componentsCount?: number;
}

function clearComponentCache(componentId: string, component: IComponent, userId: string) {
  cacheInstance.del(`loadComponentByUserAndGUID_${userId}_${componentId}`);
  cacheInstance.delStartWith(`loadUserComponents_${userId}`);
  cacheInstance.delStartWith(`loadUserComponents_${userId}_${component.type}`);
  cacheInstance.del(`loadComponentByGUID_${componentId}`);
  cacheInstance.del(`loadComponentByGalleryId_${component.type}_${component.galleryId}`);
}

export class ComponentHelpers {
  private async getComponentByOldId(componentType: Component, oldCompId?: number, oldCompGuid?: string) {
    try {
      const guid = await services.componentService.getOldIds(componentType, oldCompId ? oldCompId : null, oldCompGuid);
      const component = await services.componentService.getComponentByGuid(guid);
      return component;
    } catch (e) {
      logger.error('Could not get component guid by old id', e);
      return null;
    }
  }

  private async countComponents(componentType, whereType, term): Promise<number> {
    try {
      switch (whereType) {
        case 'user': {
          return await services.componentService.countComponentsByUserGuid(term, componentType);
        }
        default:
          return await services.componentService.countAllComponents(componentType);
      }
    } catch (e) {
      logger.warn('Could not get count result', e);
      return 0;
    }
  }

  public async getComponentTypes(filter: any = {}, limit: number = 1000, page = 1): Promise<IComponentType[]> {
    try {
      const key = `componentTypes_${JSON.stringify(filter)}_${limit}_${page}`;
      const componentTypes = await cacheInstance.get(key, () => services.componentService.getComponentTypesByFilter(filter, limit, page));
      return componentTypes.docs as IComponentType[];
    } catch (e) {
      logger.error('Could not get component types.', e);
      return [];
    }
  }

  public loadComponentsCountMiddleware(useCache: boolean, componentType: Component, whereType?: string, term?: string): RequestHandler {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const where = whereType ? `_${whereType}` : '';
      let finalTerm = term;
      if (whereType === 'user') {
        finalTerm = req.user.guid;
      }
      const searchTerm = finalTerm ? `_${finalTerm.replace(/ /g, '')}` : '';
      const key = `countComponents_${componentType || 'all'}${where}${searchTerm}`;

      req.componentsCount = 0;

      try {
        if (useCache) {
          req.componentsCount = await cacheInstance.get(key, () => this.countComponents(componentType, whereType, finalTerm));
        } else {
          req.componentsCount = await this.countComponents(componentType, whereType, finalTerm);
        }
      } catch (e) {
        logger.warn('Could not count components', e);
      }
      
      next();
    };
  }
  
  public loadPublicComponentsMiddleware(componentType: Component | null, limit: number = 16, includeEmptyThumbnails: boolean = true): RequestHandler {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const searchTerm = req.query.search as string || null;
      const key = `loadPublicComponents_${componentType || 'general'}_${searchTerm || 'all'}_${limit}_${page}`;

      req.components = {
        docs: [],
      };

      try {
        const components = await cacheInstance.get(key, () => services.componentService.getPublicComponents(componentType, limit, page, searchTerm, includeEmptyThumbnails));
        req.components = components;
      } catch (e) {
        logger.warn('Could not get public components.');
      }

      next();
    };
  }

  public loadUserComponentsMiddleware(componentType: Component, limit: number = 16): RequestHandler {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const { user } = req;

      req.components = {
        docs: [],
      };

      if (!user || !user.guid) {
        next();
        return;
      }

      const userId = user.guid;
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const searchTerm = req.query.search as string || null;
      const key = `loadUserComponents_${userId}_${componentType}_${searchTerm || 'all'}_${limit}_${page}`;

      try {
        const components = await cacheInstance.get(key, () => services.componentService.getComponentsByUserGuid(userId, componentType, limit, page, searchTerm));
        req.components = components;
      } catch (e) {
        logger.warn('Could not get user components.');
      }

      next();
    };
  }

  public loadComponentByGalleryIdMiddleware(componentType?: Component, serviceName?: ServiceName): RequestHandler {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const { galleryId } = req.params;
      
      req.component = null;

      if (!galleryId) {
        logger.warn('Gallery ID is not defined');
        next();
        return;
      }

      try {
        const key = `loadComponentByGalleryId_${componentType || 'component'}_${galleryId}`;
        if (!isUUID.anyNonNil(galleryId) && componentType && serviceName) {
          const id = parseInt(galleryId, 10);
          if (isNaN(id)) {
            logger.error('Gallery id is neither guid or old id.');
            next();
            return;
          }
  
          req.component = await cacheInstance.get(key, () => this.getComponentByOldId(componentType, id));
          next();
          return;
        }
  
        req.component = await cacheInstance.get(key, () => services.componentService.getComponentByGalleryId(galleryId));
      } catch (e) {
        logger.warn('Could not get component by galleryId', e);
      }
      next();
    };
  }

  public loadComponentByGuidMiddleware(componentType?: Component, serviceName?: ServiceName): RequestHandler {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const { componentId } = req.params;
      
      req.component = null;

      if (!componentId) {
        next();
        return;
      }

      try {
        const key = `loadComponentByGUID_${componentId}`;
  
        if (!isUUID.anyNonNil(componentId)) {
          if (!componentType) {
            next();
            return;
          }
          req.component = await cacheInstance.get(key, () => this.getComponentByOldId(componentType, null, componentId));
          next();
          return;
        }
        
        req.component = await cacheInstance.get(key, () => services.componentService.getComponentByGuid(componentId));
      } catch (e) {
        logger.warn('Could not get component by componentId', e);
      }

      next();
    };
  }

  public loadComponentForEditorMiddleware(defaultComponent?: IComponent) {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const { user } = req;
      const { componentId } = req.params;
      
      req.component = null;

      if (!componentId) {
        if (defaultComponent) {
          req.component = Object.assign({}, defaultComponent, {});
        }
        next();
        return;
      }

      if (!user || !user.guid) {
        next();
        return;
      }

      const userRole = user.role;
      const userId = user.guid;

      try {
        if (userRole === UserRole.ADMIN) {
          const key = `loadComponentByGUID_${componentId}`;
          req.component = await cacheInstance.get(key, () => services.componentService.getComponentByGuid(componentId));
        } else {
          const key = `loadComponentByUserAndGUID_${userId}_${componentId}`;
          req.component = await cacheInstance.get(key, () => services.componentService.getComponentByUserAndGuid(userId, componentId));
        }
      } catch (e) {
        logger.warn('Could not get component by componentId and userId', e);
      }

      next();
    };
  }

  public createComponentMiddleware(sendResponse: boolean) {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const componentData: IComponent = req.component;

      try {
        if (!componentData) {
          throw new Error('Missing component data in request.');
        }

        const insertResult = await services.componentService.createComponent(componentData, req);
        const { user } = req;
        if (user && user.guid) {
          cacheInstance.delStartWith(`loadUserComponents_${user.guid}_${componentData.type}`);
          cacheInstance.delStartWith(`loadUserComponents_${user.guid}`);
        }

        // Create a screenshot, attach to preview image
        services.exportService.createScreenshotAfterUpdate(insertResult.guid, componentData.type);

        if (sendResponse) {
          res.send(getResult(true, 'GREAT SUCCESS!', insertResult));
          return;
        }

        req.component = insertResult;
      } catch (e) {
        logger.error('Failed to add component', e);
        if (sendResponse) {
          res.send(getResult(false, 'Could not add component.'));
          return;
        }
      }

      next();
    };
  }

  public async updateComponentMiddleware(req: IComponentRequest, res: Response) {
    const { componentId } = req.params;
    const { component } = req;
    let tempComponentData: any = {};

    try {
      // Load original component only if it wasn't loaded already
      if (!component?.guid) {
        tempComponentData = await services.componentService.getComponentByGuid(componentId);
        
        if (!tempComponentData) {
          logger.info('Failed to update component because it does not exist.');
          res.send(getResult(false, 'Plugin doesn\'t exists.'));
          return;
        }
      }
  
      const finalData: IComponent = Object.assign({}, tempComponentData, component);
      const userId = finalData.permissions[0].user;

      // Update only relevant fields
      await services.componentService.updateComponent(userId, finalData.guid, {
        name: finalData.name,
        description: finalData.description,
        data: finalData.data,
        modelVersion: finalData.modelVersion,
        status: finalData.status,
        privacy: finalData.privacy,
        permissions: finalData.permissions,
      } as IComponent);

      clearComponentCache(finalData.guid, finalData, userId);

      // Create a screenshot, attach to preview image
      services.exportService.createScreenshotAfterUpdate(finalData.guid, finalData.type);

      res.send(getResult(true, '', finalData));
    } catch (e) {
      logger.warn('Could not update component', e);
      res.send(getResult(false, 'Could not update plugin.'));
    }
  }

  public async deleteComponentMiddleware(req: IComponentRequest, res: Response) {
    const { component } = req;
    
    if (!component?.guid) {
      logger.info('Failed to delete component because it does not exist.');
      res.send(getResult(false, 'Plugin doesn\'t exists.'));
      return;
    }

    try {
      const userId = component.permissions?.[0]?.user;
      if (!userId) {
        throw new Error(`Could not extract userId for "${component.guid}"`);
      }
      await services.componentService.updateComponent(userId, component.guid, { status: 'deleted' });

      // Clear cache
      clearComponentCache(component.guid, component, userId);

      res.send(getResult(true, 'GREAT SUCCESS!'));
    } catch (e) {
      logger.warn('Could not delete component.', e);
      res.send(getResult(false, 'Could not delete plugin.'));
    }
  }

  public clearComponentCache(componentId: string, component: IComponent, userId: string) {
    clearComponentCache(componentId, component, userId);
  }

  public async validateAccessLevel(allowedAccessLevel: number, user: IUser, plugin: IComponent | null): Promise<boolean> {
    if (!plugin || !user) {
      return false;
    }

    if (user?.role === UserRole.ADMIN || plugin.permissions?.[0].user === user?.guid) {
      return true;
    }

    try {
      const permissionsRes: IPaginationResponse = await services.componentService.getPermissions({ userId: user.guid, componentId: plugin.guid }, 1);
      if (permissionsRes.total > 0) {
        const permission: IPermission = permissionsRes.docs[0];

        // Check if user role is lower or equal to access level (lower means higher for access levels)
        if ((PermissionRoleLevelMap.get(permission.role) || 9) <= allowedAccessLevel) {
          return true;
        }
      }
    } catch (e) {
      logger.warn(`Could not get permissions for user "${user.guid}" and component "${plugin.guid}"`, e);
    }

    return false;
  }

  public validateAccessLevelMiddleware(allowedAccessLevel: number) {
    return async (req: IComponentRequest, res: Response, next: NextFunction) => {
      const { user } = req;
      const plugin = req.component;

      if (!user || !user.isAuthenticated) {
        res.send(getResult(false, 'User isn\'t authenticated.'));
        return;
      }

      if (!plugin) {
        res.send(getResult(false, 'Plugin not found.'));
        return;
      }

      const hasAccess: boolean = await this.validateAccessLevel(allowedAccessLevel, user, plugin);

      if (hasAccess) {
        next();
        return;
      }

      res.send(getResult(false, 'You don\'t have access to perform this action on the plugin.'));
    };
  }
}
