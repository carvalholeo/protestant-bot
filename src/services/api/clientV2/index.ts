import dotenv from 'dotenv';
dotenv.config({path: '../.env'});

import Twitter from 'twitter-v2';

const BEARER_TOKEN = process.env.BEARER_TOKEN || '';

const client = new Twitter({
  bearer_token: BEARER_TOKEN,
});

export default client;
