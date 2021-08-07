'use strict';
// @ts-check

const {Router} = require('express');

const validatorMiddleware = require('../middlewares/validatorMiddleware');
const TweetsController = require('../controllers/TweetsController');
const DefaultController = require('../controllers/DefaultController');

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
    .post('/retweets', DefaultController.methodNotAllowed)
    .put('/retweets', DefaultController.methodNotAllowed)
    .patch('/retweets', DefaultController.methodNotAllowed)
    .head('/retweets', DefaultController.methodNotAllowed)
    .delete('/retweets', DefaultController.methodNotAllowed)
    .get('/retweets',
        listRetweets,
        validatorMiddleware,
        TweetsController.listRetweets,
    );

tweets
    .get('/:tweetId', DefaultController.methodNotAllowed)
    .post('/:tweetId', DefaultController.methodNotAllowed)
    .put('/:tweetId', DefaultController.methodNotAllowed)
    .patch('/:tweetId', DefaultController.methodNotAllowed)
    .head('/:tweetId', DefaultController.methodNotAllowed)
    .delete('/:tweetId',
        undoRetweets,
        validatorMiddleware,
        TweetsController.undoRetweets,
    );

module.exports = tweets;
