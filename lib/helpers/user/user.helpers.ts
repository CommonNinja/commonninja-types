import * as md5 from 'md5';
import { Request, NextFunction, Response, RequestHandler } from 'express';
import { Cache, RedisCache } from '../../cache';
import { LoggerFactory } from '../../log';
import { UserService } from '../../services/user/user.service';
import { SubscriptionService, ISubscriptionType, ISubscriptionData } from '../../services/subscription/subscription.service';
import { ServiceName } from '../../globals';
import { HttpStatus } from '../http/http.helpers';
import { ConfigFactory } from '../../config';
import { IReseller, IResellerWithUserDetails } from '../../services/reseller/reseller.service';
import { resellerService } from '../../services';

const config = ConfigFactory.getConfig();

const { ENABLE_REDIS, REDIS_URI } = config;
const userService = new UserService();
const subscriptionService = new SubscriptionService();
const logger = LoggerFactory.getLogger(__filename);
const authTtl = 60 * 2; // 2 minutes
const subscriptionTtl = 60 * 15; // 15 minutes
const authCache = ENABLE_REDIS === 'true' ? new RedisCache(REDIS_URI, authTtl) : new Cache(authTtl);
const subscriptionCache = ENABLE_REDIS === 'true' ? new RedisCache(REDIS_URI, subscriptionTtl) : new Cache(subscriptionTtl);

export const secretCookieName = 'commonninja-secret';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum UserPlatform {
  WEB = 'web',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
}

export interface IUser {
  isAuthenticated: boolean;
  guid?: string;
  fullName?: string;
  email?: string;
  username?: string;
  thumbnail?: string;
  platform?: UserPlatform;
  role?: UserRole;
  isConfirmed?: boolean;
  isSubscribe?: boolean;
  lastLogin?: Date;
  created?: Date;
  updated?: Date;
  subscription?: ISubscriptionData;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
  reseller?: IResellerWithUserDetails | null;
}

const userCacheKeyPrefix = 'user';

const cookieExtractor = (cookie: string, cookieName: string): string => {
  if (!cookie) {
    return null; 
  }
  const match = cookie.match(new RegExp(`(^| )${cookieName}=([^;]+)`));
  if (match) {
    return match[2] || null;
  }
  return null;
};

export class UserHelpers {
  private async getUserFromCache(req: Request, cacheTtl: number, secretCookie: string) {
    let user: any = null;
    const userIdCacheKey = md5(`cookie_${secretCookie}`);
    let userId = await authCache.get(userIdCacheKey);

    if (!userId) {
      user = await userService.getUserDetails(req);
      userId = user.guid;
      // Set map for encrypted cookie to userId
      authCache.set(userIdCacheKey, userId);
      // Set cache for user
      authCache.set(`${userCacheKeyPrefix}_${userId}`, user, cacheTtl);
    } else {
      const cachedUserResult = await authCache.get(`${userCacheKeyPrefix}_${userId}`);
      user = cachedUserResult || await userService.getUserDetails(req);
      
      if (!cachedUserResult) {
        authCache.set(`${userCacheKeyPrefix}_${userId}`, user, cacheTtl);
      }
    }

    return user;
  }

