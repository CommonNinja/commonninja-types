import { ResponseType } from '../../http';
import { BaseService } from '../base.service';

import { ServiceName } from '../../globals';
import { IHttpResult, IPaginationResponse } from '../../helpers/http/http.helpers';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_PAYMENTS_SERVICE_URL;

export interface ISubscriptionData {
  userId: string;
  details: ISubscriptionType;
  status: string;
  ipnMessageId: string;
  subscriptionTypeId: string;
  isActive: true;
  source: string;
  created: Date;
  updated: Date;
}

export interface ISubscriptionType {
  id: string;
  services: [ServiceName];
  name: string;
  description: string;
  amount: number;
  period: string;
  itemId: string;
  data: any;
}

export class SubscriptionService extends BaseService {
  async getSubscriptionsByUserId(userId: string, filter: object = {}, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/getSubscriptionByUserId/${userId}?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to payments service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getPaymentsByUserId(userId: string, filter: object = {}, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/getPaymentsByUserId/${userId}?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to payments service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getSubscriptionTypesObjectById(): Promise<object> {
    const url = `${BASE_URL}/internal/subscriptionTypeById`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to payments service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getPlansByService(serviceName: ServiceName, filter: object = {}, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const url = `${BASE_URL}/internal/plan/getByService/${serviceName}?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to payments service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
}
