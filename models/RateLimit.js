'use strict';
// @ts-check

const BaseModel = require('./Base');
const AccessLog = require('./AccessLog');
const ErrorLog = require('./ErrorLog');
const logger = require('../logs/logger');
/**
 * Handle with rate limit of Twitter on database.
 * @class RateLimit
 */
class RateLimit extends BaseModel {
  /**
   * On instanciate, calls base class and pass to its constructor
   * the name of the table.
   */
  constructor() {
    super('rate_limit');
  }

  /**
   * Method to create a new rate limit at the database.
   * @param {JSON} information Literal object, with three properties:
   * - resource: API resource of the limit
   * - limit: integer number, with the limit to call API
   * - nextReset: Integer number, time, in minutes to the next reset.
   */
  async create(information) {
    try {
      const {resource, limit, nextReset} = information;

      if (typeof(resource) === 'undefined' ||
      typeof(limit) === 'undefined' ||
      typeof(nextReset) === 'undefined') {
        throw new ReferenceError(`You must to provide a object with
        3 properties: resoruce (string), limit (number) and nextReset (date).`);
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

      if (!create >= 1) {
        throw new Error('There was an error on insert the rate limit.');
      }
      await logger('access', 'Tweet enqueued', new AccessLog());
    } catch (error) {
      const message = `Error from RateLimit class, method create.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      await logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to get the rate limit, using a Twitter API resource as an argument.
   * @param {string} resource Resource to be retrieved and to know its limit.
   * @return {JSON | string} Literal object data from database with
   * the data asked.
   */
  async getOneRateLimit(resource) {
    try {
      if (typeof(resource) === 'undefined') {
        throw new ReferenceError('You must to provide a resource to retrieve.');
      }

      const rateFromDatabase = await this._connection
          .where({resource: resource})
          .first()
          .select('*');

      if (typeof(rateFromDatabase.resource) === 'undefined') {
        throw new RangeError(`Doesn't exist a resource on database with
        parameter provided.`);
      }

      return rateFromDatabase;
    } catch (error) {
      const message = `Error from RateLimit class, method getOneRateLimit.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      await logger('error', message, new ErrorLog());
      return message;
    }
  }

  /**
   * Method to update a rate limit of some resource.
   * @param {JSON} information Literal object, with three properties:
   * - resource: API resource of the limit to be updated
   * - limit: integer number, with the limit to call API
   * - nextReset: Integer number, time, in minutes to the next reset.
   */
  async update(information) {
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
    } catch (error) {
      const message = `Error from RateLimit class, method update.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      await logger('error', message, new ErrorLog());
    }
  }
}

module.exports = RateLimit;
