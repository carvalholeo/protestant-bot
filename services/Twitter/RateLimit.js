// @ts-check
'use strict';

const client = require('../client');
const {
  RateLimit: RateLimitModel,
  ErrorLog,
  AccessLog,
} = require('../../models');
const logger = require('../../logs/logger');

/**
 * Handle with rate limit from Twitter App.
 */
class RateLimit {
  /**
   * Initialize the class with the resource to be checked for
   * use across the app.
   */
  constructor() {
    if (typeof(RateLimit.limit) === 'undefined') {
      RateLimit.limit = 0;
    }
    this.dateTime = new Date()
        .toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'});
  }

  /**
   * Method to retrieve API rate limit to the resource passed to contructor.
   * @param {string} resource Resource from Twitter API to be checked.
   * @return {Promise<string | JSON>} Returns a JSON with rate limit.
   * If fails, returns an error message.
   */
  async getLimitFromTwitter(resource) {
    try {
      const getApiLimit = await client.get(`application/rate_limit_status`, {
        resources: resource,
      });

      await await logger('access',
          'API rate limit asked for Twitter', new AccessLog());
      return getApiLimit;
    } catch (error) {
      const message = `There was an error on get rate limit from Twitter.
      Reason: ${error.errors[0].message}.`;
      await await logger('error', message, new ErrorLog());
      return message;
    }
  }

  /**
   * Method to query rate limit on database.
   * @param {string} endpoint API endpoint stored on database to be queried.
   * @return {Promise<JSON | string>} If success, returns an object within data.
   * If fails, return the string with error message.
   */
  async getLimitFromDatabase(endpoint) {
    try {
      if (typeof(endpoint) === 'undefined') {
        throw new ReferenceError('You must to provide a resource to query.');
      }
      const rateLimitModel = new RateLimitModel();

      const getLimit = await rateLimitModel.getOneRateLimit(endpoint);

      await logger('access',
          'API rate limit asked for database', new AccessLog());

      if (typeof(getLimit) === 'string') {
        throw new Error(`There is no rate limit registered on database
        to the resource asked.`);
      }

      return getLimit;
    } catch (error) {
      const message = `There was an error on get rate limit from database.
      Reason: ${error.message}.`;
      await await logger('error', message, new ErrorLog());

      return message;
    }
  }

  /**
   * Method to store API rate limit on the database.
   * @param {string} endpoint Endpoint to be stored on database
   * @param {number} limit Integer number, with the limit of the API
   * @param {number} nextReset Integer number, time in minutes to the next reset
   */
  async setLimit(endpoint, limit, nextReset) {
    try {
      if (typeof(endpoint) === 'undefined' ||
          typeof(limit) === 'undefined' ||
          typeof(nextReset) === 'undefined') {
        throw new ReferenceError(`You must to provide a object with 3
        properties: resource (string), limit (number) and nextReset (number).`);
      }
      const rateLimitModel = new RateLimitModel();
      const isAlreadyOnDatabase = rateLimitModel.getOneRateLimit(endpoint);

      if (typeof(isAlreadyOnDatabase) !== 'string') {
        await rateLimitModel.update({
          resource: endpoint,
          limit: limit,
          nextReset,
        });
        await logger('access',
            'API rate limit updated on database',
            new AccessLog());
        return;
      }

      await await logger('access',
          'API rate limit created on database', new AccessLog());
      await rateLimitModel.create({
        resource: endpoint,
        limit: limit,
        nextReset: reset,
      });
      return;
    } catch (error) {
      const message = `There was an error on try handle incoming streaming.
      Reason: ${error.message}.`;
      await await logger('error', message, new ErrorLog());
      return;
    }
  }

  /**
   * Method to query Twitter API. Using after make many retweets from queue.
   * @param {string} endpoint Endpoint to query and verify current rate limit
   */
  async recalibrate(endpoint) {
    try {
      const {resources} = await this.getLimitFromTwitter('statuses');
      const {
        remaining,
        reset,
      } = resources.statuses['/statuses/retweets/:id'];

      await this.setLimit(endpoint, remaining, reset * 1000);
    } catch (error) {
      const message = `There was an error on try recalibrate rate limit.
      Reason: ${error}.`;
      await logger('error', message, new ErrorLog());
    }
  }
}

module.exports = RateLimit;
