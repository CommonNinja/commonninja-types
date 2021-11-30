import { IHttpResult } from '../../helpers/http/http.helpers';
import { BaseService } from '../base.service';
import { ResponseType } from '../../http';
import { Component } from '../../globals';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const BASE_URL = config.COMMONNINJA_EXPORT_SERVICE_URL;
const querystring = require('querystring');

export interface IExportParams {
  componentType: Component;
  format: 'image' | 'pdf';
  width?: number;
  height?: number;
  delay?: number;
  hideElements?: string;
  selector?: string;
  selectorType?: 'id' | 'class' | 'tag';
}

export interface IExportResonse {
  jobId: number;
}

export interface IExportJobResonse {
  status: 'processing' | 'done' | 'error';
  data: any;
  jobId: number;
  created: number;
}

export class ExportService extends BaseService {
  public async createExportJob(urlToExport: string, params: IExportParams): Promise<IExportResonse> {
    let query = `url=${encodeURIComponent(urlToExport)}`;
    
    if (params) {
      query += `&${querystring.stringify(params)}`;
    }

    const url = `${BASE_URL}/export/new?${query}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to export service: ${httpResult.message}`);
    }

    return {
      jobId: httpResult.data.jobId,
    };
  }

  public async getJobStatus(jobId: number): Promise<IExportJobResonse> {
    const url = `${BASE_URL}/export/new/job/${jobId}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to export service: ${httpResult.message}`);
    }

    const { status, data, created } = httpResult.data;

    return {
      jobId,
      status,
      data,
      created,
    };
  }

  public async createScreenshotAfterUpdate(componentId: string, componentType: Component) {
    const url = `${BASE_URL}/internal/export/component?id=${componentId}&type=${componentType}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to export service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
  
  public async ssr(urlToCrawl: string) {
    const url = `${BASE_URL}/internal/ssr?url=${encodeURIComponent(urlToCrawl)}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to export service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
}
