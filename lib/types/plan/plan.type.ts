import { IModelWrapper } from '../common.types';
import { TPayloadSubscriptionStatus } from '../subscription/subscription.type';

export interface IPlanVariant {
  id: string;
  name: string;
  priceCount: number;
  pricePeriod: 'day' | 'week' | 'month' | 'year' | 'lifetime' | 'one-time';
  pricePeriodCount: number;
  checkoutUrls: {
    [key: string]: string;
  };
}

export interface IPlan extends IModelWrapper {
  appId: string;
  currency: string;
  description: string;
  features: {
    [key: string]: any;
  };
  isActive: boolean;
  isFree: boolean;
  meta: {
    [key: string]: any;
  };
  name: string;
  planId: string;
  trialCount: number;
  trialPeriod: '' | 'day' | 'week' | 'month' | 'year';
  pricingVariants: IPlanVariant[];
}

export interface IUserPlan extends IPlan {
  subscription: {
    status: null | TPayloadSubscriptionStatus;
    platformSubscriptionId: null | string;
    planPricingVariantId: null | string;
  };
}