import { LoggerFactory } from '../../log';

const logger = LoggerFactory.getLogger(__filename);

export enum ViewType {
  PAGES = 'pages',
  PARTIALS = 'partials',
}

export class UIHelpers {

  private _rootFolder: string = process.cwd();

  private _libBasePath: string = 'node_modules/@commonninja';

  private _uiLibPath: string = `${this._libBasePath}/commonninja-common-ui`;
  
  private _authSdkLibPath: string = `${this._libBasePath}/commonninja-auth-sdk`;
  
  private _uiSrcPath: string = `${this._uiLibPath}/src`;

  private _uiDistPath: string = `${this._uiLibPath}/dist`;
  
  private _authSdkDistPath: string = `${this._authSdkLibPath}/dist`;

  public getCommonView(viewType: ViewType, viewName: string):string {
    if (!viewType || !viewName) {
      logger.error('View type or view name is missing.');
      return '';
    }
    return `${this._rootFolder}/${this._uiDistPath}/views/${viewType}/${viewName}`;
  }

  getUIDistPath(relativePath = false) {
    if (relativePath) {
      return this._uiDistPath;
    }
    return `${this._rootFolder}/${this._uiDistPath}`;
  }

  getAuthSdkDistPath(relativePath = false) {
    if (relativePath) {
      return this._authSdkDistPath;
    }
    return `${this._rootFolder}/${this._authSdkDistPath}`;
  }

  get rootFolder() {
    return this._rootFolder;
  }

  get uiSrcPath() {
    return this._uiSrcPath;
  }

  get uiDistPath() {
    return this._uiDistPath;
  }

  get authSdkDistPath() {
    return this._authSdkDistPath;
  }

}
