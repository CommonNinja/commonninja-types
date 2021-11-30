
require('dotenv').config({ silent: true });

import { ServiceDiscovery } from '../globals';

export interface IConfig {
  ENV_NAME: 'dev' | 'test' | 'stg' | 'prod';
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
  PORT: number | string;
  UPLOADS_BASE_URL: string;
  AWS_ACCESS_KEY_ID?: string;
  AWS_SECRET_ACCESS_KEY?: string;
  S3_BUCKET_NAME?: string;
  S3_BUCKET_PATH?: string;
  ENABLE_REDIS?: boolean | string;
  REDIS_URI?: string;
  COMMONNINJA_SECRET?: string;
  WIX_APP_SECRET?: string;
  SERVICE_NAME?: string;
  ELASTIC_APM_SECRET_TOKEN?: string;
  ELASTIC_APM_SERVER_URL?: string | null;
  // Services
  COMMONNINJA_USERS_SERVICE_URL: string;
  COMMONNINJA_COMPONENTS_SERVICE_URL: string;
  COMMONNINJA_PAYMENTS_SERVICE_URL: string;
  COMMONNINJA_RESOURCES_SERVICE_URL: string;
  COMMONNINJA_EXPORT_SERVICE_URL: string;
  COMMONNINJA_EVENTS_SERVICE_URL: string;
  COMMONNINJA_EMAIL_SERVICE_URL: string;
  COMMONNINJA_WIX_SERVICE_URL: string;
  COMMONNINJA_HEALTH_SERVICE_URL: string;
}

// Load .env config
const dotenvConfig: any = process.env || {};

// Default config is prod
const defaultConfig: IConfig = {
  ENV_NAME: 'prod',
  LOG_LEVEL: 'warn',
  PORT: 5000,
  UPLOADS_BASE_URL: 'https://uploads.commoninja.com',
  AWS_ACCESS_KEY_ID: null,
  AWS_SECRET_ACCESS_KEY: null,
  S3_BUCKET_NAME: '',
  S3_BUCKET_PATH: '',
  ENABLE_REDIS: false,
  REDIS_URI: '',
  COMMONNINJA_SECRET: '',
  WIX_APP_SECRET: '',
  SERVICE_NAME: '',
  ELASTIC_APM_SECRET_TOKEN: null,
  ELASTIC_APM_SERVER_URL: null,
  // Services
  COMMONNINJA_USERS_SERVICE_URL: ServiceDiscovery.USERS,
  COMMONNINJA_COMPONENTS_SERVICE_URL: ServiceDiscovery.COMPONENTS,
  COMMONNINJA_PAYMENTS_SERVICE_URL: ServiceDiscovery.PAYMENTS,
  COMMONNINJA_RESOURCES_SERVICE_URL: ServiceDiscovery.RESOURCES,
  COMMONNINJA_EXPORT_SERVICE_URL: ServiceDiscovery.EXPORT,
  COMMONNINJA_EVENTS_SERVICE_URL: ServiceDiscovery.EVENTS,
  COMMONNINJA_EMAIL_SERVICE_URL: ServiceDiscovery.EMAIL,
  COMMONNINJA_WIX_SERVICE_URL: ServiceDiscovery.WIX,
  COMMONNINJA_HEALTH_SERVICE_URL: ServiceDiscovery.HEALTH,
};

const finalConfig: IConfig = Object.assign({}, defaultConfig, dotenvConfig);

export class ConfigFactory {
  static getConfig() {
    return finalConfig;
  }
}
