const {
  Blocklist,
  ErrorLog,
  AccessLog,
} = require('../models');
const logger = require('../logs/logger');

const regex = /@/gi;

const BlocklistController = {
  block: async (request, response) => {
    try {
      const {user} = request.body;
      const userClean = user.replace(regex, '');
      const blocklist = new Blocklist();

      await blocklist.block(userClean);

      const message = `User @${userClean} blocked successfully`;

      await logger('access', message, new AccessLog());
      return response
          .status(204)
          .json({message});
    } catch (error) {
      console.error(error);
      const message = `Error on block user.
      Reason: ${error}`;
      await logger('error', message, new ErrorLog());
      return response
          .status(500)
          .json({message});
    }
  },
  unblock: async (request, response) => {
    try {
      const {user} = request.body;
      const userClean = user.replace(regex, '');
      const blocklist = new Blocklist();

      await blocklist.unblock(userClean);

      const message = `User @${userClean} unblocked successfully`;

      logger('access', message, new AccessLog());
      return response
          .status(202)
          .json({message});
    } catch (error) {
      const message = `Error on unblock user.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());
      return response
          .status(500)
          .json({message});
    }
  },
};

module.exports = BlocklistController;
