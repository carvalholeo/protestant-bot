'use strict';
// @ts-check

const {query} = require('express-validator');

const listRetweets = [
  query('page')
      .escape()
      .trim()
      .toInt()
      .isNumeric({no_symbols: true}),
];

module.exports = listRetweets;
