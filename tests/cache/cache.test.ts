import { cache, loggerFactory } from '../../lib';

const logger = loggerFactory.getLogger(__filename);

describe('Local cache suit', () => {
  test('Test Cache', async () => {
    const c = new cache(100);
    const key = 'key';
    const value = await c.get('key', () => {
      return Promise.resolve(`${key}_value`);
    });
    expect(value).toBe('key_value');
  });
  
  test('Delete value from cache', async () => {
    const c = new cache(100);
  
    const before = await c.get('key');
    expect(before).toBeNull();
  
    c.set('key', 'test-value2');
    const afterSet = await c.get('key');
    expect(afterSet).toBe('test-value2');
  
    c.del('key');
    const afterDel = await c.get('key');
    expect(afterDel).toBeNull();
  });
  
  test('Delete many keys', () => {
    const c = new cache(100);
  
    c.set('key1', 'test-value3');
    c.set('key2', 'test-value4');
    c.set('key3', 'test-value5');
    c.set('other-key1', 'test-value6');
    c.set('other-key2', 'test-value7');
  
    expect(c.count()).toBe(5);
    c.delStartWith('key');
    expect(c.count()).toBe(2);
  });
});
