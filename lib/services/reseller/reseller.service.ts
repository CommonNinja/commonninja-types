import { Request } from 'express';
import { IHttpResult, IPaginationResponse } from '../../helpers/http/http.helpers';
import { BaseService } from '../base.service';
import { ResponseType } from '../../http';
import { ServiceName } from '../../globals/index';
import { ConfigFactory } from '../../config';
import { IUser } from '../../helpers/user/user.helpers';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_USERS_SERVICE_URL;

export interface IResellerDetails {
  name: string;
  logo?: string;
  website?: string;
  contactEmail?: string;
}

export interface IReseller {
  resellerId: string;
  userId: string;
  resellerDetails: IResellerDetails;
  subscriptionId: string;
  secretKey: string;
  formToken: string;
  serviceName: ServiceName;
  settings: any;
  status: 'active' | 'deleted';
  created?: Date;
  updated?: Date;
}

export interface IResellerComponent {
  resellerId: string;
  componentId: string;
  galleryId: string;
  componentTitle: string;
  editToken: string;
  userDetails: {
    email: string;
    name: string;
  };
  extraFields: any;
  notes: string;
  status: 'active' | 'deleted';
  created?: Date;
  updated?: Date;
}

export interface IResellerWithUserDetails extends IReseller {
  userDetails?: IUser;
}

export class ResellerService extends BaseService {
  // Reseller

  private async getResellersByFilter(filter: object, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/reseller?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async getResellerById(resellerId: string): Promise<IReseller> {
    const url = `${BASE_URL}/internal/reseller/${resellerId}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async getResellersByUserId(userId: string, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    return await this.getResellersByFilter({ userId }, limit, page);
  }

  public async updateReseller(resellerId: string, data: IReseller) {
    const url = `${BASE_URL}/internal/reseller/${resellerId}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, data, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async updateResellerData(resellerId: string, data: any) {
    const url = `${BASE_URL}/internal/reseller/${resellerId}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, data, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  // Reseller components

  public async getResellerComponentsByFilter(filter: object, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/reseller/component?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async getResellersComponentsByResellerId(resellerId: string, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    return await this.getResellerComponentsByFilter({ resellerId }, limit, page);
  }

  public async getResellerComponentByResellerAndComponentId(resellerId: string, componentId: string): Promise<IResellerComponent> {
    const url = `${BASE_URL}/internal/reseller/${resellerId}/component/${componentId}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async getResellerComponentById(componentId: string): Promise<IResellerComponent> {
    const url = `${BASE_URL}/internal/reseller/component/${componentId}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async createResellerComponent(resellerId: string, data: IResellerComponent) {
    const url = `${BASE_URL}/internal/reseller/${resellerId}/component`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, data, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async updateResellerComponent(resellerId: string, componentId: string, data: IResellerComponent) {
    const url = `${BASE_URL}/internal/reseller/${resellerId}/component/${componentId}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, data, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  public async deleteResellerComponent(resellerId: string, componentId: string) {
    const url = `${BASE_URL}/internal/reseller/${resellerId}/component/${componentId}`;
    const httpResult = <IHttpResult>await this.httpClient.delete(url, null, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
}
