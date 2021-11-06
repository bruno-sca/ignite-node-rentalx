import 'reflect-metadata';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import './shared/container';
import './database';

import { router } from './routes';
import swaggerFile from './swagger.json';

const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(router);

export { app };
