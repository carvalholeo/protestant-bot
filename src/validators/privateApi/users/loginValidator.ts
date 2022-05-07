import { body } from 'express-validator';

const loginValidator = [
  body('username')
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .escape()
    .exists()
    .isString()
    .isLength({ min: 3 }),

  body('password')
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .escape()
    .exists()
    .isStrongPassword({ minLength: 8 }),
];

export default loginValidator;
