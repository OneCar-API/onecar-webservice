import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import '@shared/infra/typeorm';
import routes from './routes';

import '@shared/container';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

export default app;
