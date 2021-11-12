import models from '../../db/models';
import {Op} from 'sequelize';
import logger from '../../logs/logger';

import Tweet from '../../interfaces/typeDefinitions/Tweet';
import TweetQueueInterface from '../../interfaces/typeDefinitions/TweetQueueInterface';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

const {in: opIn} = Op;

/**
 * Class to create and handle with a queue of tweets. Used when the rate limit
 * did reach, to store those tweets and so retweet them when that limit were
 * reseted.
 * @class TweetQueue
 */
class TweetQueue {
  /**
   * Method to enqueue a tweet to be retweet later.
   * @param {Tweet} tweet Tweet to be queued
   */
  async enqueue(tweet: Tweet): Promise<void> {
    try {
      if (typeof(tweet) === 'undefined') {
        throw new ReferenceError(`You must provide a object with
        the tweet to be stored and enqueued.`);
      }
      const data: TweetQueueInterface = {
        tweet: JSON.stringify(tweet),
        tweet_id: tweet.id_str,
        already_retweeted: false,
      };

      await models.TweetQueue.create(data);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'TweetQueueService.enqueue.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }

  /**
   * Method to get queue of tweets, ready to be retweeted.
   * @return {Promise<string | Tweet[]>} Return an array of literal objects.
   */
  async getQueue(): Promise<string | Tweet[]> {
    try {
      const tweetsEnqueued = await models.TweetQueue.findAll({
        where: {
          already_retweeted: false,
        },
        order: [
          ['created_at', 'ASC'],
        ],
        limit: 75,
      });

      if (tweetsEnqueued.length < 1) {
        return [];
      }

      return tweetsEnqueued;
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'TweetQueueService.getQueue.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);

      return error.message;
    }
  }

  /**
   * Method to remove tweets from the queue. Should be used after retweet
   * posts.
   * @param {Array<Tweet>} tweets Array of objects to removed from the queue.
   */
  async dequeue(tweets: Array<Tweet>): Promise<void> {
    try {
      if (typeof(tweets) === 'undefined') {
        throw new ReferenceError(`You must to provide an array of literal
        objects to be iterated.`);
      }

      const idsToDelete = [];

      for (const tweet of tweets) {
        // @ts-ignore
        idsToDelete.push(tweet.id);
      }

      await models.TweetQueue.delete({
        where: {
          id: {
            [opIn]: idsToDelete,
          },
        },
      });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'TweetQueueService.dequeue.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }
}

export default TweetQueue;
