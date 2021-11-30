import * as IORedis from 'ioredis';
import { LoggerFactory } from '../log/index';
import { ICache } from './';

const logger = LoggerFactory.getLogger(__filename);

type Loader = () => Promise<any>;

class RedisCache implements ICache {
  private cache: IORedis.Redis;
  private ttlSeconds: number;

  constructor(redisUrl: string, ttlSeconds: number) {
    this.cache = new IORedis(redisUrl);
    this.ttlSeconds = ttlSeconds;
  }

  public async get(key: string, loader?: Loader, nullIsValid?: boolean): Promise<any> {
    try {
      const value = await this.cache.get(key);

      if (value || (nullIsValid && value === null)) {
        if (typeof value === 'string') {
          try {
            return JSON.parse(value);
          } catch (e) {
            return value;
          }
        }
        return value;
      }
    } catch (e) {
      logger.info('Could not find cache key', key);
    }

    if (loader) {
      return loader().then(async (result) => {
        await this.set(key, result);
        return result;
      });
    }

    return null;
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    let finalValue = value;
    if (finalValue && typeof finalValue === 'object') {
      finalValue = JSON.stringify(finalValue);
    }
    await this.cache.set(key, finalValue);
    await this.cache.expire(key, ttl || this.ttlSeconds);
  }

  public async del(keys: [IORedis.KeyType] | IORedis.KeyType): Promise<void> {
    if (typeof keys === 'string') {
      await this.cache.del(keys);
      return;
    }

    const promises = [];
    
    for (const key of keys) {
      promises.push(this.cache.del(key as IORedis.KeyType));
    }

    await Promise.all(promises);

    return;
  }

  public async delStartWith(startsWith: string = ''): Promise<void> {
    if (!startsWith) {
      return;
    }

    const keys: string[] = await this.cache.keys('*');
    const promises = [];

    for (const key of keys) {
      if (key.indexOf(startsWith) === 0) {
        promises.push(this.cache.del(key));
      }
    }

    await Promise.all(promises);

    return;
  }

  public async count(): Promise<number> {
    const keys = await this.cache.keys('*');
    return keys.length;
  }
  
  public async flush(): Promise<string> {
    return await this.cache.flushall();
  }

  public async keys(): Promise<string[]> {
    return await this.cache.keys('*');
  }
}

export default RedisCache;
