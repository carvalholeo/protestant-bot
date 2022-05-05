require('./utils/dotEnv');

import express, { json, urlencoded, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors, { CorsOptions } from 'cors';
import hpp from 'hpp';
import cookieParser, { CookieParseOptions } from 'cookie-parser';
import createError from 'http-errors';
import csurf, { CookieOptions } from 'csurf';

import routes from './routes';
import httpLogger from './services/logs/httpLogger';

const origin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const corsOptions: CorsOptions = {
  origin: origin,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};
const COOKIE_OPTIONS: CookieParseOptions | CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
}

const app = express();
const corsExecution = cors(corsOptions);

app.use(httpLogger);
app.use(helmet());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser(process.env.JWT_SECRET, COOKIE_OPTIONS as CookieParseOptions));
app.use(csurf({ cookie: COOKIE_OPTIONS }));
app.use(hpp());

app.use(corsExecution);

app.options('*', corsExecution);
app.use('/api', routes);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(createError(404));
});

interface Error {
  message: string;
  status: number;
}

app.use((err: Error, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res
    .status(err.status || 500)
    .json({ 'message': err.message });
});

export default app;
