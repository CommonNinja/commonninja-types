import { ServiceName, ServiceDisplayName } from '../globals/index';
import { emailService } from '../services/index';
import { EmailType } from '../services/email/email.service';
import { LoggerFactory } from '../log/index';
import { IDBConnection } from './index';
import { Mongoose } from 'mongoose';
import { ConfigFactory } from '../config';

const config = ConfigFactory.getConfig();
const logger = LoggerFactory.getLogger(__filename);
const env = config.ENV_NAME;

export interface IMongoDBResultItem {
  _id?: string;
  __v?: number;
  created?: string;
  updated?: string;
}

export class MongoDB implements IDBConnection {
  private connectionURI: string;
  private service: string;
  private mongoose: Mongoose | any;

  constructor(connectionURI: string, mongoose: Mongoose | any, service?: string) {
    this.mongoose = mongoose;
    this.connectionURI = connectionURI;
    this.service = service || ServiceDisplayName.COMMONNINJA;
  }

  private disconnect(SIG: string) {
    logger.debug('Trying to exit gracefully...');

    this.mongoose.connection.close(() => {
      logger.info('Closed connection to DB');
      process.kill(process.pid, SIG);
    });
  }

  private listenToProcess() {
    // If the Node process ends, close the Mongoose connection
    process.once('SIGUSR2', () => this.disconnect('SIGUSR2'));
  }

  public connect() : Promise<any> {
    return this.mongoose.connect(this.connectionURI, { useNewUrlParser: true }).then((connection) => {
      logger.info('Successfully connected to db.');
      this.listenToProcess();
      return connection;
    }).catch((e) => {
      logger.error('Error connecting to db: ', e.message);
      
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
  }
}
