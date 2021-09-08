import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().min(6).required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create,
);

export default passwordRouter;
