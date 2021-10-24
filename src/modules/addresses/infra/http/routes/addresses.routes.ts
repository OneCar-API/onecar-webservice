import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

import AddressesController from '../controllers/AddressesController';

const addressesRouter = Router();

const addressesController = new AddressesController();

addressesRouter.post(
  '/address',
  celebrate({
    [Segments.BODY]: {
      zip_code: Joi.string().required(),
      neighborhood: Joi.string().empty(''),
      city: Joi.string().empty(''),
      state: Joi.string().empty(''),
    },
  }),
  ensureAuthenticated,
  addressesController.create,
);

addressesRouter.get('/addresses',
  celebrate({
    [Segments.QUERY]: {
      offset: Joi.number().empty(''),
      limit: Joi.number().empty(''),
    },
  }),
  addressesController.index,
);

export default addressesRouter;
