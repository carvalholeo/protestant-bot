
import {Request, Response} from 'express';

import {RetweetLogRepository} from '../db/repository';
import client from '../services/api/client';
import logger from '../logs/logger';
import LogDatabase from '../interfaces/typeDefinitions/LogDatabase';

const TweetController = {
  listRetweets: async (request: Request, response: Response) => {
    try {
      const {page = 1} = request.query;

      const retweetLog = new RetweetLogRepository();
      const list = await retweetLog.getAllRetweets(Number(page));
      const retweetsTotal = await retweetLog.countRetweets() ?? 1;
      const totalPages = retweetsTotal / 100;

      const message = `List of all retweets sent to client.`;
      const logObject: LogDatabase = {
        emmiter: 'RetweetController.listRetweets.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);

      return response.status(200)
          .json({
            current_page: page,
            total_of_pages: totalPages,
            result: list,
          });
    } catch (error: any) {
      const message = `There was an error on try list retweets.
      Reason: ${error.message}`;

      const logObject: LogDatabase = {
        emmiter: 'RetweetController.listRetweets.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);

      return response.status(500)
          .json({message});
    }
  },

  undoRetweets: async (request: Request, response: Response) => {
    try {
      const {tweetId} = request.params;
      const {comment} = request.body;

      await client.post(`statuses/unretweet/${tweetId}`, {});

      const retweetLog = new RetweetLogRepository();
      await retweetLog.undoRetweet(tweetId, comment);

      const message = `Retweet ${tweetId} was undone.
      Reason: ${comment}`;

      const logObject: LogDatabase = {
        emmiter: 'RetweetController.undoRetweets.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);

      return response.status(204)
          .json({message: message});
    } catch (error:any) {
      const message = `There was an error on trying undo retweet.
      Reason: ${error.message}`;

      const logObject: LogDatabase = {
        emmiter: 'RetweetController.undoRetweets.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);

      return response.status(500)
          .json({message: message});
    }
  },
};

export default TweetController;
