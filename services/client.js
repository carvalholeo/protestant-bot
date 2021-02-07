'use strict';
const Twitter = require('twitter-lite');


const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const access_token_key = process.env.ACCESS_TOKEN;
const access_token_secret = process.env.ACCESS_SECRET;
const timeout_ms = Number(process.env.TIMEOUT_MS);
const strict_ssl = Boolean(process.env.STRICT_SSL);
const bearer_token = process.env.BEARER_TOKEN;
const version = "1.1";
const extension = true;

const client = new Twitter({
  version,
  extension,
  consumer_key,
  consumer_secret,
  access_token_key,
  access_token_secret
});


module.exports = client;
