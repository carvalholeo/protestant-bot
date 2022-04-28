import client from '../api/client';
import {
  RetweetLog, TweetQueue, Blocklist,
} from '../../db/repository';
import logger from '../../logs/logger';
import RateLimit from './RateLimit';
import Stream from './Stream';

import Tweet from '../../interfaces/typeDefinitions/Tweet';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

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
            const text = `Error on handle with rate limit.
              Reason: ${error.message}.
              Stack: ${error}`;

            const message: LogDatabase = {
              emmiter: 'RetweetService.retweet.try.rateLimitResponse.catch',
              level: 'error',
              message: text,
            };

            await logger(message);
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

            const logObject: LogDatabase = {
              emmiter: 'RetweetService.retweet.try.post.then',
              level: 'info',
              message: 'A tweet post was retweeted.',
            };
            await logger(logObject);

            console.log(message);
          })
          .catch(async (error) => {
            const logObject: LogDatabase = {
              emmiter: 'RetweetService.retweet.try.post.catch',
              level: 'error',
              message: error.message,
            };
            await logger(logObject);
          });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RetweetService.retweet.catch',
        level: 'error',
        message: error.message,
      };
      await logger(logObject);
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
      // @ts-expect-error
      const [tweetOriginal] = await blocklist
          .getOneBlock(screenName);
      let quotedTweet = undefined;
      const message: LogDatabase = {
        level: 'debug',
        emmiter: '',
        message: '',
      };

      await logger({
        ...message,
        emmiter: 'Retweet.isBlocked.tweet_object.try',
        message: JSON.stringify(this.tweet),
      });
      await logger({
        ...message,
        emmiter: 'Retweet.isBlocked.blocklist_object.original.try',
        message: JSON.stringify(tweetOriginal),
      });

      if (this.tweet.is_quote_status) {
        [quotedTweet] = await blocklist
            .getOneBlock(this.tweet.quoted_status.user.screen_name);

        await logger({
          ...message,
          emmiter: 'Retweet.isBlocked.blocklist_object.quoted.try',
          message: JSON.stringify(quotedTweet),
        });
      }

      return (tweetOriginal || quotedTweet) ? true : false;
    } catch (error: any) {
      const logObject: LogDatabase = {
        level: 'debug',
        emmiter: 'Retweet.isBlocked.catch',
        message: error.message,
      };
      await logger(logObject);
      return true;
    }
  }
}

export default Retweet;
