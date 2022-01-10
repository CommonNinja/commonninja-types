import { Money } from '../money/money.type';

export interface Product {
  createdAt?: string;
  description?: string;
  id?: string;
  image?: string;
  images?: string[];
  price?: Money;
  title?: string;
  updatedAt?: string;
  url?: string;
}
