import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { UserRepository } from '../db/repository';
import logger from '../utils/logs/logger';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 12;
const JWT_SECRET = process.env.JWT_SECRET ?? '';

class UsersController {
  async create(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    try {
      const { username, password } = request.body;
      const passwordHash = hashSync(password, SALT_ROUNDS);

      const user = new UserRepository(username);
      await user.createUser(passwordHash);

      const message = 'User created successfully from UsersController';
      logger.info(
        `${message} at UsersController.create.try. ID ${uniqueIdentifier}`
      );

      return response.status(201).json({ message });
    } catch (error: any) {
      const message = `There was an error on create user.
      Reason: ${error.message}`;
      logger.error(
        `${message} at UsersController.create.catch. ID ${uniqueIdentifier}`
      );

      return response.status(500).json({ message });
    }
  }

  async login(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    try {
      const { username, password } = request.body;

      const userDb = new UserRepository(username);
      const user = await userDb.getUser();

      if (!user) {
        const message = 'User or password incorrect. Try again.';
        logger.error(
          `${message} at UsersController.login.try. ID ${uniqueIdentifier}`
        );

        return response.status(401).json({ message });
      }

      const passwordHash = user?.password || '';
      const isActive = user?.is_active;

      if (!isActive) {
        const message = 'User is not active';
        logger.error(
          `${message} at UsersController.login.try. ID ${uniqueIdentifier}`
        );

        return response.status(401).json({ message });
      }

      if (!compareSync(password, passwordHash)) {
        const message = 'User or password incorrect. Try again.';
        logger.error(
          `${message} at UsersController.login.try. ID ${uniqueIdentifier}`
        );

        return response.status(401).json({ message });
      }

      delete user.password;

      const message = 'User login successfully from UsersController';
      logger.info(
        `${message} at UsersController.login.try. ID ${uniqueIdentifier}`
      );

      const token = sign({ user }, JWT_SECRET, {
        expiresIn: '6h',
      });

      user.token = token;

      return response.status(201).json({ user });
    } catch (error: any) {
      const message = `There was an error to try login.
      Reason: ${error.message}`;

      logger.error(
        `${message} at UsersController.login.catch. ID ${uniqueIdentifier}`
      );

      return response.status(500).json({ message });
    }
  }

  logout(request: Request, response: Response) {
    const uniqueIdentifier = request.app.get('uniqueIdentifier');
    // TODO: make a denylist for JWT emmited.
    try {
      const { authorization } = request.headers;

      // @ts-ignore
      const hasTokenCache = request.map.has(authorization);

      if (!hasTokenCache) {
        const message = 'User is not logged in';
        logger.error(
          `${message} at UsersController.logout.try. ID ${uniqueIdentifier}`
        );

        return response.status(401).json({ message });
      }

      // @ts-ignore
      request.map.set(authorization, null);

      const message = 'User logout successfully from UsersController';
      logger.info(
        `${message} at UsersController.logout.try. ID ${uniqueIdentifier}`
      );

      return response.status(204).json({ message });
    } catch (error: any) {
      const message = `There was an error to try login.
      Reason: ${error.message}`;
      logger.error(
        `${message} at UsersController.logout.catch. ID ${uniqueIdentifier}`
      );

      return response.status(500).json({ message });
    }
  }
}

export default new UsersController();
