// @ts-check
'use strict';

const {body} = require('express-validator');

const loginValidator = [
  body('username')
      .trim()
      .notEmpty({ignore_whitespace: true})
      .escape()
      .exists()
      .isString()
      .isLength({min: 3}),

  body('password')
      .trim()
      .notEmpty({ignore_whitespace: true})
      .escape()
      .exists()
      .isStrongPassword({minLength: 8}),
];

module.exports = loginValidator;
