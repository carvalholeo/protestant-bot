import BaseModel from './Base';

import ErrorLog from './ErrorLog';
import AccessLog from './AccessLog';
import logger from '../../logs/logger';

import UserInterface from '../../interfaces/typeDefinitions/UserInterface';

/**
 * Class to handle with Users in database. Used for create, update, block and
 * unblock users on database.
 * @class User
 * @extends BaseModel
 */
class User extends BaseModel {
  private username = '';
  /**
   * Pass to the base class the name of table to be used. Also, receive
   * an user, to be used along all the class.
   * @param {string} username Username to be created on the system.
   */
  constructor(username: string) {
    super('users');
    this.username = username;
  }

  /**
   * Class to create a new user on database.
   * @param password Password to be linked with the user.
   */
  async createUser(password: string): Promise<void> {
    try {
      const data: UserInterface ={
        username: this.username,
        password: password,
        is_active: true,
        created_at: this.dateTime,
        updated_at: this.dateTime,
      };

      const [newUser] = await this._connection
          .insert(data);

      if (!(newUser >= 1)) {
        throw new RangeError(`Something is broken and more than one user were
        created.Check this and fix it.`);
      }

      const message = `User ${this.username} created successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from User class, method createUser.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
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
        updated_at: this.dateTime,
      };

      await this._connection
          .where({username: this.username})
          .update(data);

      const message = `User ${this.username} blocked successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from User class, method blockUser.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
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
        updated_at: this.dateTime,
      };

      await this._connection
          .where({username: this.username})
          .update(data);

      const message = `User ${this.username} unblock successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from User class, method unblockUser.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to user change their own password.
   * @param password New password to be updated.
   */
  async changeMyPassword(password: string): Promise<void> {
    try {
      const data = {
        password: password,
        updated_at: this.dateTime,
      };

      await this._connection
          .where({username: this.username})
          .update(data);

      const message = `User ${this.username} have their password updated
      successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from User class, method changeMyPassword.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to user change password of another user.
   * @param username User to have their password updated.
   * @param password New password to be updated.
   */
  async changeThirdPartyPassword(username: string, password: string): Promise<void> {
    try {
      const data = {
        password: password,
        updated_at: this.dateTime,
      };

      await this._connection
          .where({username: username})
          .update(data);

      const message = `User ${username} have their password updated
      successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from User class, method changeThirdPartyPassword.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Method to register Two Factor Authentication for user.
   * @param secret String to be used as seed on the 2FA lib.
   */
  async activateMultifactorAuth(secret: string): Promise<void> {
    try {
      const data = {
        has_mfa: true,
        secret_mfa: secret,
        updated_at: this.dateTime,
      };

      await this._connection
          .where({username: this.username})
          .update(data);

      const message = `User ${this.username} have created Two factor auth
      successfully.`;
      logger('access', message, new AccessLog());
    } catch (error: any) {
      const message = `Error from User class, method activateMultifactorAuth.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }

  /**
   * Retrieve user information of active user.
   * @return Return an only information data.
   */
  async getUser(): Promise<UserInterface | undefined> {
    try {
      const information = await this._connection
          .where({username: this.username})
          .andWhereNot({is_active: true})
          .select('*')
          .first();

      const message = `User ${this.username} retrieved successfully.`;
      logger('access', message, new AccessLog());

      return information;
    } catch (error: any) {
      const message = `Error from User class, method getUserInformations.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

export default User;
