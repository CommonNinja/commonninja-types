import { Request, Response } from 'express';

import { httpHelpers } from '../';
import { LoggerFactory } from '../../log';

const logger = LoggerFactory.getLogger(__filename);

export interface ICrudController {
  find: (req: Request, res: Response) => Promise<void>
  get: (req: Request, res: Response) => Promise<void>
  create: (req: Request, res: Response) => Promise<void>
  update: (req: Request, res: Response) => Promise<void>
  delete: (req: Request, res: Response) => Promise<void>
}

export class CrudController {
  public model = null as any;

  constructor(model: any) {
    this.model = model;
  }
  
  superGet = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const item = await this.model.findOne({ _id });
      if (item) {
        res.send(httpHelpers.getResult(true, 'found', item));
      } else {
        res.send(httpHelpers.getResult(false, 'not found', null));
      }
    } catch (err) {
      logger.error(err);
      res.send(httpHelpers.getResult(false, err.message));
    }
  }

  superFind = async (req: Request, res: Response) => {
    try {
      const { page = '1', limit = '10', filter = '{}', sort = '{"created":-1}' } = req.query;

      const filterObj = JSON.parse(filter as string || '{}');
      const sortObj = JSON.parse(sort as string || '{}');
      const pageNum = parseInt(page as string || '1');
      const limitNum = parseInt(limit as string || '20');

      const items = await this.model.paginate(filterObj, { page: pageNum, limit: limitNum, sort: sortObj });
      res.send(httpHelpers.getResult(true, 'found', items));
    } catch (err) {
      logger.error(err);
      res.send(httpHelpers.getResult(false, err.message));
    }
  }

  superCreate = async (req: Request, res: Response) => {
    try {
      const comp = new this.model(Object.assign({}, req.body, {}));
      const saved = await comp.save();
      res.send(httpHelpers.getResult(true, 'saved', saved));
    } catch (err) {
      logger.error(err);
      res.send(httpHelpers.getResult(false, err.message));
    }
  }

  superUpdate = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const updated = await this.model.updateOne({ _id }, { $set: req.body });
      res.send(httpHelpers.getResult(true, 'updated', updated));
    } catch (err) {
      logger.error(err);
      res.send(httpHelpers.getResult(false, err.message));
    }
  }

  superDelete = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;
      const updated = await this.model.deleteOne({ _id });
      res.send(httpHelpers.getResult(true, 'deleted', updated));
    } catch (err) {
      logger.error(err);
      res.send(httpHelpers.getResult(false, err.message));
    }
  }
}