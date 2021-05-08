'use strict';
// @ts-check

const {header} = require('express-validator');

const tokenValidator = [
  header('Authorization')
      .trim()
      .notEmpty({ignore_whitespace: true})
      .withMessage('You must to send some content in Authorization header')
      .exists()
      .withMessage('You must to send an Authorization header')
      .isJWT()
      .withMessage('You must to send a JWT token'),
];

module.exports = tokenValidator;
