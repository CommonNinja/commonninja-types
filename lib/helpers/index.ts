import { UserHelpers } from './user/user.helpers';
import { ComponentHelpers } from './component/component.helpers';
import { AssetsHelpers } from './assets/assets.helpers';
import { HttpHelpers } from './http/http.helpers';
import { WixHelpers } from './wix/wix.helpers';
import { UIHelpers } from './ui/ui.helpers';
import { CrudHelpers } from './crud/crud.helpers';

export const userHelpers = new UserHelpers();
export const componentHelpers = new ComponentHelpers();
export const assetsHelpers = new AssetsHelpers();
export const httpHelpers = new HttpHelpers();
export const wixHelpers = new WixHelpers();
export const uiHelpers = new UIHelpers();
export const crudHelpers = new CrudHelpers();
