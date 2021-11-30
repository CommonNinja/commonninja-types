import * as promiseMysql from 'promise-mysql';

import { LoggerFactory } from '../log/index';
import { IDBConnection } from './index';
import { ServiceName, ServiceDisplayName } from '../globals/index';
import { emailService } from '../services/index';
import { EmailType } from '../services/email/email.service';
import { ConfigFactory } from '../config';

const config = ConfigFactory.getConfig();

const logger = LoggerFactory.getLogger(__filename);
const env = config.ENV_NAME;

export interface IConnectionParams {
  host: string;
  user: string;
  password: string;
  database: string;
  charset?: string;
}

export class MySQL implements IDBConnection {
  private connectionParams: IConnectionParams;
  private service: string;

  constructor(connectionParams: IConnectionParams, service?: string) {
    this.connectionParams = Object.assign({}, { charset: 'utf8_general_ci' }, connectionParams);
    this.service = service || ServiceDisplayName.COMMONNINJA;
  }

  public connect(): Promise<any> {
    return new Promise((resolve) => {
      promiseMysql.createConnection(this.connectionParams).then((connection) => {
        logger.info(`Successfully connected to mysql db "${this.connectionParams.database}".`);
        resolve(connection);
      }).catch((e) => {
        logger.error(`Error connecting to mysql db "${this.connectionParams.database}": `, e.message);

        if (env !== 'dev') {
          emailService.send({
            params: {
              toEmail: 'admin@commoninja.com',
              toName: 'Daniel',
              subject: `${this.service}: Error connecting to database`,
              replyTo: 'noreply@commoninja.com',
              message: `Error connecting to db: ${e.message}`,
            },
            serviceName: ServiceDisplayName.COMMONNINJA,
            emailType: EmailType.OTHER,
            service: ServiceName.COMMONNINJA,
          }).then(res => logger.info('Email on failed db connection sent.', res)).catch(e => logger.error('Could not send email on db connection failure', e));
        }
      });
    });
  }
}
