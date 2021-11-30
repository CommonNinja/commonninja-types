import { ResponseType } from '../../http';
import { BaseService } from '../base.service';
import { ServiceName } from '../../globals';
import { IHttpResult, IPaginationResponse } from '../../helpers/http/http.helpers';
import { ConfigFactory } from '../../config';
import { IMongoDBResultItem } from '../../db/mongodb';

const config = ConfigFactory.getConfig();
const BASE_URL = config.COMMONNINJA_RESOURCES_SERVICE_URL;

export enum AssetType {
  IMAGE     = 'image',
  VIDEO     = 'video',
  PDF       = 'pdf',
  CSV       = 'csv',
}

export interface IAsset extends IMongoDBResultItem {
  guid?: string;
  componentId?: string;
  userId: string;
  serviceName: ServiceName;
  assetType: AssetType;
  name: string;
  url: string;
}

export interface IAssetSearchTerms {
  userId?: string;
  componentId?: string;
  searchTerm?: string;
  serviceName?: ServiceName;
  assetType?: AssetType;
}

export class AssetService extends BaseService {
  private async getAssetsByFilter(filter: object, limit: number = 10, page: number = 1) {
    const url = `${BASE_URL}/internal/asset?filter=${JSON.stringify(filter)}&limit=${limit}&page=${page}`;
    const httpResult = <IHttpResult>await this.httpClient.get(url, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to asset service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async getAssets(terms: IAssetSearchTerms, limit: number = 10, page: number = 1): Promise<IPaginationResponse> {
    const filter: any = {};
    if (terms.searchTerm) {
      filter.name = {
        $regex: `.*${terms.searchTerm}*.`,
        $options: 'i',
      };
    }
    if (terms.assetType) {
      filter.assetType = terms.assetType;
    }
    if (terms.serviceName) {
      filter.serviceName = terms.serviceName;
    }
    if (terms.componentId) {
      filter.componentId = terms.componentId;
    }
    if (terms.userId) {
      filter.userId = terms.userId;
    }
    
    return this.getAssetsByFilter(filter, limit, page);
  }

  async createAsset(assetData: IAsset) {
    const url = `${BASE_URL}/internal/asset`;
    const httpResult = <IHttpResult>await this.httpClient.postApplicationJson(url, assetData, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to asset service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async updateAsset(guid: string, userId: string, assetData: IAsset) {
    const filter = {
      userId,
      guid,
    };

    const asset = await this.getAssetsByFilter(filter);
    if (!asset || !asset.total) {
      throw new Error('Asset does not exist');
    }

    const url = `${BASE_URL}/internal/asset/${guid}`;
    const httpResult = <IHttpResult>await this.httpClient.putApplicationJson(url, assetData, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to asset service: ${httpResult.message}`);
    }
    return httpResult.data;
  }

  async deleteAsset(guid: string, userId: string) {
    const filter = {
      userId,
      guid,
    };

    const asset = await this.getAssetsByFilter(filter);
    if (!asset || !asset.total) {
      throw new Error('Asset does not exist');
    }

    const url = `${BASE_URL}/internal/asset/${guid}`;
    const httpResult = <IHttpResult>await this.httpClient.delete(url, null, ResponseType.json, true);
    if (!httpResult.success) {
      throw new Error(`Error in request to asset service: ${httpResult.message}`);
    }
    return httpResult.data;
  }
}
