import models from '../models';
import logger from '../../services/logs/logger';

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
      logger.error(`${error.message} at ConfigurationService.getConfig.catch`)
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
      logger.info(`${message} at ConfigurationService.setConfig.try`)

    } catch (error: any) {
      logger.error(`${error.message} at ConfigurationService.setConfig.catch`);
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

      logger.info(`${message} at ConfigurationService.createConfig.try`);

    } catch (error: any) {
      logger.error(`${error.message} at ConfigurationService.createConfig.catch`);
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
      logger.info(`${message} at ConfigurationService.deleteConfig.try`);

    } catch (error: any) {
      logger.error(`${error.message} at ConfigurationService.deleteConfig.catch`);
    }
  }
}

export default ConfigurationRepository;
