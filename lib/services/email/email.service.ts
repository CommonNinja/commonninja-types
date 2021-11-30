import { IHttpResult } from '../../helpers/http/http.helpers';
import { BaseService } from '../base.service';
import { ResponseType } from '../../http';
import { ServiceName, ServiceDisplayName } from '../../globals';
import { ConfigFactory } from '../../config';

const config = ConfigFactory.getConfig();

const emailServiceUrl = config.COMMONNINJA_EMAIL_SERVICE_URL;

export enum EmailType {
  FORGOT_PASSWORD = 'commonninjaForgotPassword',
  CONFIRMATION = 'commonninjaConfirmation',
  POST_CANCELLATION = 'commonninjaPostCancellation',
  DEFAULT_TEMPLATE = 'commonninjaDefaultTemplate',
  OTHER = 'commonninjaOther',
}

export interface IEmailParams {
  toEmail: string;
  toName: string;
  subject: string;
  replyTo?: string;
  message?: string;
}

export interface IEmailOptions {
  params?: IEmailParams;
  templateParams?: any; // The template will look for these params and switch them with values
  serviceName?: ServiceDisplayName | string;
  service?: ServiceName;
  emailType?: EmailType;
}

export class EmailService extends BaseService {
  send(options: IEmailOptions): Promise<string | boolean | IHttpResult> {
    if (!emailServiceUrl) {
      return Promise.reject('Email service url is not defined.');
    }

    return this.httpClient.postApplicationJson(emailServiceUrl, options, ResponseType.bool, true);
  }
}
