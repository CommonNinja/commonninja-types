import Logger = require('bunyan');

import * as bunyan from 'bunyan';
import * as bunyanDebugStream from 'bunyan-debug-stream';
import * as path from 'path';
import { ConfigFactory } from '../config';

const config = ConfigFactory.getConfig();

const loggerConfig = {
  name: 'commonninja-logger',
  streams: [
    {
      level: config.LOG_LEVEL,
      name: 'log_stream',
      type: 'raw',
      stream: bunyanDebugStream({
        basepath: __dirname,
        forceColor: true,
        prefixers: {
          logger: ctx => ({
            value: ctx,
            consumed: ['tags', 'type', 'logger'],
          }),
        },
      }),
    },
  ],
  serializers: bunyanDebugStream.serializers,
};

export class LoggerFactory {
  static getLogger(fileName: string): Logger {
    const name = path.basename(fileName);
    const options: bunyan.LoggerOptions = Object.assign({}, loggerConfig, { name });
    return bunyan.createLogger(options);
  }
}
