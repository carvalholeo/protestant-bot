import models from '../../db/models';
import ErrorLog from './ErrorLog';
import AccessLog from './AccessLog';
import logger from '../../logs/logger';

/**
 * Handle with app configurations
 * tweets retweet by the bot.
 * @class Configuration
 */
class Configuration {
  /**
   * Get the configuration of the bot
   * @param {string} key - the key of the configuration
   * @return {Promise<string | undefined>} A string with configurated value.
   * If any configuration were registered, so it returns undefined.
   */
  async getConfig(key: string): Promise<string | undefined> {
    try {
      const config = await models.Configurations.findOne({
        where: {
          key,
        },
      });

      if (config === null) {
        return undefined;
      }
      return config.value;
    } catch (error: any) {
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
   */
  async setConfig(key: string, value: string): Promise<void> {
    try {
      const data = {
        value,
      };
      await models.Configurations.update(data, {
        where: {
          key,
        },
      });

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
   * @param {string} key - the key of the configuration
   * @param {string} value - the value of the configuration
   */
  async createConfig(key: string, value: string): Promise<void> {
    try {
      const data = {
        key,
        value,
      };

      await models.Configurations.create(data);

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
   * @param {string} key - the key of the configuration
   */
  async deleteConfig(key: string): Promise<void> {
    try {
      await models.Configurations.delete({
        where: {
          key,
        },
      });

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
