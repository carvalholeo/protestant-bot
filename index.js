'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rfs = require('rotating-file-stream');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  preflightContinue: true,
  optionsSuccessStatus: 200,
}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const port = Number(process.env.PORT);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs'),
});

app.use(morgan('combined', {stream: accessLogStream}));

app.use('/api', routes);
app.listen(port);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});
