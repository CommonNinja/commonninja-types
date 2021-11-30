import { HttpClient } from '../http';

export class BaseService {

  protected httpClient: HttpClient;

  constructor() {
    this.httpClient = new HttpClient();
  }
}
