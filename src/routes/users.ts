import { Router } from 'express';

import usersController from '../controllers/UsersController';

import validatorMiddleware from '../middlewares/validatorMiddleware';
import verifyLogoutMiddleware from '../middlewares/verifyLogoutMiddleware';
import authorizationMiddleware from '../middlewares/authorizarionMiddleware';

import tokenValidator from '../validators/privateApi/tokenValidator';
import loginValidator from '../validators/privateApi/users/loginValidator';
import userCreateValidator from '../validators/privateApi/users/userCreateValidator';

const users = Router();

users.post('/',
    userCreateValidator,
    validatorMiddleware,
    usersController.create);

users.post('/login',
    loginValidator,
    validatorMiddleware,
    usersController.login);

users.use(tokenValidator);
users.use(validatorMiddleware);
users.use(authorizationMiddleware);
users.use(verifyLogoutMiddleware);

users.delete('/', usersController.logout);


export default users;
