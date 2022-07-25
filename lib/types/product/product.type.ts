import { IMoney } from '../money/money.type';
import { IProductDimensions } from './productDimensions.type';
import { IProductImage } from './productImage.type';

export interface IProduct {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  sku?: string;
  title?: string;
  description?: string;
  url?: string;
  mainImage?: string;
  images?: IProductImage[];
  price?: IMoney;
  tags?: string[];
  status?: 'active' | 'archived' | 'draft';
  isPhysical?: boolean;
  dimensions?: IProductDimensions;
  vendor?: string;
  category?: string;
}
