'use strict';
// @ts-check

const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

require('dotenv').config({path: envFile});

const Retweet = require('./services/Twitter/Retweet');
const RateLimit = require('./services/Twitter/RateLimit');
const {TweetQueue} = require('./models');
const Stream = require('./services/Twitter/Stream');
const appError = require('./utils/appError');

const botTimeout = Number(process.env.BOT_TIMEOUT);

/**
 * Function to initialize bot to retweet.
 */
async function BotRetweet() {
  try {
    const rateLimitEndpoint = 'statuses/retweet';
    const tweetQueue = new TweetQueue();
    const rateLimit = new RateLimit();
    const tweets = await tweetQueue.getQueue();
    const {limit} = await rateLimit.getLimitFromDatabase(rateLimitEndpoint);

    if (Array.isArray(tweets) && limit > 0) {
      tweets.forEach(async (tweet) => {
        const post = JSON.parse(tweet.tweet);

        const retweet = new Retweet(post);
        await retweet.retweet();
      });

      setTimeout(async () => {
        await rateLimit.recalibrate(rateLimitEndpoint);
        await tweetQueue.dequeue(tweets, rateLimit);
      }, 2000);
    }

    const stream = new Stream(Retweet);
    stream.handleStream();
  } catch (error) {
    appError(error, initializeBot);
  }
}
setTimeout(BotRetweet, 0);

const initializeBot = setInterval(BotRetweet, botTimeout);


module.exports = BotRetweet;
