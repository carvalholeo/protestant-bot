const BaseModel = require('./Base');
const ErrorLog = require('./ErrorLog');
const logger = require('../logs/logger');

/**
 * Class to create and handle with a queue of tweets. Used when the rate limit
 * did reach, to store those tweets and so retweet them when that limit were
 * reseted.
 * @class TweetQueue
 * @extends BaseModel
 */
class TweetQueue extends BaseModel {
  /**
   * Pass to the base class constructor the name of the table.
   */
  constructor() {
    super('tweet_queue');
  }

  /**
   * Method to enqueue a tweet to be retweet later.
   * @param {JSON} tweet Tweet to be queued
   */
  async enqueue(tweet) {
    try {
      if (typeof(tweet) === 'undefined') {
        throw new ReferenceError(`You must provide a object with
        the tweet to be stored and enqueued.`);
      }
      const data ={
        tweet: JSON.stringify(tweet),
        tweet_id: tweet.id_str,
        already_retweeted: false,
        created_at: this.dateTime,
        updated_at: this.updated_at,
      };

      const [newEnqueue] = await this._connection
          .insert(data);

      const rateLimit = new RateLimit();
      await rateLimit.recalibrate('statuses/retweet');

      if (!newEnqueue >= 1) {
        throw new RangeError(`Something is broken and more than one tweet
        were enqueued. Check this and fix it.`);
      }
    } catch (error) {
      const message = `Error from TweetQueue class, method enqueue.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to get queue of tweets, ready to be retweeted.
   * @return {Array<JSON> | string} Return an array of literal objects.
   */
  async getQueue() {
    try {
      const tweetsEnqueued = await this._connection
          .where({already_retweeted: false})
          .orderBy('created_at', 'asc')
          .limit(75)
          .select('*');

      if (tweetsEnqueued.length < 1) {
        throw new RangeError('There isn\'t any tweets on the queue');
      }

      return tweetsEnqueued;
    } catch (error) {
      const message = `Error from TweetQueue class, method queue.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());

      return error.message;
    }
  }

  /**
   * Method to remove tweets from the queue. Should be used after retweet
   * posts.
   * @param {Array<JSON>} tweets Array of objects to removed from the queue.
   */
  async dequeue(tweets) {
    try {
      if (typeof(tweets) === 'undefined') {
        throw new ReferenceError(`You must to provide an array of literal
        objects to be iterated.`);
      }

      const idsToDelete = [];

      for (const tweet of tweets) {
        idsToDelete.push(tweet.id);
      }

      await this._connection
          .whereIn('id', idsToDelete)
          .delete();
    } catch (error) {
      const message = `Error from TweetQueue class, method dequeue.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

module.exports = TweetQueue;
