import { body } from 'express-validator';

const userToBlockValidator = [
  body('user')
      .exists()
      .trim()
      .notEmpty()
      .isString()
      .escape()
      .isLength({max: 15}),
];

export default userToBlockValidator;
