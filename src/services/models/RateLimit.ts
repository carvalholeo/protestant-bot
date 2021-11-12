import models from '../../db/models';
import logger from '../../logs/logger';

import RateLimitInterface from '../../interfaces/typeDefinitions/RateLimitInterface';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

/**
 * Handle with rate limit of Twitter on database.
 * @class RateLimit
 */
class RateLimit {
  /**
   * Method to create a new rate limit at the database.
   * @param {RateLimitInterface} information Literal object,
   * with three properties:
   * - resource: API resource of the limit
   * - limit: integer number, with the limit to call API
   * - nextReset: Integer number, time, in minutes to the next reset.
   */
  async create(information: RateLimitInterface): Promise<void> {
    try {
      const {resource, limit, nextReset} = information;

      if (typeof(resource) === 'undefined' ||
      typeof(limit) === 'undefined' ||
      typeof(nextReset) === 'undefined') {
        throw new ReferenceError(`You must to provide a object with
        3 properties: resource (string), limit (number) and nextReset (date).`);
      }
      const dataToInsert = {
        resource: resource,
        limit: limit,
        next_reset: nextReset,
      };

      await models.RateLimit.create(dataToInsert);

      const logObject: LogDatabase = {
        emmiter: 'RateLimitService.create.try',
        level: 'info',
        message: 'Rate limit to resource created',
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RateLimitService.create.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }

  /**
   * Method to get the rate limit, using a Twitter API resource as an argument.
   * @param {string} resource Resource to be retrieved and to know its limit.
   * @return {Promise<RateLimitInterface | string>} Literal object
   * data from database with the data asked.
   */
  async getOneRateLimit(resource: string): Promise<RateLimitInterface|string> {
    try {
      if (typeof(resource) === 'undefined') {
        throw new ReferenceError('You must to provide a resource to retrieve.');
      }

      return await models.RateLimit.findOne({where: {
        resource,
      }});
    } catch (error: any) {
      const message = `Error from RateLimit class, method getOneRateLimit.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;

      const logObject: LogDatabase = {
        emmiter: 'RateLimitService.getOneRateLimit.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
      return message;
    }
  }

  /**
   * Method to update a rate limit of some resource.
   * @param {RateLimitInterface} information Literal object,
   * with three properties:
   * - resource: API resource of the limit to be updated
   * - limit: integer number, with the limit to call API
   * - nextReset: Integer number, time, in minutes to the next reset.
   */
  async update(information: RateLimitInterface): Promise<void> {
    try {
      const {resource, limit, nextReset} = information;

      if (typeof(resource) === 'undefined' ||
          typeof(limit) === 'undefined' ||
          typeof(nextReset) === 'undefined') {
        throw new ReferenceError(`You must to provide a object with
        3 properties: resource (string), limit (number) and nextReset (date).`);
      }

      const dataToUpdate = {
        limit: limit,
        next_reset: nextReset,
      };

      await models.RateLimit.update({...dataToUpdate}, {
        where: {
          resource,
        },
      });
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'RateLimitService.update.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }
}

export default RateLimit;
