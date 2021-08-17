// @ts-check
'use strict';

const BaseModel = require('./Base');
const ErrorLog = require('./ErrorLog');
const AccessLog = require('./AccessLog');
const logger = require('../logs/logger');

/**
 * Handle with app configurations
 * tweets retweet by the bot.
 * @class Configuration
 * @extends BaseModel
 */
class Configuration extends BaseModel {
  /**
   * On instantiate, pass to the construtor of the base class
   * the name of the table.
   */
  constructor() {
    super('configuration');
  }

  /**
   * Get the configuration of the bot
   * @param {string} key - the key of the configuration
   * @return {Promise<any>}
   * @memberof Configuration
   */
  async getConfig(key) {
    try {
      const config = await this._connection
          .where('key', key)
          .select('*');

      if (config) {
        return config.value;
      }
      return null;
    } catch (error) {
      const message = `Error from Configuration class, method getConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Get the configuration of the bot
   * @param {string} key - the key of the configuration
   * @param {string} value - the value of the configuration
   * @memberof Configuration
   */
  async setConfig(key, value) {
    try {
      const data = {
        value,
        updatedAt: this.dateTime,
      };
      await this._connection
          .where('key', key)
          .update(data);

      const message = `Config ${key} updated with value ${value}.`;
      logger('access', message, new AccessLog());
    } catch (error) {
      const message = `Error from Configuration class, method setConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Create a new configuration of the bot
   * @param {string} key - the key of the configuration
   * @param {string} value - the value of the configuration
   * @memberof Configuration
   */
  async createConfig(key, value) {
    try {
      const data = {
        key,
        value,
        createdAt: this.dateTime,
        updatedAt: this.dateTime,
      };
      await this._connection
          .insert(data);

      const message = `Config ${key} created with value ${value}.`;
      logger('access', message, new AccessLog());
    } catch (error) {
      const message = `Error from Configuration class, method createdConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
  /**
   * Delete a configuration of the bot
   * @param {string} key - the key of the configuration
   * @memberof Configuration
   */
  async deleteConfig(key) {
    try {
      await this._connection
          .where('key', key)
          .delete();

      const message = `Config ${key} successfully.`;
      logger('access', message, new AccessLog());
    } catch (error) {
      const message = `Error from Configuration class, method createdConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

module.exports = Configuration;
