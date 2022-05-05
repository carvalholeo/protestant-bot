import models from '../models';
import logger from '../../services/logs/logger';

import UserInterface from '../../interfaces/typeDefinitions/UserInterface';

/**
 * Class to handle with Users in database. Used for create, update, block and
 * unblock users on database.
 * @class User
 */
class UserRepository {
  private username = '';
  /**
   * Pass to the base class the name of table to be used. Also, receive
   * an user, to be used along all the class.
   * @param {string} username Username to be created on the system.
   */
  constructor(username: string) {
    this.username = username;
  }

  /**
   * Class to create a new user on database.
   * @param {string} password Password to be linked with the user.
   */
  async createUser(password: string): Promise<void> {
    try {
      const data: UserInterface ={
        username: this.username,
        password: password,
        is_active: true,
      };

      await models.User.create(data);

      const message = `User ${this.username} created successfully.`;
      logger.info(`${message} at UserService.createUser.try`);
    } catch (error: any) {
      logger.error(`${error.message} at UserService.createUser.catch`);
    }
  }

  /**
   * Method to block some user on the system, prohibiting him/her from access
   * functions on administrative panel.
   */
  async blockUser(): Promise<void> {
    try {
      const data = {
        is_active: false,
      };

      await models.User.update(data, {
        where: {
          username: this.username,
        },
      });

      const message = `User ${this.username} blocked successfully.`;
      logger.info(`${message} at UserService.blockUser.try`);
    } catch (error: any) {
      logger.error(`${error.message} at UserService.block.catch`);
    }
  }

  /**
   * Method to unblock some user on the system, allowing him/her from access
   * functions on administrative panel.
   */
  async unblockUser(): Promise<void> {
    try {
      const data = {
        is_active: true,
      };

      await models.User.update(data, {
        where: {
          username: this.username,
        },
      });

      const message = `User ${this.username} unblock successfully.`;

      logger.info(`${message} at UserService.unblockUser.try`);
    } catch (error: any) {
      logger.error(`${error.message} at UserService.unblockUser.catch`);
    }
  }

  /**
   * Method to user change their own password.
   * @param {string} password New password to be updated.
   */
  async changeMyPassword(password: string): Promise<void> {
    try {
      const data = {
        password: password,
      };

      await models.User.update(data, {
        where: {
          username: this.username,
        },
      });

      const message = `User ${this.username} have their password updated
      successfully.`;
      logger.info(`${message} at UserService.changeMyPassword.try`);
    } catch (error: any) {
      logger.error(`${error.message} at UserService.changeMyPassword.catch`);
    }
  }

  /**
   * Method to user change password of another user.
   * @param {string} username User to have their password updated.
   * @param {string} password New password to be updated.
   */
  async changeThirdPartyPassword(
      username: string,
      password: string): Promise<void> {
    try {
      const data = {
        password: password,
      };

      await models.User.update(data, {
        where: {
          username,
        },
      });

      const message = `User ${username} have their password updated
      successfully.`;
      logger.info(`${message} at UserService.changeThirdPartyPassword.try`);
    } catch (error: any) {
      logger.error(`${error.message} at UserService.changeThirdPartyPassword.catch`);
    }
  }

  /**
   * Method to register Two Factor Authentication for user.
   * @param {string} secret String to be used as seed on the 2FA lib.
   */
  async activateMultifactorAuth(secret: string): Promise<void> {
    try {
      const data = {
        has_mfa: true,
        secret_mfa: secret,
      };

      await models.User.update(data, {
        where: {
          username: this.username,
        },
      });

      const message = `User ${this.username} have created Two factor auth
      successfully.`;
      logger.info(`${message} at UserService.activateMultifactorAuth.try`);
    } catch (error: any) {
      logger.error(`${error.message} at UserService.activateMultifactorAuth.catch`);
    }
  }

  /**
   * Retrieve user information of active user.
   * @return {Promise<UserInterface | undefined>} Return an
   * only information data.
   */
  async getUser(): Promise<UserInterface | undefined> {
    try {
      const information = await models.User.findOne({
        where: {
          username: this.username,
          is_active: true,
        },
      });

      const message = `User ${this.username} retrieved successfully.`;

      logger.info(`${message} at UserService.getUser.try`);

      return information;
    } catch (error: any) {
      logger.error(`${error.message} at UserService.getUser.catch`);
    }
  }
}

export default UserRepository;
