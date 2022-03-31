import { TPlatform } from '../platform/platform.type';

export type TWebhookMessage =
  | 'unknown'
  | 'app.install'
  | 'app.uninstall'
  | 'subscription.created'
  | 'subscription.updated'
  | 'subscription.deleted'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
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
