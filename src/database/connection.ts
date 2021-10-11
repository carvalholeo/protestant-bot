
import knex from 'knex';
import configuration from '../../knexfile';

const environment = process.env.NODE_ENV ?? 'development';
// @ts-expect-error
const config = configuration[environment];

const connection = knex(config);

export default connection;
