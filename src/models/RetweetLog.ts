import BaseLogModel from './BaseLog';
import ErrorLog from './ErrorLog';
import logger from '../logs/logger';

import RetweetLogInterface from '../interfaces/typeDefinitions/RetweetLogInterface';
import Tweet from '../interfaces/typeDefinitions/Tweet';

const initialLimit = 100;
const initialOffset = 100;
/**
 * Class to log all retweets done by the application
 * @class RetweetLog
 * @extends BaseLogModel
 */
class RetweetLog extends BaseLogModel {
  /**
   * On instantiate Retweet Log class, it's necessary to provide the table to
   * handle. This table name is passed as an argument here to the constructor
   * of base class.
   */
  constructor() {
    super('retweet');
  }

  /**
   * Method to retrieve all retweets done on bot.
   * @param page Page number of data to be retrieved.
   * @return Return an array on success by
   * retrieving.
   */
  async getAllRetweets(page: number = 1): Promise<RetweetLogInterface[] | undefined> {
    try {
      const limit = page === 1 ? initialLimit : page * initialLimit;
      const offset = initialOffset * (page - 1);

      return await this._connection
          .where({was_undone: false})
          .limit(limit)
          .offset(offset)
          .select('*');
    } catch (error) {
      const message = `An error occurred on retrieving retweets.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to count retweets that were not undone.
   * @param wasUndone Indicate if tweets undone must be counted.
   * @return Number of retweets.
   */
  async countRetweets(wasUndone: boolean = false): Promise<number | undefined> {
    try {
      return await this._connection
          .where({was_undone: wasUndone})
          .count({tweets: 'tweet_id'});
    } catch (error) {
      const message = `An error occurred on counting retweets.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to retrieve all retweets undone on bot.
   * @param page Page number of data to be retrieved.
   * @return Return an array on success by retrieving.
   */
  async getAllRetweetsUndone(page: number = 1): Promise<RetweetLogInterface[] | undefined> {
    try {
      const limit = page === 1 ? initialLimit : page * initialLimit;
      const offset = initialOffset * (page - 1);

      return await this._connection
          .where({was_undone: true})
          .limit(limit)
          .offset(offset)
          .select('*');
    } catch (error) {
      const message = `An error occurred on retrieving retweets undone.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
  /**
   * Undo retweets and add a comment about this decision.
   * @param tweetId Tweet to be undone on Twitter
   * @param comment Comment about decision of retweet undone
   */
  async undoRetweet(tweetId: string, comment: string = ''): Promise<void> {
    try {
      await this._connection
          .where({tweet_id: tweetId})
          .update({
            comment: comment === '' ? null : comment,
            was_undone: true,
            updated_at: this.dateTime,
          });
    } catch (error: any) {
      const message = `An error occurred on trying undo a retweet.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to insert into retweet log a specific message, contains author,
   * id for original tweet and if was undone or not, with a comment about this.
   * @param {Tweet} tweetObject Object with all tweet properties
   */
  async registerRetweet(tweetObject: Tweet): Promise<void> {
    try {
      const tweetId = tweetObject.id_str;
      const screenName = tweetObject.user.screen_name;
      const tweet = tweetObject.text;
      const message = `Tweet de @${screenName}: ${tweet}`;

      await this._connection
          .insert({
            tweet_id: tweetId,
            screen_name: screenName,
            tweet,
            message,
            created_at: this.dateTime,
            updated_at: this.dateTime,
          });
    } catch (error) {
      const message = `An error occurred on logging a retweet.
      Message generated: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

export default RetweetLog;
