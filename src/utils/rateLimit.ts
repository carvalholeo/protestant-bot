import RateLimit from '../services/Twitter/RateLimit';
import { ErrorLog } from '../models';
import logger from '../logs/logger';

import RateLimitInterface from '../interfaces/typeDefinitions/RateLimitInterface';

/**
 * This function make a query to database to get rate limit on
 * retweet endpoint.
 * @return Returns a response about rate limit on database.
 */
async function rateLimit(): Promise<string | void | RateLimitInterface> {
  const resource = 'statuses/retweet';
  const limit = new RateLimit();
  const example: RateLimitInterface = {
    next_reset: Date.now(),
    limit: 0,
    resource: ''
  }
  try {
    const response = await limit.getLimitFromDatabase(resource) || example;
    if (typeof (response) === 'string') {
      // @ts-ignore @ts-nocheck
      const { resources } = await limit.getLimitFromTwitter('statuses');
      const {
        limit: apiLimit, reset, } = resources.statuses['/statuses/retweets/:id'];

      await limit.setLimit(resource,
        apiLimit,
        reset * 1000);
    } else {
      if (response.limit < 1) {
        // @ts-ignore @ts-nocheck
        if (Date.now() > response.next_reset ) {
          // @ts-ignore @ts-nocheck
          const { resources: resources_1 } = await limit.getLimitFromTwitter('statuses');
          const { limit: apiLimit_1, reset: reset_1, } = resources_1.statuses['/statuses/retweets/:id'];

          await limit.setLimit(resource, apiLimit_1, reset_1 * 1000);
        }
        // @ts-nocheck
        response.nextAction = 'enqueue';
      } else {
        // @ts-nocheck
        response.nextAction = 'retweet';
      }
    }
    return await response;
  } catch (error: any) {
    const message = `Error on handle with rate limit.
          Reason: ${error.response.data}.
          Stack: ${error}`;

    await logger('error', message, new ErrorLog());
  }
}

export default rateLimit;
