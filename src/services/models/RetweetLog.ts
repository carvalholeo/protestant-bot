import logger from '../../logs/logger';
import models from '../../db/models';

import RetweetLogInterface from '../../interfaces/typeDefinitions/RetweetLogInterface';
import Tweet from '../../interfaces/typeDefinitions/Tweet';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

const initialLimit = 100;
const initialOffset = 100;
/**
 * Class to log all retweets done by the application
 * @class RetweetLog
 */
class RetweetLog {
  /**
   * Method to retrieve all retweets done on bot.
   * @param {number} page Page number of data to be retrieved.
   * @return {Promise<RetweetLogInterface[] | undefined>}
   * Return an array on success by retrieving.
   */
  async getAllRetweets(
      page: number = 1): Promise<RetweetLogInterface[] | undefined> {
    try {
      const limit = page === 1 ? initialLimit : page * initialLimit;
      const offset = initialOffset * (page - 1);

      return await models.RetweetLog.findAll({
        where: {
          was_undone: false,
        },
        limit,
        offset,
      });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RetweetLogService.getAllRetweets.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }

  /**
   * Method to count retweets that were not undone.
   * @param {boolean} wasUndone Indicate if tweets undone must be counted.
   * @return {Promise<number | undefined>} Number of retweets.
   */
  async countRetweets(wasUndone: boolean = false): Promise<number | undefined> {
    try {
      return await models.RetweetLog.count({
        where: {
          was_undone: wasUndone,
        },
        distinct: true,
        col: 'tweet_id',
      });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RetweetLogService.countRetweets.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }

  /**
   * Method to retrieve all retweets undone on bot.
   * @param {number} page Page number of data to be retrieved.
   * @return {Promise<RetweetLogInterface[] | undefined>}
   * Return an array on success by retrieving.
   */
  async getAllRetweetsUndone(
      page: number = 1): Promise<RetweetLogInterface[] | undefined> {
    try {
      const limit = page === 1 ? initialLimit : page * initialLimit;
      const offset = initialOffset * (page - 1);

      const {count} = await models.RetweetLog.findAndCountAll({
        where: {
          was_undone: true,
        },
        limit,
        offset,
      });

      return count;
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RetweetLogService.getAllRetweetsUndone.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }
  /**
   * Undo retweets and add a comment about this decision.
   * @param {string} tweetId Tweet to be undone on Twitter
   * @param {string} comment Comment about decision of retweet undone
   */
  async undoRetweet(tweetId: string, comment: string = ''): Promise<void> {
    try {
      const tweet = await models.RetweetLog.findOne({where: {
        tweet_id: tweetId,
      }});

      tweet.comment = comment === '' ? null : comment;
      tweet.was_undone = true;

      await tweet.save();
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RetweetLogService.undoRetweet.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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

      await models.RetweetLog.create({
        tweet_id: tweetId,
        screen_name: screenName,
        tweet,
        message,
      });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RetweetLogService.registerRetweet.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }
}

export default RetweetLog;
