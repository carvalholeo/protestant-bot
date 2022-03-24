const database = process.env.DB_DATABASE ?? 'protestant_bot';
const username = process.env.DB_USER ?? 'root';
const password = process.env.DB_PASSWORD ?? '';
const client = process.env.DB_CLIENT ?? 'mysql';
const host = process.env.DB_HOST ?? 'localhost';
const port = Number(process.env.DB_PORT) ?? 3306;
const poolMin = Number(process.env.DB_POOL_MIN) ?? 0;
const poolMax = Number(process.env.DB_POOL_MAX) ?? 5;
const acquireConnectionTimeout =
  Number(process.env.DB_ACQUIRE_CONNECTION_TIMEOUT) ?? 60000;

module.exports = {
  development: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: client,
    pool: {
      min: poolMin,
      max: poolMax,
      acquire: acquireConnectionTimeout,
    },
  },
  test: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: client,
    pool: {
      min: poolMin,
      max: poolMax,
      acquire: acquireConnectionTimeout,
    },
  },
  production: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: port,
    dialect: client,
    pool: {
      min: poolMin,
      max: poolMax,
      acquire: acquireConnectionTimeout,
    },
  },
};
