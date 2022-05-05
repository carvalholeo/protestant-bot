import { Request, Response } from 'express';
import { BlocklistRepository } from '../db/repository';

import logger from '../services/logs/logger';

class BlocklistController {
  async block(request: Request, response: Response) {
    try {
      const { user } = request.body;
      const userClean = user.replaceAll('@', '');
      const blocklist = new BlocklistRepository();

      await blocklist.block(userClean);

      const message = `User @${userClean} blocked successfully`;
      logger.info(`${message} in BlocklistController.block.try`);

      return response
        .status(204)
        .json({ message });
    } catch (error: any) {
      console.error(error);
      const message = `Error on block user.
      Reason: ${error.message}`;

      logger.error(`${error} in BlocklistController.block.catch`);

      return response
        .status(500)
        .json({ message });
    }
  }

  async unblock(request: Request, response: Response) {
    try {
      const { user } = request.body;
      const userClean = user.replaceAll('@', '');
      const blocklist = new BlocklistRepository();

      await blocklist.unblock(userClean);

      const message = `User @${userClean} unblocked successfully`;
      logger.info(`${message} in BlocklistController.unblock.try`);

      return response
        .status(202)
        .json({ message });
    } catch (error: any) {
      const message = `Error on unblock user.
      Reason: ${error.message}`;

      logger.error(`${error} in BlocklistController.unblock.catch`);

      return response
        .status(500)
        .json({ message });
    }
  }
}

export default new BlocklistController();
