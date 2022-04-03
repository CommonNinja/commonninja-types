import { IAddress } from '../address/address.type';

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
}