import { Router } from 'express';

import multer from 'multer';

import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@shared/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';

import ContributorsAttachmentsController from '../controllers/ContributorsAttachmentsController';

const upload = multer(uploadConfig);
const contributorsAttachmentsRouter = Router();

const contributorsAttachmentsController = new ContributorsAttachmentsController();

contributorsAttachmentsRouter.post(
  '/company/:company_id/import-contributors-attachments',
  celebrate({
    [Segments.PARAMS]: {
      company_id: Joi.string().uuid().required(),
    },

    [Segments.QUERY]: {
      confirm_import: Joi.string().required(),
    },
  }),
  ensureAuthenticated,
  upload.single('contributors-attachments'),
  contributorsAttachmentsController.import,
);

contributorsAttachmentsRouter.post(
  '/company/:company_id/collaborator/:collaborator_id/collaborator-attachment',
  celebrate({
    [Segments.PARAMS]: {
      company_id: Joi.string().uuid().required(),
      collaborator_id: Joi.string().uuid().required(),
    },
  }),
  ensureAuthenticated,
  upload.single('attachment'),
  contributorsAttachmentsController.create,
);

export default contributorsAttachmentsRouter;
