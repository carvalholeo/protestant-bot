
import { Request, Response } from 'express';

import { RetweetLogRepository } from '../db/repository';
import client from '../services/api/client';
import logger from '../utils/logs/logger';

class TweetsController {
  async listRetweets(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    try {
      const { page = 1 } = request.query;

      const retweetLog = new RetweetLogRepository();
      const list = await retweetLog.getAllRetweets(Number(page));
      const retweetsTotal = await retweetLog.countRetweets() ?? 1;
      const totalPages = retweetsTotal / 100;

      const message = `List of all retweets sent to client.`;
      logger.info(`${message} at RetweetController.listRetweets.try. ID ${uniqueIdentifier}`);

      return response.status(200)
        .json({
          current_page: page,
          total_of_pages: totalPages,
          result: list,
        });
    } catch (error: any) {
      const message = `There was an error on try list retweets.
      Reason: ${error.message}`;
      logger.error(`${message} at RetweetController.listRetweets.catch. ID ${uniqueIdentifier}`);

      return response.status(500)
        .json({ message });
    }
  }

  async undoRetweets(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    try {
      const { tweetId } = request.params;
      const { comment } = request.body;

      await client.post(`statuses/unretweet/${tweetId}`, {});

      const retweetLog = new RetweetLogRepository();
      await retweetLog.undoRetweet(tweetId, comment);

      const message = `Retweet ${tweetId} was undone.
      Reason: ${comment}`;
      logger.info(`${message} from RetweetController.undoRetweets.try. ID ${uniqueIdentifier}`);

      return response.status(204)
        .json({ message: message });
    } catch (error: any) {
      const message = `There was an error on trying undo retweet.
      Reason: ${error.message}`;
      logger.error(`${message} at RetweetController.undoRetweets.catch. ID ${uniqueIdentifier}`);

      return response.status(500)
        .json({ message: message });
    }
  }
}

export default new TweetsController();
