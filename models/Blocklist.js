const BaseModel = require('./Base');
const {ErrorLog} = require('./index');
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
   */
  async block(username) {
    try {
      if (typeof(username) === 'undefined') {
        throw new ReferenceError(`You must to provide the username to be
        blocked.`);
      }
      const data = {
        screen_name: username,
        is_blocked_now: true,
        created_at: this.dateTime,
        updated_at: this.dateTime,
      };

      cosnt [blocked] = await this._connection
          .returning('id')
          .onConflict('is_blocked_now')
          .insert(data);

      if (!blocked > 0) {
        throw new Error(`There was an erro on trying to block this user.
        Probally, this @ already it's blocked.`);
      }
    } catch (error) {
      const message = `Error from Blocklist class, method block.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }

  /**
   * Method to retrieve the list of users that asked for block they
   * and are now enforced.
   */
  async getAllAcitveBlocks() {
    try {
      const blocklist = await this._connection
          .where({is_blocked_now: true})
          .select('*');

      return blocklist;
    } catch (error) {
      const message = `Error from Blocklist class, method getAllAcitveBlocks.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }

  /**
   * Method to retrieve the list of users that asked for block they
   * all the time.
   */
  async getAllBlocks() {
    try {
      const blocklist = await this._connection
          .select('*');

      return blocklist;
    } catch (error) {
      const message = `Error from Blocklist class, method getAllBlocks.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }

  /**
   * Method to unblock users and be able again to retweet their posts.
   * @param {string} username Screen name (@) to be unblocked
   */
  async unblock(username) {
    try {
      if (typeof(username) === 'undefined') {
        throw new ReferenceError(`You must to provide the username to be
        blocked.`);
      }
      const data = {
        is_blocked_now: false,
        updated_at: this.dateTime,
      };

      cosnt [unblocked] = await this._connection
          .where({screen_name: username})
          .update(data);

      if (unblocked !== 1) {
        throw new RangeError(`Something is broken and anyone or
        more than one registers were update. Please check this.`);
      }
    } catch (error) {
      const message = `Error from Blocklist class, method unblock.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      const errorLog = new ErrorLog();
      errorLog.create(message);
    }
  }
}

module.exports = Blocklist;
