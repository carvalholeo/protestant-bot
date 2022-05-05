import { Request, Response } from 'express';
import { BlocklistRepository } from '../db/repository';

import logger from '../services/logs/logger';

class BlocklistController {
  async block(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    try {
      const { user } = request.body;
      const userClean = user.replaceAll('@', '');
      const blocklist = new BlocklistRepository();

      await blocklist.block(userClean);

      const message = `User @${userClean} blocked successfully`;
      logger.info(`${message} in BlocklistController.block.try. ID ${uniqueIdentifier}`);

      return response
        .status(204)
        .json({ message });
    } catch (error: any) {
      console.error(error);
      const message = `Error on block user.
      Reason: ${error.message}`;

      logger.error(`${error} in BlocklistController.block.catch. ID ${uniqueIdentifier}`);

      return response
        .status(500)
        .json({ message });
    }
  }

  async unblock(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    try {
      const { user } = request.body;
      const userClean = user.replaceAll('@', '');
      const blocklist = new BlocklistRepository();

      await blocklist.unblock(userClean);

      const message = `User @${userClean} unblocked successfully`;
      logger.info(`${message} in BlocklistController.unblock.try. ID ${uniqueIdentifier}`);

      return response
        .status(202)
        .json({ message });
    } catch (error: any) {
      const message = `Error on unblock user.
      Reason: ${error.message}`;

      logger.error(`${error} in BlocklistController.unblock.catch. ID ${uniqueIdentifier}`);

      return response
        .status(500)
        .json({ message });
    }
  }
}

export default new BlocklistController();
