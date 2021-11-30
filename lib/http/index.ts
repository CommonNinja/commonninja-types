import nodeFetch, { Response, RequestInit } from 'node-fetch';

import { LoggerFactory } from '../log/index';
import { IHttpResult } from '../helpers/http/http.helpers';
import { ConfigFactory } from '../config';

const config = ConfigFactory.getConfig();

const logger = LoggerFactory.getLogger(__filename);
const { COMMONNINJA_SECRET } = config;

export enum ResponseType {
  json,
  text,
  bool,
  headers,
  status,
  responseObject,
}

export interface RequestParams extends RequestInit{}

export class HttpClient {
  private async makeRequest(url: string, params: RequestParams, responseType: ResponseType, attachSecretHeader?: boolean) {
    const finalUrl: string = url;
    if (attachSecretHeader) {
      // Attach secret header
      if (params.headers) {
        params.headers['ninja-secret'] = COMMONNINJA_SECRET;
      } else {
        params.headers = {
          'ninja-secret': COMMONNINJA_SECRET,
        };
      }
    }

    logger.debug(`Making request to "${finalUrl}" with params`, params);
    const response: Response = await nodeFetch(finalUrl, params);

    if (responseType === ResponseType.status) {
      logger.debug(`Request to "${url}" returned ${response.status} status code.`);
      return response.status;
    }

    if (responseType === ResponseType.responseObject) {
      logger.debug(`Request to "${url}" went through, returning response object.`);
      return response;
    }

    if (response.ok) {
      logger.debug(`Request to "${url}" went successfully`);

      switch (responseType) {
        case ResponseType.json:
          return await response.json();
        case ResponseType.text:
          return await response.text();
        case ResponseType.headers:
          const headers = {};
          for (const [key, value] of response.headers) {
            headers[key] = value;
          }
          return headers;
        default:
          return true;
      }
    }

    logger.error(`Request to "${url}" failed.`, response.status);

    if (responseType === ResponseType.bool) {
      return false;
    }

    const text = await response.text();
    throw new Error(`statusCode: ${response.status}, error text: ${text}`);
  }

  public get(url: string, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.makeRequest(url, { method: 'get' }, responseType, attachSecretHeader);
  }

  public getWithParams(url: string, params: RequestParams, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.makeRequest(url, Object.assign({}, params, {
      method: 'get',
    }), responseType, attachSecretHeader);
  }

  public post(url: string, params: RequestParams, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.makeRequest(url, Object.assign({}, params, {
      method: 'post',
    }), responseType, attachSecretHeader);
  }

  public put(url: string, params: RequestParams, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.makeRequest(url, Object.assign({}, params, {
      method: 'put',
    }), responseType, attachSecretHeader);
  }

  public patch(url: string, params: RequestParams, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.makeRequest(url, Object.assign({}, params, {
      method: 'patch',
    }), responseType, attachSecretHeader);
  }

  public delete(url: string, params: RequestParams, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.makeRequest(url, Object.assign({}, params, {
      method: 'delete',
    }), responseType, attachSecretHeader);
  }

  public postApplicationJson(url: string, body: object, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.post(url, {
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    }, responseType, attachSecretHeader);
  }

  public putApplicationJson(url: string, body: object, responseType: ResponseType = ResponseType.json, attachSecretHeader?: boolean): Promise<IHttpResult | boolean | string> {
    return this.put(url, {
      body: JSON.stringify(body),
      headers: {
        'content-type': 'application/json',
      },
    }, responseType, attachSecretHeader);
  }
}
