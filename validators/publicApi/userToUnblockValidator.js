'use strict';

const {body} = require('express-validator');

const userToBlockValidator = [
  body('user')
      .exists()
      .notEmpty()
      .isString()
      .trim()
      .escape()
      .isLength({max: 15}),
];

module.exports = userToBlockValidator;
