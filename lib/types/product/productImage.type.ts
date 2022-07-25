// Docs
// Shopify:       https://shopify.dev/api/admin-rest/2021-10/resources/product-image#resource-object
// WooCommerce:   https://woocommerce.github.io/woocommerce-rest-api-docs/#list-all-products
// Shift4Shop:    https://apirest.3dcart.com/v2/products/index.html#products-by-manufacturer
// Ecwid:         https://api-docs.ecwid.com/reference/upload-product-image
// Wix:           https://dev.wix.com/api/rest/wix-stores/catalog/products/get-product
// BigCommerce:   https://developer.bigcommerce.com/api-reference/73a8d6a4fa0dc-get-all-product-images
// Squarespace:   https://developers.squarespace.com/commerce-apis/update-product-image
// BigCartel:     https://developers.bigcartel.com/api/v1#product-object

export interface IProductImage {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  variantIds?: string[];
  src?: string;
  width?: number;
  height?: number;
}
