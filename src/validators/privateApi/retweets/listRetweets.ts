import { query } from 'express-validator';

const listRetweets = [
  query('page').escape().trim().toInt().isNumeric({ no_symbols: true }),
];

export default listRetweets;
