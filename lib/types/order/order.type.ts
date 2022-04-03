import { IAddress } from '../address/address.type';
import { IProduct } from '../product/product.type';

export interface IOrder {
  orderNumber?: string;
  totalPrice?: string;
  totalDiscount?: string;
  totalTax?: string;
  totalShipping?: string;
  status?: 'active' | 'cancelled';
  paymentStatus?: 'paid' | 'pending' | 'refunded';
  createdAt?: string;
  updatedAt?: string;
  billingAddress?: IAddress;
  shippingAddress?: IAddress;
  currencyCode?: string;
  fulfillmentStatus?: 'fulfilled' | 'partial' | 'unfulfilled';
  lineItems?: IProduct[];
}
