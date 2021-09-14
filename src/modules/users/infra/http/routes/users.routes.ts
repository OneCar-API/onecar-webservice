import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';

const upload = multer(uploadConfig);

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post(
  '/users/import',
  upload.single('file-users'),
  usersController.import,
);

usersRouter.get('/users', ensureAuthenticated, usersController.index);

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
