import { Router } from 'express';

import validatorMiddleware from '../middlewares/validatorMiddleware';
import TweetsController from '../controllers/TweetsController';

import verifyLogoutMiddleware from '../middlewares/verifyLogoutMiddleware';
import authorizationMiddleware from '../middlewares/authorizationMiddleware';
import tokenValidator from '../validators/privateApi/tokenValidator';

import listRetweets from '../validators/privateApi/retweets/listRetweets';
import undoRetweets from '../validators/privateApi/retweets/undoRetweets';

const tweets = Router();

tweets
  .use(tokenValidator)
  .use(validatorMiddleware)
  .use(authorizationMiddleware)
  .use(verifyLogoutMiddleware);

tweets
  .get(
    '/retweets',
    listRetweets,
    validatorMiddleware,
    TweetsController.listRetweets
  )
  .delete(
    '/:tweetId',
    undoRetweets,
    validatorMiddleware,
    TweetsController.undoRetweets
  );

export default tweets;
