// Docs
// WooCommerce:   https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-product-variations
// Shift4Shop:    https://apirest.3dcart.com/v2/products/index.html#retrieve-a-list-of-product-options
// Ecwid:         https://api-docs.ecwid.com/reference/get-all-product-variations
// Wix:           https://dev.wix.com/api/rest/wix-stores/catalog/products/query-product-variants
// BigCommerce:   https://developer.bigcommerce.com/api-reference/02db3ddfc6be7-get-all-product-variants
// Shopify:       https://shopify.dev/api/admin-rest/2022-01/resources/product-variant
// Squarespace:   https://developers.squarespace.com/commerce-apis/retrieve-all-products

import { IMoney } from '../money/money.type';
import { IProductDimensions } from './productDimensions.type';

export interface IProductVariant {
  createdAt?: string;
  updatedAt?: string;
  id?: string;
  sku?: string;
  productId?: string;
  description?: string;
  price?: IMoney;
  salePrice?: IMoney;
  isOnSale?: boolean;
  dimensions?: IProductDimensions;
  image?: string;
}
