'use strict';
require('dotenv').config();

const path = require('path');

const database = process.env.DB_DATABASE || 'protestant_bot';
const username = process.env.DB_USER || 'root';
const password = process.env.DB_PASSWORD || '';
const client = process.env.DB_CLIENT || 'mysql';
const host = process.env.DB_HOST || 'localhost';
const port = Number(process.env.DB_PORT) || 3306;
const poolMin = Number(process.env.DB_POOL_MIN) || 0;
const poolMax = Number(process.env.DB_POOL_MAX) || 5;
const useNullAsDefault = process.env.DB_USE_NULL_AS_DEFAULT || true;
const acquireConnectionTimeout = 60000;
const connectionString = `${client}://${username}:${password}@${host}:${port}/${database}`;

module.exports = {
  development: {
    client: client,
    connection: connectionString,
    migrations: {
      directory: path.resolve(__dirname, 'database', 'migrations'),
      extension: 'js',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'database', 'seeds'),
      extension: 'js',
    },
    pool: {
      min: poolMin,
      max: poolMax,
    },
    useNullAsDefault,
    acquireConnectionTimeout,
  },

  production: {
    client: client,
    connection: connectionString,
    migrations: {
      directory: path.resolve(__dirname, 'database', 'migrations'),
      extension: 'js',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: path.resolve(__dirname, 'database', 'seeds'),
      extension: 'js',
    },
    pool: {
      min: poolMin,
      max: poolMax,
    },
    useNullAsDefault,
    acquireConnectionTimeout,
  },

};
