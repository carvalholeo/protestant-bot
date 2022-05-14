require('./utils/dotEnv');

import express, { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import hpp from 'hpp';

import routes from './routes';
import httpLogger from './utils/logs/httpLogger';
import logUniqueIdentifier from './middlewares/logUniqueIdentifier';
import createError404 from './middlewares/createError404';
import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware';
import bouncerLimiter from './middlewares/bouncerLimiter';

const origin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const corsOptions: CorsOptions = {
  origin: origin,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};

const app = express();
const corsExecution = cors(corsOptions);

app.use(bouncerLimiter);
app.use(logUniqueIdentifier);
app.use(httpLogger);
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(hpp());

app.use(corsExecution);

app.options('*', corsExecution);
app.use('/api', routes);

// Error Handling
app.use(createError404);
app.use(errorHandlerMiddleware);

export default app;
