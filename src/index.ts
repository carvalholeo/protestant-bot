const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

import dotenv from 'dotenv';
dotenv.config({ path: envFile });

import express, { json, urlencoded } from 'express';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';

import generateSecretToJWT from './utils/generateSecretToJWT';
import routes from './routes';

import httpLogger from './services/logs/log';

process.env.JWT_SECRET = generateSecretToJWT();

const origin = process.env.FRONTEND_URL ?? 'http://localhost:3000';

const corsOptions = {
  origin: origin,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(hpp());

app.use(cors(corsOptions));

app.options('*', cors);
app.use('/api', routes);

app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

interface Error {
  message: String;
  status: number;
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ 'message': err.message });
});

export default app;
