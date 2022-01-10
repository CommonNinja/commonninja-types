export interface IScript {
  name: string
  description: string
  src: string
  location: 'head' | 'body'
  loadMethod: 'defer' | 'async'
  scope: 'storefront' | 'checkout' | 'all'
  cache: boolean
}