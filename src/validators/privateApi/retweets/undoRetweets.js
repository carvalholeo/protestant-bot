'use strict';
// @ts-check

const {param, body} = require('express-validator');

const listRetweets = [
  body('comment')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .isLength({max: 250}),

  param('tweetId')
      .trim()
      .escape()
      .isString()
      .notEmpty()
      .isLength({min: 19, max: 30}),
];

module.exports = listRetweets;
