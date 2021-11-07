import ErrorLog from './ErrorLog';
import logger from '../../logs/logger';
import models from '../../db/models';

import BlocklistInterface from '../../interfaces/typeDefinitions/BlocklistInterface';
/**
 * Handle with the users block list, that don't want to have their
 * tweets retweet by the bot.
 * @class Blocklist
 */
class Blocklist {
  /**
   * Method to block the user and prevent retweet them posts.
   * @param {string} username Screen name (@) of the user
   * @param {boolean} blockedByAdmin Flag to indicate if this user were
   * blocked by an administrator of the system.
   * @param {string} comment Comment from administrator on block some user.
   */
  async block(username: string,
      blockedByAdmin: boolean = false,
      comment: string = ''): Promise<void> {
    try {
      if (typeof (username) === 'undefined') {
        throw new ReferenceError(`You must to provide the username to be
        blocked.`);
      }
      const data: BlocklistInterface = {
        screen_name: username,
        is_blocked_now: true,
        blocked_by_admin: blockedByAdmin,
        comment: comment,
      };

      const [user, created] = await models.Blocklist.findOrCreate({
        where: {screen_name: username},
        defaults: {
          ...data,
        },
      });

      if (created) {
        return;
      }

      user.is_blocked_now = data.is_blocked_now;
      user.blocked_by_admin = data.blocked_by_admin;
      user.comment = data.comment;

      await user.save();
    } catch (error: any) {
      const message = `Error from Blocklist class, method block.
      Message catched: '${error}'.`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }

  /**
   * Method to retrieve the list of users that asked for block they
   * and are now enforced.
   * @return {Promise<BlocklistInterface[] | undefined>}
   * Return all users currently blocked in the system.
   */
  async getAllActiveBlocks(): Promise<BlocklistInterface[] | undefined> {
    try {
      return await models.Blocklist.findAll({where: {
        is_blocked_now: true,
      }}).toJSON();
    } catch (error: any) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method getAllActiveBlocks.
      Message catched: ${errorParsed}.`;
      await logger('error', message, new ErrorLog());
      return JSON.parse(JSON.stringify({message: errorParsed}));
    }
  }

  /**
   * Method to retrieve the list of users that asked for block they
   * all the time.
   * @return {Promise<BlocklistInterface[] | undefined>} Return all users
   * blocked in the system all the time.
   */
  async getAllBlocks(): Promise<BlocklistInterface[] | undefined> {
    try {
      return await models.Blocklist.findAll().toJSON();
    } catch (error: any) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method getAllBlocks.
      Message catched: ${errorParsed}.`;
      await logger('error', message, new ErrorLog());
      return JSON.parse(JSON.stringify({message: errorParsed}));
    }
  }

  /**
   * Method to retrieve one user from the list of blocked users.
   * @param {string} username Screen name (@) to be retrieved from DB.
   * @return {Promise<BlocklistInterface[] | undefined>} Return a JSON within an
   * response from database or an error.
   */
  async getOneBlock(username: string):
  Promise<BlocklistInterface[] | undefined> {
    try {
      return await models.Blocklist.findOne({where: {
        is_blocked_now: true,
        screen_name: username,
      }});
    } catch (error: any) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method getOneBlock.
      Message catched: ${errorParsed}.`;
      await logger('error', message, new ErrorLog());
      return JSON.parse(JSON.stringify({message: errorParsed}));
    }
  }

  /**
   * Method to unblock users and be able again to retweet their posts.
   * @param {string} username Screen name (@) to be unblocked
   */
  async unblock(username: string): Promise<void> {
    try {
      if (typeof (username) === 'undefined') {
        throw new ReferenceError(`You must to provide the username to be
        blocked.`);
      }
      const data = {
        is_blocked_now: false,
      };
      const user = await models.Blocklist.findOne({where: {
        screen_name: username,
        blocked_by_admin: false,
      }});

      if (user === null) {
        return;
      }

      user.is_blocked_now = data.is_blocked_now;
      await user.save();
    } catch (error: any) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method unblock.
      Message catched: '${errorParsed}'.`;
      await logger('error', message, new ErrorLog());
    }
  }
}

export default Blocklist;
