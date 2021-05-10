// @ts-check

const {body, param, query, header} = require('express-validator');

const fullAppSanitizer = [
  body()
      .trim()
      .escape(),

  param()
      .trim()
      .escape(),

  query()
      .trim()
      .escape(),

  header()
      .trim()
      .escape(),
];

module.exports = fullAppSanitizer;
