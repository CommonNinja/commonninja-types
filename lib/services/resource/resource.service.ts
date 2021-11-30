import { ResponseType, RequestParams } from '../../http';
import { BaseService } from '../base.service';

import { ServiceName } from '../../globals';
import { IHttpResult, IPaginationResponse } from '../../helpers/http/http.helpers';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_RESOURCES_SERVICE_URL;

export enum ResourceType {
  TEMPLATE    = 'template',
  SKIN        = 'skin',
  TYPE        = 'type',
  BACKGROUND  = 'background',
  FONT        = 'font',
  LAYOUT      = 'layout',
}

export interface IResource {
  numericId: number;
  guid: string;
  serviceName: ServiceName;
  resourceType: ResourceType;
  isPremium: boolean;
  name?: string;
  displayName?: string;
  url?: string;
  additionalData: any;
}

export class ResourceService extends BaseService {
  private async getResourceByFilter(filter: object, getAll = false, limit: number = 10, page: number = 1) {
    const url = `${BASE_URL}/internal/resource/${getAll ? 'all' : ''}?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to resource service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getAllResources(serviceName?: ServiceName, resourceType?: ResourceType): Promise<[IResource]> {
    const filter: any = {};
    if (resourceType) {
      filter.resourceType = resourceType;
    }
    if (serviceName) {
      filter.serviceName = serviceName;
    }

    return this.getResourceByFilter(filter, true);
  }

  async getResources(serviceName?: ServiceName, resourceType?: ResourceType, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const filter: any = {};
    if (resourceType) {
      filter.resourceType = resourceType;
    }
    if (serviceName) {
      filter.serviceName = serviceName;
    }
    
    return this.getResourceByFilter(filter, false, limit, page);
  }
}
