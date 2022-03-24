const {
  DB_DATABASE: database = 'protestant_bot',
  DB_USER: username = 'root',
  DB_PASSWORD: password = '',
  DB_CLIENT: client = 'mysql',
  DB_HOST: host = 'localhost',
  DB_PORT: port = 3306,
  DB_POOL_MIN: poolMin = 0,
  DB_POOL_MAX: poolMax = 5,
  DB_ACQUIRE_CONNECTION_TIMEOUT: acquireConnectionTimeout = 60000,
} = process.env;

module.exports = {
  development: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: Number(port),
    dialect: client,
    pool: {
      min: Number(poolMin),
      max: Number(poolMax),
      acquire: Number(acquireConnectionTimeout),
    },
  },
  stage: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: Number(port),
    dialect: client,
    pool: {
      min: Number(poolMin),
      max: Number(poolMax),
      acquire: Number(acquireConnectionTimeout),
    },
  },
  test: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: Number(port),
    dialect: client,
    pool: {
      min: Number(poolMin),
      max: Number(poolMax),
      acquire: Number(acquireConnectionTimeout),
    },
  },
  production: {
    username: username,
    password: password,
    database: database,
    host: host,
    port: Number(port),
    dialect: client,
    pool: {
      min: Number(poolMin),
      max: Number(poolMax),
      acquire: Number(acquireConnectionTimeout),
    },
  },
};
