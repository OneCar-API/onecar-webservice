import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import AdsController from '../controllers/AdsController';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';

const upload = multer(uploadConfig);

const adsRouter = Router();

const adsController = new AdsController();

adsRouter.get(
  '/',
  adsController.show,
);

adsRouter.post(
  '/',
  adsController.create,
);

export default adsRouter;
