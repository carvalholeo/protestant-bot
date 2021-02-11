'use strict';

const path = require('path');

const poolMin = 1;
const poolMax = 30;
const useNullAsDefault = true;
const acquireConnectionTimeout = 60000;

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'database', 'database.sqlite'),
    },
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
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, 'database', 'database.sqlite'),
    },
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
