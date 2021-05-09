'use strict';
// @ts-check

const {Router} = require('express');

const validatorMiddleware = require('../middlewares/validatorMiddleware');
const TweetsController = require('../controllers/TweetsController');

const listRetweets =
    require('../validators/privateApi/retweets/listRetweets');
const undoRetweets =
    require('../validators/privateApi/retweets/undoRetweets');

// eslint-disable-next-line new-cap
const tweets = Router();


tweets.get('/retweets',
    listRetweets,
    validatorMiddleware,
    TweetsController.listRetweets,
);

tweets.delete('/:tweetId',
    undoRetweets,
    validatorMiddleware,
    TweetsController.undoRetweets,
);

module.exports = tweets;
