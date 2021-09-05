import 'reflect-metadata';
import 'dotenv/config';

import cors from 'cors';
import express from 'express';

import '@shared/infra/typeorm';

const app = express();

app.use(express.json());

app.use(cors());

export default app;
