const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

import dotenv from 'dotenv';
dotenv.config({ path: envFile });

import { resolve } from 'path';

const database = process.env.DB_DATABASE ?? 'protestant_bot';
const username = process.env.DB_USER ?? 'root';
const password = process.env.DB_PASSWORD ?? '';
const client = process.env.DB_CLIENT ?? 'mysql';
const host = process.env.DB_HOST ?? 'localhost';
const port = Number(process.env.DB_PORT) ?? 3306;
const poolMin = Number(process.env.DB_POOL_MIN) ?? 0;
const poolMax = Number(process.env.DB_POOL_MAX) ?? 5;
const useNullAsDefault = Boolean(process.env.DB_USE_NULL_AS_DEFAULT) ?? true;
const acquireConnectionTimeout =
  Number(process.env.DB_ACQUIRE_CONNECTION_TIMEOUT) ?? 60000;

const configuration: any = {
  development: {
    client: client,
    connection: {
      host: host,
      port: port,
      user: username,
      password: password,
      database: database,
    },
    migrations: {
      directory: resolve(__dirname, 'dist', 'database', 'migrations'),
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: resolve(__dirname, 'dist', 'database', 'seeds'),
      extension: 'ts',
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
    connection: {
      host: host,
      port: port,
      user: username,
      password: password,
      database: database,
    },
    migrations: {
      directory: resolve(__dirname, 'dist', 'database', 'migrations'),
      extension: 'ts',
      tableName: 'knex_migrations',
    },
    seeds: {
      directory: resolve(__dirname, 'dist', 'database', 'seeds'),
      extension: 'ts',
    },
    pool: {
      min: poolMin,
      max: poolMax,
    },
    useNullAsDefault,
    acquireConnectionTimeout,
  }
}

export default configuration;