  public authServiceMiddleware(redirectUrl: string, cacheTtl?: number): RequestHandler {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
      const secretCookie = cookieExtractor(req.headers.cookie, secretCookieName);
      if (!secretCookie) {
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
          res.sendStatus(HttpStatus.UNAUTHURIZED);
        } else {
          res.redirect(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
        }
        return;
      }
    
      try {
        const user = await this.getUserFromCache(req, cacheTtl, secretCookie);
    
        if (user) {
          req.user = Object.assign({}, user, { isAuthenticated: true });
          next();
          return;
        } 

        logger.info('User is not authenticated.', user);
      } catch (e) {
        logger.warn('Could not get user details', e);
      }
    
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.sendStatus(HttpStatus.UNAUTHURIZED);
      } else {
        res.redirect(`/login?redirectUrl=${encodeURIComponent(redirectUrl)}`);
      }
    };
  }

  public loadUserMiddleware(cacheTtl?: number, includeSubscription?: boolean, serviceName?: ServiceName): RequestHandler {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
      req.user = {
        isAuthenticated: false,
      };

      const secretCookie = cookieExtractor(req.headers.cookie, secretCookieName);
      if (!secretCookie) {
        next();
        return;
      }

      try {
        const user = await this.getUserFromCache(req, cacheTtl, secretCookie);
    
        if (!user) {
          next();
          return;
        } 

        req.user = Object.assign({}, user, { isAuthenticated: true });

        if (includeSubscription && serviceName) {
          const subscription: any = await this.getSubscriptionByServiceNameAndUserId(serviceName, req.user.guid);
          req.user.subscription = subscription.isEmpty ? null : subscription;
        }
      } catch (e) {
        logger.warn('Could not load user details, or subscription', e);
      }
    
      next();
    };
  }

  public async getResellerByIdFromCache(resellerId: string = '', cacheTtlInSeconds?: number): Promise<IResellerWithUserDetails | null> {
    try {
      const key = `reseller_${resellerId}`;
      let reseller: IResellerWithUserDetails = await authCache.get(key);

      if (!reseller) {
        reseller = await resellerService.getResellerById(resellerId);
      }
  
      if (!reseller) {
        return null;
      }

      reseller.userDetails = await userService.getUserById(reseller.userId);

      await authCache.set(key, reseller, cacheTtlInSeconds || (60 * 60)); // One hour
      
      return reseller;
    } catch (e) {
      logger.warn('Could not load reseller details.', e);
    }

    return null;
  }

  public async flushResellerCache(resellerId: string = '') {
    const key = `reseller_${resellerId}`;
    return await authCache.delStartWith(key);
  }

  public loadResellerByIdParamMiddleware(cacheTtlInSeconds?: number) {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
      const { resellerId } = req.params;
  
      req.reseller = null;
  
      if (!resellerId) {
        next();
        return;
      }
  
      try {
        req.reseller = await this.getResellerByIdFromCache(resellerId);
      } catch (e) {
        logger.warn('Could not load reseller details.', e);
      }
  
      next();
    };
  }

  public loadUserSubscriptionMiddleware(serviceName: ServiceName, filters?: object): RequestHandler {
    return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<void> => {
      // If user is not logged in, don't load a subscription
      req.user.subscription = null;

      if (!req.user.isAuthenticated) {
        next();
        return;
      }

      const userId = req.user.guid;
      const subscription: any = await this.getSubscriptionByServiceNameAndUserId(serviceName, userId, filters);
      req.user.subscription = subscription.isEmpty ? null : subscription;

      next();
    };
  }

  public isAdminMiddleware(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): void {
    const { user } = req;
  
    if (user.isAuthenticated && user.role === UserRole.ADMIN) {
      next();
      return;
    }
  
    // If not admin, send unautorized
    res.sendStatus(401);
  }

  public isAuthenticatedMiddleware(req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): void {
    if (req.user.isAuthenticated) {
      next();
      return;
    }
     
    res.sendStatus(HttpStatus.UNAUTHURIZED);
  }

  public convertPlanFeaturesToPremium(origPlanFeatures: any) {
    const convertedFeatures: any = {};
    Object.keys(origPlanFeatures).forEach((key) => {
      const valueType = typeof origPlanFeatures[key];
      if (valueType === 'boolean') {
        convertedFeatures[key] = true;
      } else if (valueType === 'number') {
        convertedFeatures[key] = null;
      }
    });
    return convertedFeatures;
  }

  public extractPlanFeaturesFromUser(user: IUser, defaultPlanFeatures: any): any {
    const planFeatures = Object.assign({}, defaultPlanFeatures, {});
    
    if (!user) {
      return planFeatures;
    }

    if (user.role === 'admin') {
      return this.convertPlanFeaturesToPremium(planFeatures);
    }

    if (!user.subscription || !user.subscription.details) {
      return planFeatures;
    }

    // If data is empty - treat as a wildcard
    if (!user.subscription.details.data) {
      return this.convertPlanFeaturesToPremium(planFeatures);
    }

    return Object.assign({}, planFeatures, user.subscription.details.data || {});
  }

  public async getSubscriptionByServiceNameAndUserId(serviceName: ServiceName, userId: string, filters?: object): Promise<ISubscriptionData> {
    const subscriptionDataKey = `subscriptionData_${userId}_${serviceName}`;
    
    return await subscriptionCache.get(subscriptionDataKey, async () => {
      const subscriptionTypesKey = 'subscriptionTypes';
      const where = filters || { isActive: true };
      let userSubscription: any = { isEmpty: true };
  
      try {
        const subscriptionsReq = await subscriptionService.getSubscriptionsByUserId(userId, where);
        const subscriptions = subscriptionsReq.docs;

        if (subscriptions.length) {
          const subscriptionTypes: [ISubscriptionType] = await subscriptionCache.get(subscriptionTypesKey, async () => await subscriptionService.getSubscriptionTypesObjectById());
          // tslint:disable-next-line:no-increment-decrement
          for (let i = 0; i < subscriptions.length; i++) {
            const subscription = subscriptions[i] as ISubscriptionData;
            if (!subscription) {
              continue;
            }
            const subscriptionTypeDetails = subscriptionTypes[subscription.subscriptionTypeId];
            if (subscriptionTypeDetails && subscriptionTypeDetails.services.indexOf(serviceName) >= 0) {
              userSubscription = subscription;
              userSubscription.details = subscriptionTypeDetails;
              break;
            }
          }
        }
        logger.debug('User subscription result', userSubscription);
      } catch (e) {
        logger.warn('Could not get subscription by service name', e);
      }
      
      return userSubscription;
    });
  }

  public async deleteSubscriptionCacheForUserId(userId: string): Promise<void> {
    const subscriptionDataKey = `subscriptionData_${userId}`;
    const userKey = `${userCacheKeyPrefix}_${userId}`;
    subscriptionCache.delStartWith(subscriptionDataKey);
    subscriptionCache.del(subscriptionDataKey);
    authCache.delStartWith(userKey);
    authCache.del(userKey);
  }

  public flushSubscriptionsCache(): void {
    subscriptionCache.flush();
  }

  public async logout(req: Request, resolver: () => void) {
    const secretCookie = cookieExtractor(req.headers.cookie, secretCookieName);
    if (!secretCookie) {
      resolver();
      return;
    }

    try {
      const userIdCacheKey = md5(`cookie_${secretCookie}`);
      const userId = await authCache.get(userIdCacheKey);
      if (userId) {
        const userKey = `${userCacheKeyPrefix}_${userId}`;
        authCache.delStartWith(userKey);
        authCache.del(userKey);
      }
      authCache.del(userIdCacheKey);
    } catch (e) {
      logger.error('Could not log out', e);
    }

    resolver();
  }
}
