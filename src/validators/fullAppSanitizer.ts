import { body, param, query, cookie } from 'express-validator';

const fields = [
  'user',
  'username',
  'comment',
  'session',
  'token',
];

const fullAppSanitizer = [
  body(fields)
      .trim()
      .escape(),

  param(fields)
      .trim()
      .escape(),

  query(fields)
      .trim()
      .escape(),

  cookie(fields)
      .trim()
      .escape(),
];

export default fullAppSanitizer;
