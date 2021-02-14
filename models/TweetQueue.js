const BaseModel = require('./Base');
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
        tweet: tweet,
        already_retweeted: false,
        created_at: this.dateTime,
        updated_at: this.updated_at,
      };

      const [newEnqueue] = await this._connection
          .returning('id')
          .insert(data);

      if (!newEnqueue >= 1) {
        throw new RangeError(`Something is broken and more than one tweet
        were enqueued. Check this and fix it.`);
      }
    } catch (error) {
      const message = `Error from TweetQueue class, method enqueue.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
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
          .limit(300)
          .select('*');

      if (tweetsEnqueued.length < 1) {
        throw new RangeError('There isn\'t any tweets on the queue');
      }

      return tweetsEnqueued;
    } catch (error) {
      const message = `Error from TweetQueue class, method enqueue.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);

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

      for (const tweet of tweets) {
        await this._connection
            .where({id: tweet.id})
            .delete();
      }
    } catch (error) {
      const message = `Error from TweetQueue class, method enqueue.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }
}

module.exports = TweetQueue;