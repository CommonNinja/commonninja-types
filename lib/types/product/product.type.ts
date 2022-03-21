import { IMoney } from '../money/money.type';

export interface IProduct {
  createdAt?: string;
  description?: string;
  id?: string;
  image?: string;
  images?: string[];
  price?: IMoney;
  title?: string;
  updatedAt?: string;
  url?: string;
  tags?: string[];
  status?: string;
  isPhysical?: boolean;
  sku?: string;
  vendor?: string;
  category?: string;
}
