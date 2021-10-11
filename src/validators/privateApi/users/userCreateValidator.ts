import { body } from 'express-validator';

const userCreateValidator = [
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
      .isString()
      .isLength({min: 8}),
];

export default userCreateValidator;
