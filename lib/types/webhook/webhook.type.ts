import { IModelWrapper } from '../common.types';
import { TPlatform } from '../platform/platform.type';

export type TWebhookMessage =
  | 'unhandled'
  | 'unknown'
  | 'app.install'
  | 'app.uninstall'
  | 'checkout.created'
  | 'checkout.completed'
  | 'checkout.cancelled'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.suspended'
  | 'subscription.deleted'
  | 'payment.created'
  | 'payment.updated'
  | 'payment.refunded'
  | 'payment.deleted'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'customer.created'
  | 'customer.updated'
  | 'customer.deleted'
  | 'cart.created'
  | 'cart.updated'
  | 'cart.deleted'
  | 'order.created'
  | 'order.updated'
  | 'order.deleted'
  | 'shimpent.created'
  | 'shimpent.updated'
  | 'shimpent.deleted';

export interface IWebhookMessage extends IModelWrapper {
  type: TWebhookMessage;
  platformUserId: string;
  appId: string;
  platform: TPlatform;
  rawPayload?: any;
  payload?: any;
  id?: string;
}
