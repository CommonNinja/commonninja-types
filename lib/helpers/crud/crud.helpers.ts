import { Router } from 'express';

import { ICrudController } from './crud.ctrl';

export class CrudHelpers {
  public createCrudRoutes(router: Router, routePath: string = '', crudController: ICrudController) {
    router.get(`${routePath}`, crudController.find);
    router.get(`${routePath}/:_id`, crudController.get);
    router.post(`${routePath}`, crudController.create);
    router.put(`${routePath}/:_id`, crudController.update);
    router.delete(`${routePath}/:_id`, crudController.delete);
  }
}