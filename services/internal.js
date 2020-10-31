'use strict';
const axios = require("axios");

const base_url = process.env.BASE_URL;
const port = process.env.PORT;
const url = `${base_url}:${port}`;

const internal = axios.create({
  baseURL: url
});

module.exports = internal;
