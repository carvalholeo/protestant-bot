import client from '../api/client';
import {
  RetweetLogRepository,
  TweetQueueRepository,
  BlocklistRepository,
} from '../../db/repository';
import logger from '../../utils/logs/logger';
import RateLimit from './RateLimit';
import Stream from './StreamTwitter';

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
    if (typeof tweet === 'undefined') {
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

      const rateLimitResponse = rateLimit
        .getLimitFromDatabase(endpoint)
        .then(async (response) => {
          if (typeof response === 'string') {
            // @ts-ignore @ts-nocheck
            const { resources } = await rateLimit.getLimitFromTwitter(
              'statuses'
            );

            const { remaining: apiLimit, reset } =
              resources.statuses['/statuses/retweets/:id'];

            await rateLimit.setLimit(endpoint, apiLimit, reset * 1000);
          } else {
            if (response.limit < 1) {
              // @ts-ignore @ts-nocheck
              if (Date.now() > response.next_reset) {
                // @ts-ignore @ts-nocheck
                const { resources } = await rateLimit.getLimitFromTwitter(
                  'statuses'
                );

                const { remaining: apiLimit, reset } =
                  resources.statuses['/statuses/retweets/:id'];

                await rateLimit.setLimit(endpoint, apiLimit, reset * 1000);
              }
              response.nextAction = 'enqueue';
            } else {
              response.nextAction = 'retweet';
            }
          }
          return response;
        })
        .catch((error) => {
          const text = `Error on handle with rate limit.
              Reason: ${error.message}.
              Stack: ${error}`;
          logger.error(
            `${text} at RetweetService.retweet.try.rateLimitResponse.catch`
          );
        });
      // @ts-ignore @ts-nocheck
      if (rateLimitResponse.nextAction === 'enqueue') {
        const queue = new TweetQueueRepository();
        await queue.enqueue(this.tweet);
        return;
      }

      await client
        .post(`statuses/retweet/${this.tweet.id_str}`, {})
        .then(async () => {
          await rateLimit.setLimit(
            endpoint,
            // @ts-ignore @ts-nocheck
            rateLimitResponse.limit - 1,
            // @ts-ignore @ts-nocheck
            rateLimitResponse.next_reset
          );

          const message = `Tweet de @${this.tweet.user.screen_name}:
"${this.tweet.text}".`;
          const retweet = new RetweetLogRepository();
          await retweet.registerRetweet(this.tweet);

          logger.info(
            `A tweet post was retweeted at RetweetService.retweet.try.post.then`
          );

          // eslint-disable-next-line security-node/detect-crlf
          console.log(message);
        })
        .catch((error) => {
          logger.error(
            `${error.message} at RetweetService.retweet.try.post.catch`
          );
        });
    } catch (error: any) {
      logger.error(`${error.message} at RetweetService.retweet.catch`);
    }
  }

  /**
   * Method to confirm if post's owner blocked or not the bot, to prevent
   * retweet from the bot.
   * @return {Promise<boolean>} Return true if is actually blocked.
   */
  async isBlocked(): Promise<boolean> {
    try {
      const screenName = this.tweet.user.screen_name;
      const blocklist = new BlocklistRepository();
      // @ts-expect-error
      const [tweetOriginal] = await blocklist.getOneBlock(screenName);
      let quotedTweet = undefined;
      logger.debug(
        `${JSON.stringify(
          tweetOriginal
        )} at Retweet.isBlocked.blocklist_object.original.try`
      );
      logger.debug(
        `${JSON.stringify(this.tweet)} at Retweet.isBlocked.tweet_object.try`
      );

      if (this.tweet.is_quote_status) {
        [quotedTweet] = await blocklist.getOneBlock(
          this.tweet.quoted_status.user.screen_name
        );
        logger.debug(
          `${JSON.stringify(
            quotedTweet
          )} at Retweet.isBlocked.blocklist_object.quoted.try`
        );
      }

      return tweetOriginal || quotedTweet ? true : false;
    } catch (error: any) {
      logger.error(`${error.message} at Retweet.isBlocked.catch`);
      return true;
    }
  }
}

export default Retweet;
