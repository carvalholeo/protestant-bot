import { Router } from 'express';

import validatorMiddleware from '../middlewares/validatorMiddleware';
import TweetsController from '../controllers/TweetsController';

import verifyLogoutMiddleware from '../middlewares/verifyLogoutMiddleware';
import authorizationMiddleware from '../middlewares/authorizarionMiddleware';
import tokenValidator from '../validators/privateApi/tokenValidator';

import listRetweets from '../validators/privateApi/retweets/listRetweets';
import undoRetweets from '../validators/privateApi/retweets/undoRetweets';

const tweets = Router();

tweets.use(tokenValidator);
tweets.use(validatorMiddleware);
tweets.use(authorizationMiddleware);
tweets.use(verifyLogoutMiddleware);

tweets
    .get('/retweets',
        listRetweets,
        validatorMiddleware,
        TweetsController.listRetweets,
    );

tweets
    .delete('/:tweetId',
        undoRetweets,
        validatorMiddleware,
        TweetsController.undoRetweets,
    );

export default tweets;
