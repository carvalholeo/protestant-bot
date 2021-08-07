// @ts-check

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AccessLog,
  ErrorLog,
  User,
} = require('../models');
const logger = require('../logs/logger');

const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) ?? 12;
const JWT_SECRET = process.env.JWT_SECRET;

const UsersController = {
  create: async (request, response) => {
    try {
      const {username, password} = request.body;
      const passwordHash = bcrypt.hashSync(password, SALT_ROUNDS);

      const user = new User(username);
      user.createUser(passwordHash);

      const message = 'User created successfully from UsersController';
      logger('access', message, new AccessLog());

      return response.status(201)
          .json({message});
    } catch (error) {
      const message = `There was an error on create user.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
          .json({message});
    }
  },

  login: async (request, response) => {
    try {
      const {username, password} = request.body;

      const userDb = new User(username);
      const user = await userDb.getUser();
      // @ts-ignore
      const passwordHash = user.password;
      // @ts-ignore
      const {isActive} = user;

      if (!isActive) {
        const message = 'User is not active';
        logger('error', message, new ErrorLog());
        return response.status(401)
            .json({message});
      }

      if (!bcrypt.compareSync(password, passwordHash)) {
        const message = 'User login failed from UsersController';
        logger('error', message, new ErrorLog());

        return response.status(401)
            .json({message});
      }

      // @ts-ignore
      delete user.password;
      const message = 'User login successfully from UsersController';
      logger('access', message, new AccessLog());

      const token = jwt.sign({user}, JWT_SECRET, {
        expiresIn: '6h',
      });

      // @ts-ignore
      user.token = token;

      request.map.set(token, user);

      return response.status(201)
          .json({user});
    } catch (error) {
      const message = `There was an error to try login.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
          .json({message});
    }
  },

  logout: (request, response) => {
    try {
      const {authorization} = request.headers;

      const hasTokenCache = request.map.has(authorization);

      if (!hasTokenCache) {
        const message = 'User is not logged in';
        logger('error', message, new ErrorLog());

        return response.status(401)
            .json({message});
      }

      request.map.set(authorization, null);

      const message = 'User logout successfully from UsersController';
      logger('access', message, new AccessLog());

      return response.status(204)
          .json({message});
    } catch (error) {
      const message = `There was an error to try login.
      Reason: ${error}`;
      logger('error', message, new ErrorLog());

      return response.status(500)
          .json({message});
    }
  },
};

module.exports = UsersController;
