import { header } from 'express-validator';

const tokenValidator = [
  header('Authorization')
    .trim()
    .notEmpty({ ignore_whitespace: true })
    .escape()
    .exists()
    .isJWT(),
];

export default tokenValidator;
