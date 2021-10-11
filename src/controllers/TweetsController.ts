
import { Request, Response } from 'express';
import models from '../models';
const {
  RetweetLog, ErrorLog, AccessLog,
} = models;
import client from '../services/api/client';
import logger from '../logs/logger';

const RetweetController = {
  listRetweets: async (request: Request, response: Response) => {
    try {
      const { page = 1 } = request.query;

      const retweetLog = new RetweetLog();
      const list = await retweetLog.getAllRetweets(Number(page));
      const retweetsTotal = await retweetLog.countRetweets() ?? 1;
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
        .json({ message });
    }
  },

  undoRetweets: async (request: Request, response: Response) => {
    try {
      const { tweetId } = request.params;
      const { comment } = request.body;

      await client.post(`statuses/unretweet/${tweetId}`, {});

      const retweetLog = new RetweetLog();
      await retweetLog.undoRetweet(tweetId, comment);

      const message = `Retweet ${tweetId} was undone.
      Reason: ${comment}`;
      logger('access', message, new AccessLog());

      return response.status(204)
        .json({ message: message });
    } catch (error) {
      const message = `There was an error on trying undo retweet.
      Reason: ${error}`;

      return response.status(500)
        .json({ message: message });
    }
  },
};

export default RetweetController;