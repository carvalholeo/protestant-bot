'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const routes = require('./routes');

const app = express();

const port = Number(process.env.PORT);

const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs'),
});

app.use(morgan('combined', {stream: accessLogStream}));

app.use(routes);
app.listen(port);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});
