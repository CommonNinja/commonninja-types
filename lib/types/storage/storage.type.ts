import { IModelWrapper } from '../common.types';
import { TPlatform } from '../platform/platform.type';

export interface IBucket extends IModelWrapper {
  id?: string;
  name?: string;
  appId?: string;
  platform?: TPlatform;
  user?: {
    platform?: TPlatform;
    platformUserId?: string;
  };
}

export interface IFile extends IModelWrapper {
  id?: string;
  bucket?: string;
  appId?: string;
  platform?: TPlatform;
  contentType?: string;
  name?: string;
  size?: number;
  url?: string;
  body?: any;
  user?: {
    platform?: TPlatform;
    platformUserId?: string;
  };
}
