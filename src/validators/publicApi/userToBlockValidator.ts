import { body } from 'express-validator';

const userToUnblockValidator = [
  body('user')
      .exists()
      .trim()
      .notEmpty()
      .isString()
      .escape()
      .isLength({max: 15}),
];

export default userToUnblockValidator;
