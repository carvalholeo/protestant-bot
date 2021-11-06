import BaseModel from './Base';
import AccessLog from './AccessLog';
import ErrorLog from './ErrorLog';
import logger from '../../logs/logger';

import RateLimitInterface from '../../interfaces/typeDefinitions/RateLimitInterface';

/**
 * Handle with rate limit of Twitter on database.
 * @class RateLimit
 */
class RateLimit extends BaseModel {
  /**
   * On instantiate, calls base class and pass to its constructor
   * the name of the table.
   */
  constructor() {
    super('rate_limit');
  }

  /**
   * Method to create a new rate limit at the database.
   * @param information Literal object, with three properties:
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
        created_at: this.dateTime,
        updated_at: this.dateTime,
      };

      const [create] = await this._connection
          .returning('id')
          .insert(dataToInsert);

      if (!(create >= 1)) {
        throw new Error('There was an error on insert the rate limit.');
      }
      await logger('access', 'Tweet enqueued', new AccessLog());
    } catch (error: any) {
      const message = `Error from RateLimit class, method create.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      await logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to get the rate limit, using a Twitter API resource as an argument.
   * @param resource Resource to be retrieved and to know its limit.
   * @return Literal object data from database with
   * the data asked.
   */
  async getOneRateLimit(resource: string): Promise<RateLimitInterface | string> {
    try {
      if (typeof(resource) === 'undefined') {
        throw new ReferenceError('You must to provide a resource to retrieve.');
      }

      return await this._connection
          .where({resource: resource})
          .first()
          .select('*');
    } catch (error: any) {
      const message = `Error from RateLimit class, method getOneRateLimit.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      await logger('error', message, new ErrorLog());
      return message;
    }
  }

  /**
   * Method to update a rate limit of some resource.
   * @param information Literal object, with three properties:
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
        3 properties: resoruce (string), limit (number) and nextReset (date).`);
      }

      const dataToUpdate = {
        limit: limit,
        next_reset: nextReset,
        updated_at: this.dateTime,
      };

      const update = await this._connection
          .where({resource: resource})
          .update(dataToUpdate);

      if (update !== 1) {
        throw new RangeError(`Something is broken and anyone or
        more than one registers were update. Please check this.`);
      }
    } catch (error: any) {
      const message = `Error from RateLimit class, method update.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      await logger('error', message, new ErrorLog());
    }
  }
}

export default RateLimit;
