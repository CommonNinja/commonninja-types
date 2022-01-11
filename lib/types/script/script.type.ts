export interface IScript {
  src: string;
  id?: string;
  name?: string;
  description?: string;
  location?: 'head' | 'body';
  loadMethod?: 'defer' | 'async';
  scope?: 'storefront' | 'checkout' | 'all';
  cache?: boolean;
}