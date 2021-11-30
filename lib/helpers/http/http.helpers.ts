import { Request, NextFunction, Response, Application } from 'express';
import { LoggerFactory } from '../../log';
import { helpers } from '../..';
import { Cache, RedisCache } from '../../cache';
import { ConfigFactory } from '../../config';
import { IComponentRequest } from '../component/component.helpers';
import { exportService } from '../../services';

const config = ConfigFactory.getConfig();
const logger = LoggerFactory.getLogger(__filename);
const { ENABLE_REDIS, REDIS_URI, COMMONNINJA_SECRET } = config;
const isDev = config.ENV_NAME === 'dev';
const cacheInstance: any = ENABLE_REDIS === 'true' && REDIS_URI ? new RedisCache(REDIS_URI, 0) : new Cache(0);
let apm = {
  captureError: (err) => {},
};

export enum HttpStatus {
  UNAUTHURIZED = 401,
  SERVER_ERROR = 500,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  OK = 200,
  SERVICE_UNAVAILABLE = 503,
}

export interface IPaginationResponse {
  docs: any[];
  total: number;
  limit: number;
  offset?: number;
  page: number;
  pages: number;
}

export interface IHttpResult {
  success: boolean;
  message?: string;
  data?: any;
}

export function isACrawler(userAgent: string): boolean {
  const CRAWLER_AGENTS = [
    'googlebot', 'yandexbot', 'yahoo', 'bingbot', 'mediapartners-google',
    'baiduspider', 'facebookexternalhit', 'twitterbot', 'rogerbot',
    'linkedinbot', 'embedly', 'quora link preview', 'showyoubot', 'outbrain', 'taboola',
    'pinterest/0.', 'developers.google.com/+/web/snippet',
    'slackbot', 'vkshare', 'w3c_validator', 'redditbot', 'applebot',
    'whatsapp', 'flipboard', 'tumblr', 'bitlybot', 'skypeuripreview',
    'nuzzel', 'discordbot', 'google page speed',
  ];

  const isCrawler = CRAWLER_AGENTS.some(crawlerAgent => userAgent.indexOf(crawlerAgent) !== -1);

  return isCrawler;
}

export class HttpHelpers {
  public getResult(success: boolean, message?: string, data?: any): IHttpResult {
    return {
      success,
      message,
      data,
    };
  }
  
  public secretValidationMiddleware(req: Request, res: Response, next: NextFunction): void {
    const commonninjaSecret = req.headers['ninja-secret'];
    if (!commonninjaSecret || commonninjaSecret !== COMMONNINJA_SECRET) {
      res.sendStatus(HttpStatus.UNAUTHURIZED);
    } else {
      next();
    }
  }

  public getAPMInstance() {
    return apm;
  }

  public startElasticAPM() {
    const { SERVICE_NAME, ELASTIC_APM_SECRET_TOKEN, ELASTIC_APM_SERVER_URL } = config;
    if (!SERVICE_NAME || !ELASTIC_APM_SECRET_TOKEN || !ELASTIC_APM_SERVER_URL) {
      logger.error('Could not start elastic APM, some env variables are missing.');
      return;
    }
    apm = require('elastic-apm-node').start({
      serviceName: SERVICE_NAME,
      secretToken: ELASTIC_APM_SECRET_TOKEN,
      serverUrl: ELASTIC_APM_SERVER_URL,
    });
  }

