// @ts-check
'use strict';
const {Router} = require('express');

const usersController = require('../controllers/UsersController');

const validatorMiddleware = require('../middlewares/validatorMiddleware');
const verifyLogoutMiddleware = require('../middlewares/verifyLogoutMiddleware');
const authorizationMiddleware =
  require('../middlewares/authorizarionMiddleware');
const tokenValidator = require('../validators/privateApi/tokenValidator');

// eslint-disable-next-line new-cap
const users = Router();

users.post('/', usersController.create);
users.post('/login', usersController.login);

users.use(tokenValidator);
// @ts-ignore
users.use(validatorMiddleware);
// @ts-ignore
users.use(authorizationMiddleware);
// @ts-ignore
users.use(verifyLogoutMiddleware);

users.delete('/', usersController.logout);


module.exports = users;
