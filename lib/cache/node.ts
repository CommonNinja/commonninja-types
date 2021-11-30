import * as NodeCache from 'node-cache';
import { ICache } from './';

type Loader = () => Promise<any>;

class Cache implements ICache {
  private cache: NodeCache;

  constructor(ttlSeconds: number) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2, useClones: false });
  }

  public async get(key: string, loader?: Loader, nullIsValid?: boolean): Promise<any> {
    const value = this.cache.get(key);

    if (value || (nullIsValid && value === null)) {
      return Promise.resolve(value);
    }

    if (loader) {
      return loader().then((result) => {
        this.set(key, result);
        return result;
      });
    }

    return null;
  }

  public set(key: string, value: any, ttl?: number): void {
    this.cache.set(key, value, ttl);
  }

  public del(keys: string | [string]): void {
    this.cache.del(keys);
  }

  public delStartWith(startsWith: string = ''): void {
    if (!startsWith) {
      return;
    }

    const keys = this.cache.keys();
    for (const key of keys) {
      if (key.indexOf(startsWith) === 0) {
        this.del(key);
      }
    }
  }

  public count(): number {
    return this.cache.getStats().keys;
  }
  
  public flush(): void {
    this.cache.flushAll();
  }

  public getStats(): void {
    this.cache.getStats();
  }

  public keys(): string[] {
    return this.cache.keys();
  }
}

export default Cache;
