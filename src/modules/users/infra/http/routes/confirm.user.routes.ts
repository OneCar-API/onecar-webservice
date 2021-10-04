import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ConfirmUserController from '../controllers/ConfirmUserController';

const confirmUserController = new ConfirmUserController();

const confirmUsersRouter = Router();

confirmUsersRouter.patch(
  '/',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
    },
  }),
  confirmUserController.patch,
);

confirmUsersRouter.put(
  '/update-token',
  celebrate({
    [Segments.BODY]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  confirmUserController.update,
);

export default confirmUsersRouter;
