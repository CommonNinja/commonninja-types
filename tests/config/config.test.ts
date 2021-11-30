// Rewrite default value
process.env.ENV_NAME = 'dev';

import { config } from '../../lib';

describe('Config testing', () => {
  test('Config get default values', () => {
    expect(config.LOG_LEVEL).toEqual('warn');
  });
  
  test('Config global rewrite set value', () => {
    expect(config.ENV_NAME).toEqual('dev');
  });

  test('Config local rewrite set value', () => {
    config.ENV_NAME = 'test';
    expect(config.ENV_NAME).toEqual('test');
  });
});
