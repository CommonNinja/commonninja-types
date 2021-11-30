import { IHttpResult } from '../../helpers/http/http.helpers';
import { BaseService } from '../base.service';
import { ResponseType } from '../../http';
import { ServiceName, Component } from '../../globals/index';
import { services } from '../..';
import { LoggerFactory } from '../../log/index';
import { Request } from 'express';
import { ConfigFactory } from '../../config';
import { PermissionRole } from '../component/component.service';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_WIX_SERVICE_URL;
const logger = LoggerFactory.getLogger(__filename);

export interface IWixUserLegacyRegistrationData {
  source: ServiceName;
  userID: number;
  userGUID: string;
}

export interface IWixInstance {
  wixInstanceId: string;
  wixCompId: string;
  componentId: string;
  type: Component;
}

export interface IWixComponentParams {
  instanceId: string; 
  compId: string; 
  originCompId?: string; 
  originInstanceId?: string; 
  vendorProductId?: string;
}

export class WixService extends BaseService {
  async addInstance(body: IWixInstance): Promise<object> {
    const url = `${BASE_URL}/internal/instance/add`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to wix service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getComponentIdByInstance(wixInstanceId: string, wixCompId: string, type: Component): Promise<string> {
    const body = {
      wixInstanceId, 
      wixCompId,
      type,
    };
    const url = `${BASE_URL}/internal/instance/getComponentId`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to wix service: ${httpResult.message}`);
    }
    return httpResult.data ? httpResult.data.componentId : null;
  }

  async getUserGuid(userID: number, source: ServiceName): Promise<object> {
    const body = {
      userID, 
      source,
    };
    const url = `${BASE_URL}/internal/legacy/getUserGuid`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to wix service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async createComponent(req: Request, wixParams: IWixComponentParams, type: Component, defaultData: object, premiumManipulationMethod?: (data) => {}): Promise<any> {
    const userId = wixParams.instanceId;
    const params = {
      type,
      creationSource: 'wix',
      permissions: [{ user: userId, role: PermissionRole.OWNER, name: '' }],
    };

    let mergeP = null;

    if (wixParams.originInstanceId && wixParams.originInstanceId !== wixParams.instanceId) {
      // If is from duplicated site
      mergeP = this.getComponentIdByInstance(wixParams.originInstanceId, wixParams.originCompId || wixParams.compId, type).then((componentId) => {
        if (!componentId) {
          return Object.assign({}, defaultData, params);
        }
        
        return services.componentService.getComponentByGuid(componentId).then((component) => {
          let componentDuplication = Object.assign({}, component, params);

          // Removing premium features if needed
          if (!wixParams.vendorProductId && premiumManipulationMethod) {
            componentDuplication = premiumManipulationMethod(componentDuplication);
          }

          return componentDuplication;
        });
      }).catch((e) => {
        logger.error('Could not get component by instance, fallbacking to default data.', e);
        return Object.assign({}, defaultData, params);
      });
    } else if (wixParams.originCompId) {
      // If is from copied component
      mergeP = this.getComponentIdByInstance(wixParams.instanceId, wixParams.originCompId, type).then((componentId) => {
        if (!componentId) {
          return Object.assign({}, defaultData, params);
        }

        return services.componentService.getComponentByGuid(componentId).then((component) => {
          const componentDuplication = Object.assign({}, component, params);
          componentDuplication.name = `${component.name} copy`;
          return componentDuplication;
        });
      }).catch((e) => {
        logger.error('Could not get component by instance, fallbacking to default data.', e);
        return Object.assign({}, defaultData, params);
      });
    } else {
      mergeP = Promise.resolve(Object.assign({}, defaultData, params));
    }

    return mergeP.then(async (obj) => {
      try {
        // Removing unique fields
        delete obj._id;
        delete obj.guid;
        delete obj.galleryId;

        const componentCreation = await services.componentService.createComponent(obj, req);
        const instanceCreation = await this.addInstance({
          type,
          wixInstanceId: wixParams.instanceId,
          wixCompId: wixParams.compId,
          componentId: componentCreation.guid,
        });
        return componentCreation;
      } catch (e) {
        logger.error('Could not create wix component', e);
        return null;
      }
    });
  }

  // Should be removed after getting rid of the old users usage
  async legacyRegistration(body: IWixUserLegacyRegistrationData): Promise<object> {
    const url = `${BASE_URL}/internal/legacy/register`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to wix service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
  
}
