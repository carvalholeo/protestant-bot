import {Request, Response} from 'express';
import { BlocklistRepository } from '../db/repository';

import logger from '../logs/logger';

import LogDatabase from '../interfaces/typeDefinitions/LogDatabase';

const BlocklistController = {
  block: async (request: Request, response: Response) => {
    try {
      const {user} = request.body;
      const userClean = user.replaceAll('@', '');
      const blocklist = new BlocklistRepository();

      await blocklist.block(userClean);

      const message = `User @${userClean} blocked successfully`;
      const logObject: LogDatabase = {
        emmiter: 'BlocklistController.block.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
      return response
          .status(204)
          .json({message});
    } catch (error:any) {
      console.error(error);
      const message = `Error on block user.
      Reason: ${error.message}`;

      const logObject: LogDatabase = {
        emmiter: 'BlocklistController.block.catch',
        level: 'error',
        message: error.message,
      };
      await logger(logObject);

      return response
          .status(500)
          .json({message});
    }
  },
  unblock: async (request: Request, response: Response) => {
    try {
      const {user} = request.body;
      const userClean = user.replaceAll('@', '');
      const blocklist = new BlocklistRepository();

      await blocklist.unblock(userClean);

      const message = `User @${userClean} unblocked successfully`;

      const logObject: LogDatabase = {
        emmiter: 'BlocklistController.unblock.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
      return response
          .status(202)
          .json({message});
    } catch (error: any) {
      const message = `Error on unblock user.
      Reason: ${error.message}`;

      const logObject: LogDatabase = {
        emmiter: 'BlocklistController.unblock.catch',
        level: 'error',
        message: error.message,
      };
      await logger(logObject);

      return response
          .status(500)
          .json({message});
    }
  },
};

export default BlocklistController;
