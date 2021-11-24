import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';

const upload = multer(uploadConfig.multer);

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post(
  '/user',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      nickname: Joi.string().required(),
      document: Joi.string().required(),
      cnpj: Joi.string().empty(''),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      phone: Joi.string().empty(''),
    },
  }),
  usersController.create,
);

usersRouter.post(
  '/users/import',
  upload.single('file-users'),
  usersController.import,
);

usersRouter.get('/users',
  celebrate({
    [Segments.QUERY]: {
      user: Joi.string().empty(''),
      address: Joi.string().empty(''),
      offset: Joi.number().empty(''),
      limit: Joi.number().empty(''),
    },
  }),
  ensureAuthenticated,
  usersController.index,
);

usersRouter.get(
  '/user/:id',
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  usersController.show,
);

export default usersRouter;
