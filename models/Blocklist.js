'use strict';
// @ts-check

const BaseModel = require('./Base');
const ErrorLog = require('./ErrorLog');
const logger = require('../logs/logger');
/**
 * Handle with the users block list, that don't want to have their
 * tweets retweet by the bot.
 * @class Blocklist
 * @extends BaseModel
 */
class Blocklist extends BaseModel {
  /**
   * On instanciate, pass to the construtor of the base class
   * the name of the table.
   */
  constructor() {
    super('blocklist');
  }

  /**
   * Method to block the user and prevent retweet them posts.
   * @param {string} username Screen name (@) of the user
   * @param {boolean} blockedByAdmin Flag to indicate if this user were
   * blocked by an administrator of the system.
   * @param {string} comment Comment from administrator on block some user.
   */
  async block(username, blockedByAdmin = false, comment = null) {
    try {
      if (typeof (username) === 'undefined') {
        throw new ReferenceError(`You must to provide the username to be
        blocked.`);
      }
      const data = {
        screen_name: username,
        is_blocked_now: true,
        blocked_by_admin: blockedByAdmin,
        comment: comment,
        created_at: this.dateTime,
        updated_at: this.dateTime,
      };

      const [blocked] = await this._connection
          .insert(data)
          .onConflict('username')
          .merge({
            comment: data.comment,
            is_blocked_now: data.is_blocked_now,
            updated_at: data.updated_at,
          });

      if (blocked <= 0) {
        throw new Error(`There was an erro on trying to block this user.
        Probally, this @ already it's blocked.`);
      }
    } catch (error) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method block.
      Message catched: '${errorParsed}'.`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }

  /**
   * Method to retrieve the list of users that asked for block they
   * and are now enforced.
   * @return {Promise<JSON | JSON[]>} Return all users currently
   * blocked in the system.
   */
  async getAllActiveBlocks() {
    try {
      return await this._connection
          .where({is_blocked_now: true})
          .select('*');
    } catch (error) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method getAllAcitveBlocks.
      Message catched: ${errorParsed}.`;
      await logger('error', message, new ErrorLog());
      return JSON.parse(JSON.stringify({message: errorParsed}));
    }
  }

  /**
   * Method to retrieve the list of users that asked for block they
   * all the time.
   * @return {Promise<JSON | JSON[]>} Return all users
   * blocked in the system all the time.
   */
  async getAllBlocks() {
    try {
      return await this._connection
          .select('*');
    } catch (error) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method getAllBlocks.
      Message catched: ${errorParsed}.`;
      await logger('error', message, new ErrorLog());
      return JSON.parse(JSON.stringify({message: errorParsed}));
    }
  }

  /**
   * Method to retrieve one user from the list of blocked users.
   * @param {string} username Screen name (@) to be retrivied from DB.
   * @return {Promise<JSON>} Return a JSON within an
   * response from database or an error.
   */
  async getOneBlock(username) {
    try {
      return await this._connection
          .where({
            is_blocked_now: true,
            screen_name: username,
          })
          .select('*');
    } catch (error) {
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
  async unblock(username) {
    try {
      if (typeof (username) === 'undefined') {
        throw new ReferenceError(`You must to provide the username to be
        blocked.`);
      }
      const data = {
        is_blocked_now: false,
        updated_at: this.dateTime,
      };

      await this._connection
          .where({screen_name: username})
          .andWhereNot({blocked_by_admin: true})
          .update(data);
    } catch (error) {
      const errorParsed = JSON.stringify(error);
      const message = `Error from Blocklist class, method unblock.
      Message catched: '${errorParsed}'.`;
      await logger('error', message, new ErrorLog());
    }
  }
}

module.exports = Blocklist;
