import { ResponseType } from '../../http';
import { BaseService } from '../base.service';

import { Component } from '../../globals';
import { IHttpResult, IPaginationResponse } from '../../helpers/http/http.helpers';
import { eventService } from '../';
import { IESIndexType, IESIndex, FunnelEventType } from '../event/event.service';
import { Request } from 'express';
import { ConfigFactory } from '../../config';
import { IMongoDBResultItem } from '../../db/mongodb';

const config = ConfigFactory.getConfig();
const BASE_URL = config.COMMONNINJA_COMPONENTS_SERVICE_URL;

export interface IComponentType {
  name: string;
  displayName: string;
  iconClass: string;
  buttonText: string;
  slug: string;
  teaser: string;
  serviceName: string;
  priority: number;
  developerId: string;
  status: 'draft' | 'published' | 'deleted';
  iconPaths?: number;
  categories?: string[];
  ribbon?: string;
  helpCenterLink?: string;
  meta?: {
    hero: {
      imageUrl: string;
      pluginId?: string;
    },
    keyBenefits: {
      title: string;
      description: string;
      icon: string;
    }[];
    keyFeatures: {
      title: string;
      description: string;
      imageUrl: string;
    }[];
    faq: {
      question: string;
      answer: string;
    }[];
    seo: {
      title: string;
      description: string;
      keywords: string[];
      image?: string;
    }
  };
}

export enum CreationSource {
  WEBSITE = 'website',
  WIX = 'wix',
  DUDA = 'duda',
  WEEBLY = 'weebly',
  SHOPIFY = 'shopify',
  BIGCOMMERCE = 'bigcommerce',
  WORDPRESS = 'wordpress',
  WOOCOMMERCE = 'woocommerce',
  ECWID = 'ecwid',
  MAGENTO = 'magento',
  SHIFT4SHOP = 'shift4shop',
}

export enum PermissionRole {
  RESELLER = 'reseller',
  OWNER = 'owner',
  EDITOR = 'editor',
  ANALYST = 'analyst',
  VIEWER = 'viewer',
}

export const PermissionRoleLevelMap: Map<PermissionRole, number> = new Map([
  [PermissionRole.RESELLER, 1],
  [PermissionRole.OWNER, 3],
  [PermissionRole.EDITOR, 5],
  [PermissionRole.ANALYST, 7],
  [PermissionRole.VIEWER, 9],
]);

export enum PermissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
}

export interface IComponentPermission {
  user: string;
  role: PermissionRole;
  name: string;
}

export interface IPermission extends IMongoDBResultItem {
  guid?: string;
  componentId: string;
  userId: string;
  userDetails: {
    email: string,
    name: string,
  };
  role: PermissionRole;
  status: PermissionStatus;
}

export interface ILegacyData {
  id: number;
  guid: string;
}

export interface IComponent extends IMongoDBResultItem {
  guid?: string;
  galleryId?: string;
  permissions?: IComponentPermission[];
  description?: string | null;
  name: string;
  type: Component;
  previewImage: string;
  data: any;
  creationSource: CreationSource;
  privacy: 'public' | 'private' | 'link' | 'password';
  status: 'draft' | 'published' | 'deleted';
  tier: 'free' | 'premium';
  modelVersion: number;
}

export class ComponentService extends BaseService {
  // Component methods

