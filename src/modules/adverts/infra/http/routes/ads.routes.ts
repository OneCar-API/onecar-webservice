import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import AdsController from '../controllers/AdsController';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import { celebrate, Joi, Segments } from 'celebrate';

const upload = multer(uploadConfig.multer);

const adsRouter = Router();

const adsController = new AdsController();

adsRouter.get(
  '/',
  adsController.show,
);

adsRouter.post(
  '/',
  ensureAuthenticated,
  adsController.create,
);

adsRouter.post(
  '/import',
  upload.single('file-ads'),
  ensureAuthenticated,
  adsController.import,
);

adsRouter.put(
  '/:id',
  ensureAuthenticated,
  adsController.updateAd)

adsRouter.put(
  '/vehicle-items/:id',
  ensureAuthenticated,
  adsController.updateVehicleItems)

adsRouter.get(
  '/:id',
  adsController.index,
);

adsRouter.patch(
  '/:ad_id/car/:car_id/car-image',
  celebrate({
    [Segments.PARAMS]: {
      ad_id: Joi.string().uuid().required(),
      car_id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  upload.single('image'),
  adsController.upload,
);

export default adsRouter;
