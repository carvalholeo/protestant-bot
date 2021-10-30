import client from '../api/client';
import makeError from '../../utils/makeError';
import {
  ErrorLog, AccessLog, RetweetLog, TweetQueue, Blocklist
} from '../../models';
import logger from '../../logs/logger';
import RateLimit from './RateLimit';
import Stream from './Stream';

import Tweet from '../../interfaces/typeDefinitions/Tweet';

const rateLimit = new RateLimit();
const endpoint = 'statuses/retweet';

/**
 * Class to Retweet posts selected with some criteria.
 */
class Retweet {
  public tweet: Tweet;
  public stream: Stream;
  /**
   * Receives a JSON within tweet to be retweeted.
   * @param {Tweet} tweet A single tweet to be retweeted
   */
  constructor(tweet: Tweet) {
    if (typeof (tweet) === 'undefined') {
      throw new ReferenceError(`You must provide a tweet.`);
    }
    this.tweet = tweet;
    this.stream = new Stream(Retweet);
  }

  /**
   * Method to retweet a post
   */
  async retweet() {
    try {
      if (await this.isBlocked()) {
        return;
      }

      const rateLimitResponse = rateLimit.getLimitFromDatabase(endpoint)
          .then(async (response) => {
            if (typeof (response) === 'string') {
            // @ts-ignore @ts-nocheck
              const {resources} = await rateLimit
                  .getLimitFromTwitter('statuses');

              const {
                remaining: apiLimit,
                reset,
              } = resources.statuses['/statuses/retweets/:id'];

              await rateLimit.setLimit(endpoint,
                  apiLimit,
                  reset * 1000);
            } else {
              if (response.limit < 1) {
              // @ts-ignore @ts-nocheck
                if (Date.now() > response.next_reset) {
                // @ts-ignore @ts-nocheck
                  const {resources} = await rateLimit.
                      getLimitFromTwitter('statuses');

                  const {
                    remaining: apiLimit,
                    reset,
                  } = resources.statuses['/statuses/retweets/:id'];

                  await rateLimit.setLimit(endpoint,
                      apiLimit,
                      reset * 1000);
                }
                response.nextAction = 'enqueue';
              } else {
                response.nextAction = 'retweet';
              }
            }
            return response;
          })
          .catch(async (error) => {
            const message = `Error on handle with rate limit.
              Reason: ${error}.
              Stack: ${error}`;

            await logger('error', message, new ErrorLog());
          });
      // @ts-ignore @ts-nocheck
      if (rateLimitResponse.nextAction === 'enqueue') {
        const queue = new TweetQueue();
        await queue.enqueue(this.tweet);
        return;
      }

      await client.post(`statuses/retweet/${this.tweet.id_str}`, {})
          .then(async () => {
            await rateLimit.setLimit(endpoint,
            // @ts-ignore @ts-nocheck
                rateLimitResponse.limit - 1,
                // @ts-ignore @ts-nocheck
                rateLimitResponse.next_reset);

            const message = `Tweet de @${this.tweet.user.screen_name}:
            "${this.tweet.text}".`;
            const retweet = new RetweetLog();
            await retweet.registerRetweet(this.tweet);
            logger('access',
                `A tweet post was retweeted.`,
                new AccessLog());

            console.log(message);
          })
          .catch(async (error) => {
            const message = `There was an error on try to retweet.
            Reason: ${error}`;
            await logger('error', message, new ErrorLog());

            this.stream.killInstance();
            await makeError(message, `${Retweet.name} on retweet method`);
          });
    } catch (error) {
      const message = `There was an error on try to retweet.
      Reason: ${error}`;
      await logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to confirm if post's owner blocked or not the bot, to prevent
   * retweet from the bot.
   * @return {Promise<Boolean>} Return true if is actually blocked.
   */
  async isBlocked(): Promise<Boolean> {
    try {
      const screenName = this.tweet.user.screen_name;
      const blocklist = new Blocklist();
      const tweetOriginal = await blocklist
          .getOneBlock(screenName);
      let quotedTweet = undefined;

      logger('objeto_tweet', JSON.stringify(this.tweet));
      logger('objeto_blocklist', JSON.stringify(tweetOriginal));

      if (this.tweet.is_quote_status) {
        quotedTweet = await blocklist
            .getOneBlock(this.tweet.quoted_status.user.screen_name);
        logger('objeto_blocklist', JSON.stringify(quotedTweet));
      }

      console.log(tweetOriginal, quotedTweet);

      return (tweetOriginal || quotedTweet) ? true : false;
    } catch (error) {
      const message = `Error on try to retweet.
      Reason: User blocked the bot.
      Stack: ${error}.`;
      await logger('error', message, new ErrorLog());
      return true;
    }
  }
}

export default Retweet;
