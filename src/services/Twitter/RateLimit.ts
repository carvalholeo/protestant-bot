import client from '../api/client';
import { RateLimitRepository } from '../../db/repository';
import logger from '../../utils/logs/logger';

import RateLimitInterface from '../../interfaces/typeDefinitions/RateLimitInterface';

/**
 * Handle with rate limit from Twitter App.
 */
class RateLimit {
  public dateTime: string;
  private static limit = 0;
  /**
   * Initialize the class with the resource to be checked for
   * use across the app.
   */
  constructor() {
    if (typeof (RateLimit.limit) === 'undefined') {
      RateLimit.limit = 0;
    }
    this.dateTime = new Date()
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  }

  /**
   * Method to retrieve API rate limit to the resource passed to constructor.
   * @param {string} resource Resource from Twitter API to be checked.
   * @return {Promise<RateLimitInterface | string>}
   * Returns a JSON with rate limit. If fails, returns an error message.
   */
  async getLimitFromTwitter(resource: string):
    Promise<RateLimitInterface | string> {
    try {
      const getApiLimit = await client.get(`application/rate_limit_status`, {
        resources: resource,
      });

      const message = 'API rate limit asked for Twitter';
      logger.info(`${message} at RateLimit.getLimitFromTwitter.try`);
      return getApiLimit;
    } catch (error: any) {
      const text = `There was an error on get rate limit from Twitter.
      Reason: ${error.errors[0].message}.`;

      logger.error(`${text} at RateLimit.getLimitFromTwitter.catch`)

      return text;
    }
  }

  /**
   * Method to query rate limit on database.
   * @param {string} endpoint API endpoint stored on database to be queried.
   * @return {Promise<JSON | string>} If success, returns an object within data.
   * If fails, return the string with error message.
   */
  async getLimitFromDatabase(endpoint: string) {
    try {
      if (typeof (endpoint) === 'undefined') {
        throw new ReferenceError('You must to provide a resource to query.');
      }
      const rateLimitModel = new RateLimitRepository();

      const message = 'API rate limit asked for database';
      logger.info(`${message} at RateLimit.getLimitFromDatabase.try`);

      const getLimit = await rateLimitModel.getOneRateLimit(endpoint);

      if (typeof (getLimit) === 'string') {
        throw new Error(`There is no rate limit registered on database
        to the resource asked.`);
      }

      return getLimit;
    } catch (error: any) {
      const text = `There was an error on get rate limit from database.
      Reason: ${error.message}.`;

      logger.error(`${text} at RateLimit.getLimitFromDatabase.catch`)

      return text;
    }
  }

  /**
   * Method to store API rate limit on the database.
   * @param {string} endpoint Endpoint to be stored on database
   * @param {number} limit Integer number, with the limit of the API
   * @param {number} nextReset Integer number, time in minutes to the next reset
   */
  async setLimit(
    endpoint: string,
    limit: number,
    nextReset: number): Promise<void> {
    try {
      if (typeof (endpoint) === 'undefined' ||
        typeof (limit) === 'undefined' ||
        typeof (nextReset) === 'undefined') {
        throw new ReferenceError(`You must to provide a object with 3
        properties: resource (string), limit (number) and nextReset (number).`);
      }
      const rateLimitModel = new RateLimitRepository();
      const isAlreadyOnDatabase = rateLimitModel.getOneRateLimit(endpoint);

      if (typeof (isAlreadyOnDatabase) !== 'string') {
        await rateLimitModel.update({
          resource: endpoint,
          limit: limit,
          nextReset,
        });

        logger.info(`API rate limit updated on database at RateLimit.setLimit.try`);

        return;
      }

      logger.info(`API rate limit updated on database at RateLimit.setLimit.try`);

      await rateLimitModel.create({
        resource: endpoint,
        limit: limit,
        nextReset,
      });
      return;
    } catch (error: any) {
      logger.error(`${error.message} at RateLimit.setLimit.catch`);

      return;
    }
  }

  /**
   * Method to query Twitter API. Using after make many retweets from queue.
   * @param {string} endpoint Endpoint to query and verify current rate limit
   */
  async recalibrate(endpoint: string): Promise<void> {
    try {
      // @ts-ignore @ts-nocheck
      const { resources } = await this.getLimitFromTwitter('statuses');
      const {
        remaining,
        reset,
      } = resources.statuses['/statuses/retweets/:id'];

      await this.setLimit(endpoint, remaining, reset * 1000);
    } catch (error: any) {
      logger.error(`${error.message} at RateLimit.recalibrate.catch`);
    }
  }
}

export default RateLimit;
