import { config } from '../lib';

require('dotenv').config({ silent: true });

describe('Secret key testing', () => {
  test('Secret key exists', () => {
    const key = config.COMMONNINJA_SECRET;
    expect(key).toBeDefined();
    expect(typeof key).toBe('string');
  });
});
