// @ts-check

const {
  RetweetLog,
  ErrorLog,
  AccessLog,
} = require('../models');
const client = require('../services/api/client');
const logger = require('../logs/logger');

const RetweetController = {
  listRetweets: async (request, response) => {
    try {
      const {page = 1} = request.query;

      const retweetLog = new RetweetLog();
      const list = await retweetLog.getAllRetweets(page);
      const retweetsTotal = await retweetLog.countRetweets();
      const totalPages = retweetsTotal / 100;

      const message = `List of all retweets sent to client.`;
      logger('access', message, new AccessLog());

      return response.status(200)
          .json({
            current_page: page,
            total_of_pages: totalPages,
            result: list,
          });
    } catch (error) {
      const message = `There was an error on try list retweets.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
          .json({message});
    }
  },

  undoRetweets: async (request, response) => {
    try {
      const {tweetId} = request.params;
      const {comment} = request.body;

      await client.post(`statuses/unretweet/${tweetId}`);

      const retweetLog = new RetweetLog();
      await retweetLog.undoRetweet(tweetId, comment);

      const message = `Retweet ${tweetId} was undone.
      Reason: ${comment}`;
      logger('access', message, new AccessLog());

      return response.status(204)
          .json({message: message});
    } catch (error) {
      const message = `Thre qas an error on trying undo retweet.
      Reason: ${error}`;

      return response.status(500)
          .json({message: message});
    }
  },
};

module.exports = RetweetController;
