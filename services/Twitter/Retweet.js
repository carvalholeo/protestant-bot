'use strict';
const client = require('../client');
const makeError = require('../../utils/makeError');
const {
  ErrorLog,
  AccessLog,
  RetweetLog,
  TweetQueue,
  Blocklist,
} = require('../../models');
const logger = require('../../logs/logger');
const RateLimit = require('./RateLimit');
const Stream = require('./Stream');

const rateLimit = new RateLimit();
const endpoint = 'statuses/retweet';

/**
 * Class to Retweet posts selected with some criteria.
 */
class Retweet {
  /**
   * Receives a JSON within tweet to be retweeted.
   * @param {JSON} tweet A single tweet to be retweeted
   */
  constructor(tweet) {
    if (typeof(tweet) === 'undefined') {
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

      const rateLimitResponse = await rateLimit.getLimitFromDatabase(endpoint)
          .then(async (response) => {
            if (typeof (response) === 'string') {
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
                if (Date.now() > response.next_reset) {
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

      if (rateLimitResponse.nextAction === 'enqueue') {
        const queue = new TweetQueue();
        await queue.enqueue(this.tweet);
        return;
      }

      await client.post(`statuses/retweet/${this.tweet.id_str}`)
          .then(async () => {
            await rateLimit.setLimit(endpoint,
                rateLimitResponse.limit - 1,
                rateLimitResponse.next_reset);

            const message = `Tweet de @${this.tweet.user.screen_name}:
            "${this.tweet.text}".`;
            await logger('retweet', message, new RetweetLog());
            await logger('access',
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
   * @return {boolean} Return true if is actually blocked.
   */
  async isBlocked() {
    try {
      const screenName = this.tweet.user.screen_name;
      const blocklist = new Blocklist();
      const list = await blocklist.getAllAcitveBlocks();

      const index = list.indexOf((user) => user.screen_name === screenName);

      if (index >= 0) {
        return true;
      }

      return false;
    } catch (error) {
      const message = `Error on try to retweet.
      Reason: User blocked the bot.
      Stack: ${error}.`;
      await logger('error', message, new ErrorLog());
    }
  }
}

module.exports = Retweet;
