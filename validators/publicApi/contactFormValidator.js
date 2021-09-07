// @ts-check
'use strict';

const {body} = require('express-validator');

const contactFormValidator = [
  body('name')
      .trim()
      .isString()
      .escape()
      .isLength({max: 50}),

  body('email')
      .trim()
      .escape()
      .isEmail({allow_display_name: true})
      .isLength({max: 100}),

  body('twitter')
      .trim()
      .escape()
      .isString()
      .isLength({max: 30}),

  body('message')
      .trim()
      .escape()
      .notEmpty()
      .exists({checkFalsy: true, checkNull: true})
      .isLength({max: 2000}),
];

module.exports = contactFormValidator;
