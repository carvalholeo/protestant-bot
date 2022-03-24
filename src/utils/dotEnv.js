const dotenv = require('dotenv');

const { NODE_ENV = 'development' } = process.env;

const FILES = {
  development: '.env.local',
  staging: '.env.staging',
  test: '.env.test',
  production: '.env'
};

const envFile = FILES[NODE_ENV];

dotenv.config({
  path: envFile
});
