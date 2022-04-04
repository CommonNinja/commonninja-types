import { IAddress } from '../address/address.type';
import { IProduct } from '../product/product.type';

export interface IOrder {
  orderNumber?: string;
  totalPrice?: string;
  totalDiscount?: string;
  totalTax?: string;
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
  lineItems?: IProduct[];
}
