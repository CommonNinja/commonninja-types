import { KeyType } from 'ioredis';

import Cache from './node';
import RedisCache from './redis';

type Loader = () => Promise<any>;

export interface ICache {
  get: (key: string, loader?: Loader, nullIsValid?: boolean) => Promise<any>;
  set: (key, value: any, ttl?: number) => void | Promise<void>;
  del: (keys: string | [string] | [KeyType]) => void | Promise<void>;
  delStartWith: (startsWith: string) => void | Promise<void>;
  count: () => number | Promise<number>;
  flush: () => void | Promise<string>;
  keys: () => string[] | Promise<string[]>;
}

export default Cache;

export { Cache, RedisCache };
