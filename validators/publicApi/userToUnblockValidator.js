'use strict';
// @ts-check

const {body} = require('express-validator');

const userToBlockValidator = [
  body('user')
      .exists()
      .trim()
      .notEmpty()
      .isString()
      .escape()
      .isLength({max: 15}),
];

module.exports = userToBlockValidator;