  public essentialRoutes(app: Application, routePrefix: string = '', appLinks: { url: string, name: string }[] = []) {
    app.use(`${routePrefix}/internal(/*)?`, this.secretValidationMiddleware);

    app.get(`${routePrefix}/internal/healthcheck`, (req: Request, res: Response) => {
      res.sendStatus(200);
    });

    app.get(`${routePrefix}/internal/config`, (req: Request, res: Response) => {
      res.send(config);
    });

    app.get(`${routePrefix}/internal/cache/key/:keyName`, async (req: Request, res: Response) => {
      const key = req.params.keyName;
      res.send(await cacheInstance.get(key));
    })
    ;
    app.get(`${routePrefix}/internal/cache/keys`, async (req: Request, res: Response) => {
      const keys = await cacheInstance.keys();
      res.send(keys);
    });
    
    app.get(`${routePrefix}/internal/cache/flushAll`, (req: Request, res: Response) => {
      cacheInstance.flush(); 
      res.send('Flushed.');
    });

    app.get(`${routePrefix}/internal/cache/flushUser/:userId`, (req: Request, res: Response) => {
      const { userId } = req.params;
      
      if (!userId) {
        res.sendStatus(500);
        return;
      }
    
      helpers.userHelpers.deleteSubscriptionCacheForUserId(userId);
      
      res.sendStatus(200);
    });

    app.get(`${routePrefix}/internal/cache/flushComponent/:componentId`, helpers.componentHelpers.loadComponentByGuidMiddleware(), async (req: IComponentRequest, res: Response) => {
      const { componentId } = req.params;
      const { component } = req;

      if (!componentId || !component || !component.guid) {
        res.sendStatus(500);
        return;
      }
    
      try {
        const userId = component.permissions?.[0]?.user;

        helpers.componentHelpers.clearComponentCache(componentId, component, userId);

        res.sendStatus(200);
      } catch (e) {
        res.sendStatus(500);
      }
    });

    app.get(`${routePrefix}/internal/cache/flushKey/:key`, async (req: Request, res: Response) => {
      const { key } = req.params;
      
      if (!key) {
        res.sendStatus(500);
        return;
      }
    
      cacheInstance.delStartWith(key); 
      res.send('Deleted.');
    });

    // Help page
    app.get(`${routePrefix}/internal`, (req: Request, res: Response) => {
      let appInternalLinksHTML: string = '';

      if (appLinks.length) {
        appInternalLinksHTML = '<h4>App Links</h4><ul>';
        appLinks.forEach((link) => {
          appInternalLinksHTML += `
            <li>
              <a href="${link.url}">${link.name}</a>
            </li>
          `;
        });
        appInternalLinksHTML += '</ul>';
      }

      res.type('text/html');
      res.status(200);
      res.send(`
        <h2>${config.SERVICE_NAME || 'Service'} - Help Page</h2>
        ${appInternalLinksHTML}
        <h4>Common Links</h4>
        <ul>
          <li>
            <a href="${routePrefix}/internal/healthcheck">Health Check</a>
          </li>
          <li>
            <a href="${routePrefix}/internal/config">Environment Config</a>
          </li>
          <li>
            <a href="${routePrefix}/internal/cache/key/:keyName">Cache Key Value</a>
          </li>
          <li>
            <a href="${routePrefix}/internal/cache/keys">Cache Keys</a>
          </li>
        </ul>
        <h4>Actions</h4>
        <ul>
          <li>
            <a href="${routePrefix}/internal/cache/flushKey/:key">Delete Cache Key</a>
          </li>
          <li>
            <a href="${routePrefix}/internal/cache/flushAll">Flush Cache</a>
          </li>
        </ul>
      `);
    });
  }

  public appErrorHandlers(app: Application, backendService: boolean = false) {
    // 404 path handler
    app.get('*', (req, res) => {
      logger.warn('Path not found', `${req.protocol}://${req.get('host')}${req.originalUrl}`);
      throw new Error('Not Found');
    });
    
    // Global error handler
    app.use((err, req, res, next) => {
      if (isDev) {
        logger.error(err.stack);
      }
      next(err);
    });
    
    app.use((err, req, res, next) => {
      const { accept } = req.headers;
      if (req.xhr || (accept && accept.indexOf('html') === -1)) {
        res.sendStatus(404);
      } else {
        next(err);
      }
    });
    
    app.use((err, req, res, next) => {
      if (err.message === 'Not Found') {
        if (backendService) {
          res.sendStatus(404);
        } else {
          res.send('Not found');
        }
      } else {
        // Send error to apm
        if (apm) {
          apm.captureError(err);
        }

        // Send relevant response
        if (backendService) {
          res.sendStatus(500);
        } else {
          res.send('Error');
        }
      }
    });
    
    // Unhandled promise rejection handler
    process.on('unhandledRejection', (error: Error) => {
      if (apm) {
        apm.captureError(error);
      }
      logger.error('Possibly unhandled rejection', error.message, error);
    });
    
    process.on('uncaughtException', (error: Error) => {
      if (apm) {
        apm.captureError(error);
      }
      logger.error('Possibly unhandled exception', error.message, error);
    });

    // process.on('beforeExit', (code) => {
    //   if (config.ENV_NAME !== 'prod') {
    //     return;
    //   }

    //   if (apm) {
    //     apm.captureError(new Error(`Exiting process, error code ${code}.`));
    //   }

    //   logger.error('Exiting, trying to restart Heroku service.');

    //   services.healthService.restartService(config.SERVICE_NAME);
    // });
  }

  public async ssrMiddleware(req: Request, res: Response, next: NextFunction) {
    // If it's not a crawler, simply render the regular html
    if (!isACrawler((req.get('user-agent') || '').toLowerCase())) {
      next();
      return;
    }

    const baseUrl = ((config as any).ENV_BASE_URL || 'https://www.commoninja.com/').replace(/\/$/, '');
    let fullUrl = baseUrl + req.originalUrl;

    if (!fullUrl.startsWith('http')) {
      fullUrl = `https://${fullUrl}`;
    }

    logger.info('SSR Middleware for', fullUrl);

    try {
      const { html, ttRenderMs } = await exportService.ssr(fullUrl);
      res.set('Server-Timing', `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`);
      res.status(200).send(html); // Serve prerendered page as response.
    } catch (e) {
      logger.error('Could not ssr', e);
      next();
    }
  }
}
