import models from '../models';
import logger from '../../logs/logger';

import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

/**
 * Handle with app configurations
 * tweets retweet by the bot.
 * @class Configuration
 */
class ConfigurationRepository {
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
      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.getConfig.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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

      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.setConfig.catch',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.setConfig.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.createConfig.catch',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.createConfig.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.deleteConfig.catch',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'ConfigurationService.deleteConfig.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }
}

export default ConfigurationRepository;
