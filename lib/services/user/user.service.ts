import { Request } from 'express';
import { IHttpResult } from '../../helpers/http/http.helpers';
import { BaseService } from '../base.service';
import { ResponseType } from '../../http';
import { ServiceName } from '../../globals/index';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_USERS_SERVICE_URL;

export interface ILegacyRegistrationData {
  source: ServiceName;
  userID: number;
  userGUID: string;
  plan_id: string;
  password: string;
  username: string;
  email: string;
}

export class UserService extends BaseService {
  async getUserGuid(userID, source): Promise<object> {
    const body = {
      userID, source,
    };
    const url = `${BASE_URL}/internal/legacy/getUserGuid`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getOldIdsByNewGuid(guid, source): Promise<any> {
    const body = {
      guid, source,
    };
    const url = `${BASE_URL}/internal/legacy/getOldIdsByNewGuid`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  // Should be removed after getting rid of the old users usage
  async legacyRegistration(body: ILegacyRegistrationData): Promise<object> {
    const url = `${BASE_URL}/internal/legacy/register`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getUserDetails(req: Request): Promise<object> {
    const url: string = `${BASE_URL}/internal/user`;
    const httpResult = <IHttpResult>await this.httpClient.getWithParams(url, { headers: { cookie: req.headers.cookie } }, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getUserById(userId: string): Promise<any> {
    const url: string = `${BASE_URL}/internal/user/${userId}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to user service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
  
}
