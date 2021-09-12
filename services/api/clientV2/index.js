// @ts-check
'use strict';
require('dotenv').config({path: '../.env'});

const Twitter = require('twitter-v2');

const BEARER_TOKEN = process.env.BEARER_TOKEN;

// @ts-ignore
const client = new Twitter({
  bearer_token: BEARER_TOKEN,
});

module.exports = client;
