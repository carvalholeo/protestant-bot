'use strict';
// @ts-check

const RateLimit = require('../services/Twitter/RateLimit');
const {ErrorLog} = require('../models');
const logger = require('../logs/logger');


/**
 * This function make a query to database to get rate limit on
 * retweet endpoint.
 * @return {Promise<any>} Returns a response about rate limit
 * on database.
 */
function rateLimit() {
  const limit = new RateLimit();
  return limit.getLimitFromDatabase(resource)
      .then(async (response) => {
        if (typeof (response) === 'string') {
          const resource = 'statuses/retweet';
          const {resources} = await limit.getLimitFromTwitter('statuses');
          const {
            limit: apiLimit,
            reset,
          } = resources.statuses['/statuses/retweets/:id'];

          await limit.setLimit(resource,
              apiLimit,
              reset * 1000);
        } else {
          if (response.limit < 1) {
            if (Date.now() > response.next_reset) {
              const {resources} = await limit.getLimitFromTwitter('statuses');
              const {
                limit: apiLimit,
                reset,
              } = resources.statuses['/statuses/retweets/:id'];

              await limit.setLimit(resource,
                  apiLimit,
                  reset * 1000);
            }
            response.nextAction = 'enqueue';
          } else {
            response.nextAction = 'retweet';
          }
        }
        return response;
      })
      .catch(async (error) => {
        const message = `Error on handle with rate limit.
          Reason: ${error.response.data}.
          Stack: ${error}`;

        await logger('error', message, new ErrorLog());
      });
}

module.exports = rateLimit;
