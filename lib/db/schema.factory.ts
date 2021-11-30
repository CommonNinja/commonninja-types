import { Schema } from 'mongoose';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const mongooseUniqueValidator = require('mongoose-unique-validator');

const commonFields = {
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
};

export function SchemaFactory(schemaDef: any): Schema {
  const schema: Schema = new mongoose.Schema(schemaDef);
  schema.add(commonFields);
  schema.plugin(mongoosePaginate, {
    message: '{PATH} already exists.'
  });
  schema.plugin(mongooseUniqueValidator);

  schema.pre('save', function (next) { // eslint-disable-line func-names
    const obj = this as any;
    obj.updated = Date.now();
    return next(null);
  });

  schema.index({
    created: -1,
  });

  return schema;
}