  public async countComponentsByFilter(filter: object): Promise<number> {
    const url = `${BASE_URL}/internal/component/count?filter=${JSON.stringify(filter)}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async getComponentsByFilter(filter: object, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/component?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async countComponentsByUserGuid(userId: string, componentType?: Component): Promise<number> {
    const filter: any = {
      'permissions.user': userId,
      status: {
        $ne: 'deleted',
      },
    };
    if (componentType) {
      filter.type = componentType;
    }

    return this.countComponentsByFilter(filter);
  }

  public async countPublicComponents(componentType?: Component, searchTerm?: string): Promise<number> {
    const filter: any = {
      status: 'published',
      privacy: 'public',
    };
    if (componentType) {
      filter.type = componentType;
    }
    if (searchTerm) {
      filter.name = {
        $regex: `.*${searchTerm}*.`,
        $options: 'i',
      };
    }

    return this.countComponentsByFilter(filter);
  }

  public async countAllComponents(componentType?: Component): Promise<number> {
    const filter: any = {};
    if (componentType) {
      filter.type = componentType;
    }

    return this.countComponentsByFilter(filter);
  }

  public async getPublicComponents(componentType: Component | null, limit: number = 10, page: number = 1, searchTerm?: string, includeEmptyThumbnails?: boolean): Promise<IPaginationResponse> {
    const filter: any = {
      status: 'published',
      privacy: 'public',
    };
    if (componentType) {
      filter.type = componentType;
    }
    if (searchTerm) {
      filter.name = {
        $regex: `.*${searchTerm}*.`,
        $options: 'i',
      };
    }
    if (!includeEmptyThumbnails) {
      filter.thumbnail = { $ne: '' };
    }

    return this.getComponentsByFilter(filter, limit, page);
  }

  public async getComponentByGuid(componentGuid: string, includeDeleted: boolean = false) {
    const url = `${BASE_URL}/internal/component/${componentGuid}${includeDeleted ? '?includeDeleted=true' : ''}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async getComponentByUserAndGuid(userId: string, guid: string) {
    const filter: any = {
      guid,
      'permissions.user': userId,
      status: {
        $ne: 'deleted',
      },
    };

    const result: IPaginationResponse = await this.getComponentsByFilter(filter);
    if (!result.total) {
      throw new Error(`Could not get component "${guid}" for user "${userId}"`);
    }
    return result.docs[0];
  }

  public async getComponentByGalleryId(galleryId: string) {
    const filter: any = {
      galleryId,
      status: {
        $ne: 'deleted',
      },
    };

    const result: IPaginationResponse = await this.getComponentsByFilter(filter);
    if (!result.total) {
      throw new Error(`Could not get component by galleryId: ${galleryId}`);
    }
    return result.docs[0];
  }

  public async getComponentsByUserGuid(userId: string, componentType?: Component, limit: number = 10, page: number = 1, searchTerm?: string): Promise<IPaginationResponse> {
    const filter: any = {
      'permissions.user': userId,
      status: {
        $ne: 'deleted',
      },
    };
    if (componentType) {
      filter.type = componentType;
    }
    if (searchTerm) {
      filter.name = {
        $regex: `.*${searchTerm}*.`,
        $options: 'i',
      };
    }

    return this.getComponentsByFilter(filter, limit, page);
  }

  public async updateManyComponents(filter: any, fields: any) {
    if (!filter) {
      throw new Error('Filter sholud not remain empty');
    }

    const url = `${BASE_URL}/internal/component/updateMany?filter=${JSON.stringify(filter)}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, fields, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async updateComponent(userId: string, componentGuid: string, componentData: IComponent | any) {
    const filter = {
      'permissions.user': userId,
      guid: componentGuid,
    };

    const component = await this.getComponentsByFilter(filter);
    if (!component || !component.total) {
      throw new Error('Component does not exist');
    }

    const url = `${BASE_URL}/internal/component/${componentGuid}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, componentData, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async createComponent(componentData: IComponent, req: Request, legacyData?: ILegacyData) {
    const url = `${BASE_URL}/internal/component`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, componentData, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }

    if (legacyData) {
      this.writeOldIds(legacyData.id, legacyData.guid, httpResult.data.guid, componentData.type);
    }

    // Send component creation event to ES
    eventService.send(IESIndexType.FUNNEL_EVENT_DOC, IESIndex.FUNNEL_EVENTS, FunnelEventType.COMPONENT_CREATION, {
      componentId: httpResult.data.guid,
      componentType: componentData.type,
      creationSource: componentData.creationSource,
      userId: componentData.permissions && componentData.permissions.length ? componentData.permissions[0].user : '',
    }, req.get('Referrer') || '', req);

    return httpResult.data;
  }

  // Component types
  public async getComponentTypesByFilter(filter: object, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/componentType?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  // Permission methods

  private async getPermissionsByFilter(filter: object, limit: number = 10, page: number = 1) {
    const url = `${BASE_URL}/internal/permission?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to permission service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getPermissionByGuid(guid: string) {
    const url = `${BASE_URL}/internal/permission/${guid}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getPermissions(terms: { searchTerm?: string, componentId?: string, userId?: string, status?: PermissionStatus }, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const filter: any = {};
    if (terms.searchTerm) {
      filter.userDetails.name = {
        $regex: `.*${terms.searchTerm}*.`,
        $options: 'i',
      };
    }
    if (terms.componentId) {
      filter.componentId = terms.componentId;
    }
    if (terms.userId) {
      filter.userId = terms.userId;
    }
    if (terms.status) {
      filter.status = terms.status;
    }
    
    return this.getPermissionsByFilter(filter, limit, page);
  }

  async createPermission(permissionData: IPermission) {
    const url = `${BASE_URL}/internal/permission`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, permissionData, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to permission service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async updatePermission(guid: string, permissionData: IPermission) {
    const filter = {
      guid,
    };

    const permission = await this.getPermissionsByFilter(filter);
    if (!permission || !permission.total) {
      throw new Error('Permission does not exist');
    }

    const url = `${BASE_URL}/internal/permission/${guid}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, permissionData, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to permission service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async deletePermission(guid: string) {
    const filter = {
      guid,
    };

    const permission = await this.getPermissionsByFilter(filter);
    if (!permission || !permission.total) {
      throw new Error('Permission does not exist');
    }

    const url = `${BASE_URL}/internal/permission/${guid}`;
    const httpResult = <IHttpResult>await this.httpClient.delete(url, null, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to permission service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  // Legacy methods

  async getOldIds(componentType: Component, oldId?: number, oldGuid?: string): Promise<string> {
    if (!oldId && !oldGuid) {
      throw new Error('Missing both ids (oldId & oldGuid');
    }

    let url = `${BASE_URL}/internal/legacy/findByOldIds?componentType=${componentType}`;
    if (oldId) {
      url += `&oldId=${oldId}`;
    }
    if (oldGuid) {
      url += `&oldGuid=${oldGuid}`;
    }
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    return httpResult.data ? httpResult.data.guid : null;
  }

  async writeOldIds(oldId: number, oldGuid: string, guid: string, componentType: Component): Promise<IHttpResult> {
    const url = `${BASE_URL}/internal/legacy`;
    const params = { oldId, oldGuid, guid, componentType };
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, params, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to component service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
}
