const Twitter = require('twitter-lite');

const consumerKey = process.env.CONSUMER_KEY;
const consumerSecret = process.env.CONSUMER_SECRET;
const accessTokenKey = process.env.ACCESS_TOKEN;
const accessTokenSecret = process.env.ACCESS_SECRET;
const version = '1.1';
const extension = true;

const client = new Twitter({
  version: version,
  extension: extension,
  consumer_key: consumerKey,
  consumer_secret: consumerSecret,
  access_token_key: accessTokenKey,
  access_token_secret: accessTokenSecret,
});

module.exports = client;
