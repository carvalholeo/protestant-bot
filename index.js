'use strict';
// @ts-check

const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

require('dotenv').config({path: envFile});
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rfs = require('rotating-file-stream');
const path = require('path');
const hpp = require('hpp');

const generateSecretToJWT = require('./utils/generateSecretToJWT');
const tooBusyMiddleware = require('./middlewares/tooBusyMiddleware');
const routes = require('./routes');

process.env.JWT_SECRET = generateSecretToJWT();

const origin = process.env.FRONTEND_URL ?? 'http://localhost:3000';
const port = Number(process.env.PORT) ?? 3000;
const corsOptions = {
  origin: origin,
  preflightContinue: true,
  optionsSuccessStatus: 200,
};
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs'),
});

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(morgan('combined', {stream: accessLogStream}));
app.use(hpp());
app.use(tooBusyMiddleware);

app.options('*', cors());
app.use('/api', routes);
app.listen(port);

