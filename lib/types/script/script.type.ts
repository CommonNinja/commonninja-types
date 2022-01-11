export interface IScript {
  src: string;
  id?: string;
  name?: string;
  description?: string;
  location?: 'head' | 'footer';
  loadMethod?: 'defer' | 'async';
  scope?: 'storefront' | 'checkout' | 'all';
  cache?: boolean;
}