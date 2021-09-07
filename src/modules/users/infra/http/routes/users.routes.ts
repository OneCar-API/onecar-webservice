import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import UsersController from '../controllers/UsersController';

const upload = multer(uploadConfig);

const usersRouter = Router();

const usersController = new UsersController();

usersRouter.post(
  '/users/import',
  upload.single('file-users'),
  usersController.import,
);

export default usersRouter;
