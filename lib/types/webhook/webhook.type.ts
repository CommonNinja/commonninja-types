import { TPlatform } from '../platform/platform.type';

export type TWebhookMessage =
  | 'unknown'
  | 'app.install'
  | 'app.uninstall'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.deleted'
  | 'payment.created'
  | 'payment.updated'
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

export interface IWebhookMessage {
  type: TWebhookMessage;
  status: 'received' | 'pending' | 'sent' | 'failed';
  platformUserId: string;
  appId: string;
  platform: TPlatform;
  rawPayload?: any;
  payload?: any;
  id?: string;
}
