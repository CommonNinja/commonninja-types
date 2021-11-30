import { IHttpResult } from '../../helpers/http/http.helpers';
import { BaseService } from '../base.service';
import { ResponseType } from '../../http';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const healthServiceUrl = config.COMMONNINJA_HEALTH_SERVICE_URL;

export class HealthService extends BaseService {
  restartService(serviceName: string): Promise<string | boolean | IHttpResult> {
    if (!healthServiceUrl) {
      return Promise.reject('Health service url is not defined.');
    }

    return this.httpClient.get(`${healthServiceUrl}/internal/restart/${serviceName}`, ResponseType.json, true);
  }
}
