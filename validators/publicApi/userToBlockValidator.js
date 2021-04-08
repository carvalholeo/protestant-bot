'use strict';

const {body} = require('express-validator');

const userToUnblockValidator = [
  body('user')
      .exists()
      .notEmpty()
      .isString()
      .trim()
      .escape()
      .isLength({max: 15}),
];

module.exports = userToUnblockValidator;
