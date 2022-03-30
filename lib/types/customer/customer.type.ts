import { IProduct } from "../product/product.type";

export interface ICustomer {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  acceptMarketing?: boolean;
  address?: IAddress;
  tags?: string[];
  orders?: ICustomerOrder[];
  totalSpent?: string;
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
