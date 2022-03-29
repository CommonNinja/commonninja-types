import { IProduct } from "../product/product.type";

export interface ICustomer {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: number;
  acceptMarketing?: boolean;
  address?: IAddress;
  tags?: string[];
  orders?: ICustomerOrder[];
}

export interface IAddress {
  zip?: string;
  country?: string;
  countryCode?: string;
  state?: string;
  city?: string;
  address1?: string;
  address2?: string;
}

export interface ICustomerOrder {
  orderNumber?: string;
  totalPrice?: number;
  totalDiscount?: number;
  totalTax?: number;
  totalShipping?: number;
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
