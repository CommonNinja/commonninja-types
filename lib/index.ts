import Cache, { RedisCache } from './cache';
import * as globals from './globals';
import { HttpClient, ResponseType } from './http';
import { LoggerFactory } from './log';
import { ConfigFactory } from './config';
import * as DB from './db';
import * as Services from './services';
import * as Helpers from './helpers';

// Globals
export const GLOBALS = globals;

// Config
export const config = ConfigFactory.getConfig();

// HTTP
export const fetch = new HttpClient();
export const httpResponseType = ResponseType;

// Cache
export const cache = Cache;
export const redisCache = RedisCache;

// Logger
export const loggerFactory = LoggerFactory;

// DB
export const dbConnection = DB;

// Common Ninja Services
export const services = Services;

// Helpers
export const helpers = Helpers;
