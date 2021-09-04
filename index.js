'use strict';
// @ts-check

const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

require('dotenv').config({path: envFile});
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');

const generateSecretToJWT = require('./utils/generateSecretToJWT');
const routes = require('./routes');

const httpLogger = require('./lib/log');

process.env.JWT_SECRET = generateSecretToJWT();

const map = new Map();

const origin = process.env.FRONTEND_URL ?? 'http://localhost:3000';

const corsOptions = {
  origin: origin,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(httpLogger);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(hpp());

app.use(cors(corsOptions));

if (process.env.NODE_ENV !== 'test') {
  const bouncerLimiter = require('./middlewares/bouncerLimiter');
  app.use(bouncerLimiter.block);
}

app.options('*', cors());
app.use((req, res, next) => {
  req.map = map;
  next();
});
app.use('/api', routes);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({message: err.message});
});

module.exports = app;
