require('dotenv').config({ silent: true });
import { services, GLOBALS, loggerFactory } from '../../lib';

const logger = loggerFactory.getLogger(__filename);

describe('Component Service Integration Test', () => {
  test('get by uuid', async () => {
    const { userService, componentService } = services;
    const guidResult = await userService.getUserGuid(3, GLOBALS.ServiceName.BRACKETSNINJA);
    expect(guidResult['guid']).toBe('a692deca-a09a-4e7e-a069-a32d7ac19c8f');

    const response = await componentService.getComponentsByUserGuid(guidResult['guid']);
    logger.info(response);
  });
});
