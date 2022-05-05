import { IModelWrapper } from '../common.types';
import { TPlatform } from '../platform/platform.type';

export interface IBucket extends IModelWrapper {
  id?: string;
  name?: string;
  appId?: string;
  platform?: TPlatform;
}

export interface IFolder extends IModelWrapper {
  id?: string;
  appId?: string;
  platform?: TPlatform;
  bucket?: string;
  name?: string;
  path?: string;
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
  folderId?: string | null;
  url?: string;
  body?: any;
  user?: {
    platform?: TPlatform;
    platformUserId?: string;
  };
}
