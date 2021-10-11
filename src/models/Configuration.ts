import BaseModel from './Base';
import ErrorLog from './ErrorLog';
import AccessLog from './AccessLog';
import logger from '../logs/logger';

import ConfigurationModel from '../interfaces/typeDefinitions/ConfigurationModel';

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
   * @param key - the key of the configuration
   * @return A string with configurated value. If any configuration were registered, so it returns undefined.
   * @memberof Configuration
   */
  async getConfig(key: string): Promise<string | undefined> {
    try {
      const config: ConfigurationModel = await this._connection
        .where('key', key)
        .select('*')
        .first();

      if (config) {
        return config.value;
      }
      return undefined;
    } catch (error: any) {
      const message = `Error from Configuration class, method getConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Get the configuration of the bot
   * @param key - the key of the configuration
   * @param value - the value of the configuration
   * @memberof Configuration
   */
  async setConfig(key: string, value: string): Promise<void> {
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
    } catch (error: any) {
      const message = `Error from Configuration class, method setConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Create a new configuration of the bot
   * @param key - the key of the configuration
   * @param value - the value of the configuration
   * @memberof Configuration
   */
  async createConfig(key: string, value: string): Promise<void> {
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
    } catch (error: any) {
      const message = `Error from Configuration class, method createdConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
  /**
   * Delete a configuration of the bot
   * @param key - the key of the configuration
   * @memberof Configuration
   */
  async deleteConfig(key: string): Promise<void> {
    try {
      await this._connection
        .where('key', key)
        .delete();

      const message = `Config ${key} successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from Configuration class, method createdConfig.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

export default Configuration;
