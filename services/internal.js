'use strict';
const axios = require('axios');

const baseUrl = process.env.BASE_URL;
const port = process.env.PORT;
const url = `${baseUrl}:${port}`;

const internal = axios.create({
  baseURL: url,
});

module.exports = internal;
