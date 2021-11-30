import { loggerFactory } from '../../lib';

test('LoggerFactory creates a logger', () => {
  const logger = loggerFactory.getLogger(__filename);
  logger.debug('debug');
  logger.info('info');
  logger.warn('warn');
  logger.error('error');
});
