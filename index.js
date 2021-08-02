'use strict';
// @ts-check

const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

require('dotenv').config({path: envFile});
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const hpp = require('hpp');

const generateSecretToJWT = require('./utils/generateSecretToJWT');
const routes = require('./routes');

const httpLogger = require('./lib/log');

process.env.JWT_SECRET = generateSecretToJWT();

const origin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const port = Number(process.env.PORT) ?? 3000;
const corsOptions = {
  origin: origin,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(httpLogger);
app.use(hpp());

if (process.env.NODE_ENV !== 'test') {
  const bouncerLimiter = require('./middlewares/bouncerLimiter');
  app.use(bouncerLimiter.block);
}

app.options('*', cors());
app.use('/api', routes);
app.listen(port);

