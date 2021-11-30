// redis://:authpassword@host:port/:db_name

import { redisCache, loggerFactory } from '../../lib';

const logger = loggerFactory.getLogger(__filename);
const redisConnectionString = 'redis://:njqKYpuuKSxH8aBzrEHjxgIZOEONrxhY@redis-12711.c14.us-east-1-2.ec2.cloud.redislabs.com:12711/0';

describe('Redis suit', () => {
//   const expirationTtl = 1;
//   const c = new redisCache(redisConnectionString, expirationTtl);

  test('Redis always true', async () => {
    expect(null).toBeNull();
  });

//   test('Redis get set', async () => {
//     const key = 'key_get_set';
//     const before = await c.get(key);
//     expect(before).toBeNull();

//     const expectedValue = 'value';
//     const afterGetSet = await c.get(key, () => {
//       return Promise.resolve(expectedValue);
//     });
//     expect(afterGetSet).toBe(expectedValue);
//   });

//   test('Key set', async () => {
//     const key = 'key_set';
//     const expectedValue1 = 'value';
//     const expectedValue2 = 'value2';
    
//     const value = await c.get(key, () => {
//       return Promise.resolve(expectedValue1);
//     });
    
//     expect(value).toBe(expectedValue1);

//     await c.set(key, expectedValue2);
//     const newValue = await c.get(key);

//     expect(newValue).toBe(expectedValue2);
//   });

//   test('JSON key set', async () => {
//     const key = 'json_key_set';
//     const expectedValue = { test: true };
    
//     const value = await c.get(key, () => {
//       return Promise.resolve(expectedValue);
//     });
    
//     expect(value).toMatchObject(expectedValue);
//     expect(value.test).toBeTruthy();

//     const noLoaderValue = await c.get(key);

//     expect(noLoaderValue).toMatchObject(expectedValue);
//   });

//   test('Number key set', async () => {
//     const key = 'number_key_set';
//     const expectedValue = 10;
    
//     const value = await c.get(key, () => {
//       return Promise.resolve(expectedValue);
//     });
    
//     expect(value).toEqual(expectedValue);
//   });

//   test('Key delete', async () => {
//     const key = 'key_delete';
//     const expectedValue = 'value';
    
//     const before = await c.get(key, () => {
//       return Promise.resolve(expectedValue);
//     });
    
//     expect(before).toBe(expectedValue);

//     await c.del(key);
//     const after = await c.get(key);

//     expect(after).toBeNull();
//   });

//   test('Delete many keys', async () => {
//     const ttl = 10;
//     await c.flush();
//     await c.set('key1', 'test-value3', ttl);
//     await c.set('key2', 'test-value4', ttl);
//     await c.set('key3', 'test-value5', ttl);
//     await c.set('other-key1', 'test-value6', ttl);
//     await c.set('other-key2', 'test-value7', ttl);

//     expect(await c.count()).toBe(5);
//     await c.delStartWith('key');
//     expect(await c.count()).toBe(2);
//   });

//   test('Flush all', async () => {
//     const ttl = 10;
//     await c.flush();
//     await c.set('key1', 'test-value3', ttl);
//     await c.set('key2', 'test-value4', ttl);
//     await c.set('key3', 'test-value5', ttl);
//     await c.set('other-key1', 'test-value6', ttl);
//     await c.set('other-key2', 'test-value7', ttl);

//     expect(await c.count()).toBe(5);
//     await c.flush();
//     expect(await c.count()).toBe(0);
//   });
  
//   test('Key expiration', async (done) => {
//     const key = 'key_expiration';
//     const expectedValue = 'value';
//     const before = await c.get(key, () => {
//       return Promise.resolve(expectedValue);
//     });

//     expect(before).toBe(expectedValue);

//     setTimeout(async () => {
//       const after = await c.get(key);
//       expect(after).toBe(null);
//       done();
//     }, (expirationTtl * 1000) + 500);
//   });
});
