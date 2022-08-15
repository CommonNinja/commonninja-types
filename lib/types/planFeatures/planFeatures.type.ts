import { IModelWrapper } from '../common.types';

export interface IPlanFeature {
  id: string;
  name: string;
  displayName: string;
  description: string;
  type: 'number' | 'boolean';
  value: number | boolean | string | null;
  meta: {
    [key: string]: any;
  };
}

export interface IAppPlanFeatures extends IModelWrapper {
  appId: string;
  features: IPlanFeature[];
  version: number;
}
