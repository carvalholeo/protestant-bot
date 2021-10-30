const ENV = process.env.NODE_ENV ?? 'development';
const envFile = ENV === 'development' ? '.env.local' : '.env';

import dotenv from 'dotenv';
dotenv.config({ path: envFile });

import Retweet from './services/Twitter/Retweet';
import RateLimit from './services/Twitter/RateLimit';
import { TweetQueue } from './models';
import StreamTwitter from './services/Twitter/Stream';
import appError from './utils/appError';

const botTimeout = Number(process.env.BOT_TIMEOUT) || 1800000;

/**
 * Function to initialize bot to retweet.
 */
async function BotRetweet() {
  try {
    const rateLimitEndpoint = 'statuses/retweet';
    const tweetQueue = new TweetQueue();
    const rateLimit = new RateLimit();
    const tweets = await tweetQueue.getQueue();
    // @ts-ignore @ts-nocheck
    const { limit } = await rateLimit.getLimitFromDatabase(rateLimitEndpoint);

    if (Array.isArray(tweets) && limit > 0) {
      tweets.forEach(async (tweet) => {
        // @ts-ignore @ts-nocheck
        const post = JSON.parse(tweet);

        const retweet = new Retweet(post);
        await retweet.retweet();
      });

      setTimeout(async () => {
        await rateLimit.recalibrate(rateLimitEndpoint);
        await tweetQueue.dequeue(tweets);
      }, 2000);
    }

    const stream = new StreamTwitter(Retweet);
    stream.handleStream();
  } catch (error: any) {
    appError(error, initializeBot);
  }
}

const initializeBot = setTimeout(BotRetweet, botTimeout);

export default BotRetweet;
