'use strict';
// @ts-check

const {header} = require('express-validator');

const tokenValidator = [
  header('Authorization')
      .trim()
      .notEmpty({ignore_whitespace: true})
      .escape()
      .exists()
      .isJWT(),
];

module.exports = tokenValidator;
