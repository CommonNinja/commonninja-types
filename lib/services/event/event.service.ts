import { ResponseType, RequestParams } from '../../http';
import { Request } from 'express';
import * as UAParser from 'ua-parser-js';
import * as geoip from 'geoip-lite';

import { BaseService } from '../base.service';
import { Component } from '../../globals';
import { IHttpResult } from '../../helpers/http/http.helpers';
import { URL } from 'url';
import { CreationSource } from '../component/component.service';
import { LoggerFactory } from '../../log';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_EVENTS_SERVICE_URL;
const isDev = config.ENV_NAME !== 'prod';
const logger = LoggerFactory.getLogger(__filename);

export type TEvent = ClientEventType | FunnelEventType | EngagementEventType | PerformanceEventType;

export enum ClientEventType {
  INSTALL       = 'install',
  REQUEST       = 'request',
  IMPRESSION    = 'impression',
  VIEW          = 'view',
}

export enum FunnelEventType {
  USER_VISIT                    = 'user-visit',
  USER_EDITOR_VISIT             = 'user-editor-visit',    // Client side
  USER_CREATION                 = 'user-creation',
  COMPONENT_CREATION            = 'component-creation',
  PRICING_PLAN_VISIT            = 'pricing-plan-visit',   // Client side
  PRICING_PLAN_SELECT           = 'pricing-plan-select',  // Client side
  PRICING_PLAN_SUBMIT           = 'pricing-plan-submit',  // Client side
  PRICING_PLAN_CHANGE           = 'pricing-plan-change',  // Client side
  SUBSCRIPTION_CREATION         = 'subscription-creation',
  SUBSCRIPTION_CHANGE           = 'subscription-change',
}

export enum EngagementEventType {
  CLICK = 'click',
  HOVER = 'hover',
  SCROL = 'scroll',
}

export enum PerformanceEventType {}

export enum IESIndexType {
  CLIENT_EVENT_DOC        = 'client-event-doc',
  FUNNEL_EVENT_DOC        = 'funnel-event-doc',
  ENGAGEMENT_EVENT_DOC    = 'engagement-event-doc',
  PERFORMANCE_EVENT_DOC   = 'performance-event-doc',
}

export enum IESIndex {
  CLIENT_EVENTS         = 'client-events',
  FUNNEL_EVENTS         = 'funnel-events',
  ENGAGEMENT_EVENTS     = 'engagement-events',
  PERFORMANCE_EVENTS    = 'performance-events',
}

export interface IEventBody extends IComponentParams {
  eventVersion: number;
  eventType: TEvent;
  ip: string;
  country: string;
  city: string;
  language: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion?: string;
  deviceType?: string;
  deviceModel?: string;
  deviceVendor?: string;
  protocol: string;
  host: string;
  path: string;
  queryParams: string;
}

export interface IGeoInfo {
  country: string;
  city: string;
  ip: string;
}

export interface IComponentParams {
  creationSource: CreationSource;
  componentId: string;
  componentType: Component;
  userId: string;
}

export interface IEvent {
  index: IESIndex;
  type: IESIndexType;
  body: IEventBody;
}

export class EventService extends BaseService {
  private extractGeoInfo(req: Request): IGeoInfo {
    let ip: any = req.headers['x-forwarded-for'];
    if (ip) {
      const list = ip.split(',');
      ip = list[list.length - 1];
    } else {
      ip = req.connection.remoteAddress || '';
    }

    const defaultObj = {
      ip,
      country: '',
      city: '',
    };

    if (!ip) {
      return defaultObj;
    }

    return Object.assign({}, defaultObj, (geoip.lookup(ip) || {}));
  }

  private extractBody(eventType: TEvent, eventVersion: number, componentParams: IComponentParams, eventSourceUrl: string, req: Request): IEventBody {
    const language:string = req.acceptsLanguages()[0] || '';
    const urlParams: URL = new URL(eventSourceUrl || 'https://www.commoninja.com');
    const ua = UAParser(req.headers['user-agent']);
    const geoInfo: IGeoInfo = this.extractGeoInfo(req);

    return {
      eventVersion,
      eventType,
      language,
      ip: geoInfo.ip || '',
      country: geoInfo.country || '',
      city: geoInfo.city || '',
      browser: ua.browser.name || '',
      browserVersion: ua.browser.version || '',
      os: ua.os.name || '',
      osVersion: ua.os.version || '',
      deviceType: ua.device.name || '',
      deviceModel: ua.device.model || '',
      deviceVendor: ua.device.vendor || '',
      protocol: urlParams.protocol,
      host: urlParams.hostname,
      path: urlParams.pathname,
      queryParams: urlParams.search,
      creationSource: componentParams.creationSource,
      componentId: componentParams.componentId,
      componentType: componentParams.componentType,
      userId: componentParams.userId,
    };
  }

  async send(type: IESIndexType, index: IESIndex, eventType: TEvent, componentParams: IComponentParams, eventSourceUrl: string, req: Request, eventVersion: number = 1, extraBodyParams?: any) {
    const event: IEvent = {
      index,
      type,
      body: Object.assign({}, this.extractBody(eventType, eventVersion, componentParams, eventSourceUrl, req), extraBodyParams || {}),
    };
    const url = `${BASE_URL}/internal/document`;
    if (isDev) {
      logger.info('Posting event to ES', url, event);
      return;
    }
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, event, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to event service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async search(body: object) {
    const url = `${BASE_URL}/internal/search`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to event service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async count(body: object) {
    const url = `${BASE_URL}/internal/count`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, body, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to event service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
}
