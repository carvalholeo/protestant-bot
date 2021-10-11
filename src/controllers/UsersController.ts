
import { hashSync, compareSync } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import models from '../models';
const {
  AccessLog, ErrorLog, User,
} = models;
import logger from '../logs/logger';

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 12;
const JWT_SECRET = process.env.JWT_SECRET || '';

const UsersController = {
  create: async (request: Request, response: Response) => {
    try {
      const { username, password } = request.body;
      const passwordHash = hashSync(password, SALT_ROUNDS);

      const user = new User(username);
      user.createUser(passwordHash);

      const message = 'User created successfully from UsersController';
      logger('access', message, new AccessLog());

      return response.status(201)
        .json({ message });
    } catch (error) {
      const message = `There was an error on create user.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
        .json({ message });
    }
  },

  login: async (request: Request, response: Response) => {
    try {
      const { username, password } = request.body;

      const userDb = new User(username);
      const user = await userDb.getUser();

      if (!user) {
        const message = 'User or password incorrect. Try again.';
        logger('error', message, new ErrorLog());
        return response.status(401)
          .json({ message });
      }

      const passwordHash = user?.password || '';
      const isActive = user?.is_active;

      if (!isActive) {
        const message = 'User is not active';
        logger('error', message, new ErrorLog());
        return response.status(401)
          .json({ message });
      }

      if (!compareSync(password, passwordHash)) {
        const message = 'User or password incorrect. Try again.';
        logger('error', message, new ErrorLog());

        return response.status(401)
          .json({ message });
      }

      delete user.password;

      const message = 'User login successfully from UsersController';
      logger('access', message, new AccessLog());
      const token = sign({ user }, JWT_SECRET, {
        expiresIn: '6h',
      });

      user.token = token;

      return response.status(201)
        .json({ user });
    } catch (error) {
      const message = `There was an error to try login.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
        .json({ message });
    }
  },

  logout: (request: Request, response: Response) => {
    try {
      const { authorization } = request.headers;

      // @ts-ignore
      const hasTokenCache = request.map.has(authorization);

      if (!hasTokenCache) {
        const message = 'User is not logged in';
        logger('error', message, new ErrorLog());

        return response.status(401)
          .json({ message });
      }

      // @ts-ignore
      request.map.set(authorization, null);

      const message = 'User logout successfully from UsersController';
      logger('access', message, new AccessLog());

      return response.status(204)
        .json({ message });
    } catch (error) {
      const message = `There was an error to try login.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
        .json({ message });
    }
  },
};

export default UsersController;