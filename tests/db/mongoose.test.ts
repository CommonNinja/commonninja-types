
import { dbConnection, loggerFactory } from '../../lib';
import { schemaFactory } from '../../lib/db';

const mongoose = require('mongoose');
const logger = loggerFactory.getLogger(__filename);

class MongooseMock {
  static connect() {
    logger.info('Opening mock connection');
    return Promise.resolve('true');
  }

  static connection() {
    return {
      close: () => {
        logger.info('Closing mock connection');
      },
    };
  }
}

test('DB connects', () => {
  const mongo = new dbConnection.mongodb('adfad', MongooseMock);
  mongo.connect().then((value) => {
    expect(value).not.toBeUndefined();
  }).catch((e) => {
    fail('Connection fails');
  });
});

test('Schema factory', () => {
  const schema = schemaFactory({
    test: {
      type: String,
      required: true,
      index: true,
    }
  });
  const model = mongoose.model('test', schema);
  expect(model.find).not.toBeUndefined();
});
