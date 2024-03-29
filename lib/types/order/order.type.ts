import { ICustomer } from '..';
import { IAddress } from '../address/address.type';

export interface IOrder {
  orderNumber?: string;
  id?: string;
  customer?: ICustomer;
  totalPrice?: string;
  totalDiscount?: string;
  totalTax?: string;
  shippingTax?: string;
  note?: string;
  totalShipping?: string;
  status?:
    | 'cancelled'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'pending'
    | 'processing'
    | 'on-hold'
    | 'partial';
  createdAt?: string;
  updatedAt?: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  currencyCode?: string;
  lineItems?: ILineItem[];
}

export interface ILineItem {
  id?: string;
  productId?: string;
  title?: string;
  price?: string;
  sku?: string;
  quantity?: number;
}
