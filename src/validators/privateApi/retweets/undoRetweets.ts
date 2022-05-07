import { param, body } from 'express-validator';

const undoRetweets = [
  body('comment').trim().escape().isString().notEmpty().isLength({ max: 250 }),

  param('tweetId')
    .trim()
    .escape()
    .isString()
    .notEmpty()
    .isLength({ min: 19, max: 30 }),
];

export default undoRetweets;
