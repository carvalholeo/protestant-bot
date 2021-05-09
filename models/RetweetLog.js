// @ts-check

const BaseLogModel = require('./BaseLog');
const ErrorLog = require('./ErrorLog');
const logger = require('../logs/logger');

const initialLimit = 100;
const initialOffset = 100;
/**
 * Class to log all retweets done by the application
 * @class RetweetLog
 * @extends BaseLogModel
 */
class RetweetLog extends BaseLogModel {
  /**
   * On instanciate Retweet Log class, it's necessary to provide the table to
   * handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('retweet');
  }

  /**
   * Method to retrieve all rewteets done on bot.
   * @param {number} page Page number of data to be retrivied.
   * @return {Promise<JSON | JSON[]>} Return an array on success by
   * retrieving.
   */
  async getAllRetweets(page = 1) {
    try {
      const limit = page === 1 ? initialLimit : page * initialLimit;
      const offset = initialOffset * (page - 1);

      return await this._connection
          .where({was_undone: false})
          .limit(limit)
          .offset(offset)
          .select('*');
    } catch (error) {
      const message = `An error occurred on retrivieing rewteets.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to count retweets that were not undone.
   * @param {Boolean} wasUndone Indicate if tweets undone must be counted.
   * @return {Promise<Number>} Number of retweets.
   */
  async countRetweets(wasUndone = false) {
    try {
      return await this._connection
          .where({was_undone: wasUndone})
          .count({tweets: 'tweet_id'});
    } catch (error) {
      const message = `An error occurred on retrivieing rewteets.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to retrieve all rewteets undone on bot.
   * @param {number} page Page number of data to be retrivied.
   * @return {Promise<JSON | JSON[]>} Return an array on success by
   * retrieving.
   */
  async getAllRetweetsUndone(page = 1) {
    try {
      const limit = page === 1 ? initialLimit : page * initialLimit;
      const offset = initialOffset * (page - 1);

      return await this._connection
          .where({was_undone: true})
          .limit(limit)
          .offset(offset)
          .select('*');
    } catch (error) {
      const message = `An error occurred on retrivieing rewteets undone.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
  /**
   * Undo retweets and add a comment about this decision.
   * @param {string} tweetId Tweet to be undone on Twitter
   * @param {string} comment Comment about decison of retweet undone
   */
  async undoRetweet(tweetId, comment = '') {
    try {
      await this._connection
          .where({tweet_id: tweetId})
          .update({
            comment: comment === '' ? null : comment,
            was_undone: true,
            updated_at: this.dateTime,
          });
    } catch (error) {
      const message = `An error occurred on retrivieing rewteets undone.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

module.exports = RetweetLog;
