import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import AppError from '@shared/errors/AppError';
import swaggerFile from '@shared/../../src/swagger.json';

import '@shared/infra/typeorm';

import '@shared/container';

import uploadConfig from '@config/upload';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/image', express.static(`${uploadConfig.tmpFolder}/image`));

app.use(
  '/docs/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile),
);

app.use(errors());

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err);

    return response.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  },
);

export default app;
