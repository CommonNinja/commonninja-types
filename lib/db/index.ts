import { MongoDB } from './mongodb';
import { MySQL } from './mysql';
import { SchemaFactory } from './schema.factory';

export interface IDBConnection {
  connect: () => Promise<any>;
}

export const mongodb = MongoDB;
export const mysql = MySQL;
export const schemaFactory = SchemaFactory;
