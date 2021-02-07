'use strict';
require('dotenv').config();
const express = require('express');
const routes = require('./routes');

const app = express();

const port = Number(process.env.PORT);

app.use(routes);
app.listen(port);

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});
