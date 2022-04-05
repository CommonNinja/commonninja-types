import { IAddress } from '../address/address.type';
import { IProduct } from '../product/product.type';

export interface IOrder {
  orderNumber?: string;
  id?: string;
  customerId?: string;
  totalPrice?: string;
  totalDiscount?: string;
  totalTax?: string;
  shippingTax?: string;
  totalShipping?: string;
  status?:
    | 'cancelled'
    | 'completed'
    | 'failed'
    | 'refunded'
    | 'pending'
    | 'processing'
    | 'on-hold';
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
