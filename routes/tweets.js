'use strict';
// @ts-check

const {Router} = require('express');

const validatorMiddleware = require('../middlewares/validatorMiddleware');
const TweetsController = require('../controllers/TweetsController');

const verifyLogoutMiddleware = require('../middlewares/verifyLogoutMiddleware');
const authorizationMiddleware =
  require('../middlewares/authorizarionMiddleware');
const tokenValidator = require('../validators/privateApi/tokenValidator');

const listRetweets =
    require('../validators/privateApi/retweets/listRetweets');
const undoRetweets =
    require('../validators/privateApi/retweets/undoRetweets');

// eslint-disable-next-line new-cap
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

module.exports = tweets;
