'use strict';
// @ts-check

const {body} = require('express-validator');

const userToUnblockValidator = [
  body('user')
      .exists()
      .trim()
      .notEmpty()
      .isString()
      .escape()
      .isLength({max: 15}),
];

module.exports = userToUnblockValidator;
