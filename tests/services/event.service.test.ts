require('dotenv').config({ silent: true });
import * as UAParser from 'ua-parser-js';
import * as geoip from 'geoip-lite';

// import { services, GLOBALS } from '../../lib';

describe('Event Service extract body', () => {
  test('Check ua parser module', async () => {
    const ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36';
    const result = UAParser(ua);
    
    expect(result.browser.name).toEqual('Chrome');
  });

  test('Check geoip-lite module', async () => {
    const ip = '207.97.227.239';
    const result = geoip.lookup(ip);
    
    expect(result.country).toEqual('US');
  });
});
