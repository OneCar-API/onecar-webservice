import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import multer from 'multer';

import uploadConfig from '@config/upload';
import AdsController from '../controllers/AdsController';
import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';

const upload = multer(uploadConfig.multer);

const adsRouter = Router();

const adsController = new AdsController();

adsRouter.get(
  '/:ad_id',
  celebrate({
    [Segments.PARAMS]: {
      ad_id: Joi.string().uuid().required(),
    },
  }),
  adsController.show,
);

adsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      title: Joi.string().empty(''),
      description: Joi.string().empty(''),
      fuel: Joi.string().empty(''),
      manufacturer: Joi.string().empty(''),
      brand: Joi.string().empty(''),
      model: Joi.string().empty(''),
      year_manufacture: Joi.string().empty(''),
      year_model: Joi.string().empty(''),
      vehicle_item_id: Joi.string().uuid().empty(''),
      vehicle_price: Joi.string().empty(''),
      color: Joi.string().empty(''),
      doors: Joi.number(),
      km: Joi.number(),
    },
  }),
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
  celebrate({
    [Segments.PARAMS]: {
      id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      title: Joi.string().empty(''),
      description: Joi.string().empty(''),
      fuel: Joi.string().empty(''),
      manufacturer: Joi.string().empty(''),
      brand: Joi.string().empty(''),
      model: Joi.string().empty(''),
      year_manufacture: Joi.string().empty(''),
      year_model: Joi.string().empty(''),
      vehicle_item_id: Joi.string().uuid().empty(''),
      vehicle_price: Joi.string().empty(''),
      doors: Joi.number(),
      km: Joi.number(),
      color: Joi.string().empty(''),
    },
  }),
  ensureAuthenticated,
  adsController.updateAd)

adsRouter.put(
  '/vehicle-items/:id',
  ensureAuthenticated,
  adsController.updateVehicleItems)

adsRouter.get(
  '/',
  celebrate({
    [Segments.QUERY]: {
      user: Joi.string().empty(''),
      car: Joi.string().empty(''),
      address: Joi.string().empty(''),
      airbag: Joi.boolean().empty(null),
      alarm: Joi.boolean().empty(null),
      air_conditioning: Joi.boolean().empty(null),
      eletric_lock: Joi.boolean().empty(null),
      eletric_window: Joi.boolean().empty(null),
      stereo: Joi.boolean().empty(null),
      reverse_sensor: Joi.boolean().empty(null),
      reverse_camera: Joi.boolean().empty(null),
      armoured: Joi.boolean().empty(null),
      hydraulic_steering: Joi.boolean().empty(null),
      fromKm: Joi.number().empty(null),
      toKm: Joi.number().empty(null),
      offset: Joi.number().empty(''),
      limit: Joi.number().empty(''),
    },
  }),
  adsController.index,
);

adsRouter.post(
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

adsRouter.delete(
  '/:id',
  ensureAuthenticated,
  adsController.destroy
)

adsRouter.get(
  '/myAds/show',
  ensureAuthenticated,
  adsController.listByUser
)

export default adsRouter;
