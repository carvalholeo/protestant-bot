import models from '../../db/models';
import logger from '../../logs/logger';

import UserInterface from '../../interfaces/typeDefinitions/UserInterface';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

/**
 * Class to handle with Users in database. Used for create, update, block and
 * unblock users on database.
 * @class User
 */
class User {
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

      const logObject: LogDatabase = {
        emmiter: 'UserService.createUser.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.createUser.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'UserService.blockUser.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.blockUser.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'UserService.unblockUser.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.unblockUser.catch',
        level: 'info',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'UserService.changeMyPassword.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.changeMyPassword.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'UserService.changeThirdPartyPassword.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.changeThirdPartyPassword.catch',
        level: 'info',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'UserService.activateMultifactorAuth.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.activateMultifactorAuth.catch',
        level: 'info',
        message: error.message,
      };

      await logger(logObject);
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
      const logObject: LogDatabase = {
        emmiter: 'UserService.getUser.try',
        level: 'info',
        message: message,
      };

      await logger(logObject);

      return information;
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'UserService.getUser.catch',
        level: 'info',
        message: error.message,
      };

      await logger(logObject);
    }
  }
}

export default User;
