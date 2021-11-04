import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import MessagesController from '../controllers/MessagesController';
import { celebrate, Joi, Segments } from 'celebrate';

const messagesRouter = Router();

const messagesController = new MessagesController();

messagesRouter.post(
  '/message',
  celebrate({
    [Segments.BODY]: {
      text: Joi.string().required(),
      recipient_id: Joi.string().uuid().required(),
      advertiser_id: Joi.string().uuid().required(),
      //chat_id: Joi.string().uuid().required(),
    },
  }),
  messagesController.create,
);

export default messagesRouter;
