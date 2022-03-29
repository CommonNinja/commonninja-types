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
  status?: 'active' | 'archived' | 'draft';
  isPhysical?: boolean;
  dimensions?: {
    width?: number;
    height?: number;
    weight?: number;
  };
  sku?: string;
  vendor?: string;
  category?: string;
}
