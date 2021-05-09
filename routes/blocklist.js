'use strict';
// @ts-check

const {Router} = require('express');

const BlocklistController = require('../controllers/BlocklistController');
const DefaultController = require('../controllers/DefaultController');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const userToBlockValidator =
    require('../validators/publicApi/userToBlockValidator');
const userToUnblockValidator =
    require('../validators/publicApi/userToUnblockValidator');

// eslint-disable-next-line new-cap
const blocklist = Router();


blocklist
    .get('/block', DefaultController.methodNotAllowed)
    .put('/block', DefaultController.methodNotAllowed)
    .patch('/block', DefaultController.methodNotAllowed)
    .delete('/block', DefaultController.methodNotAllowed)
    .head('/block', DefaultController.methodNotAllowed)
    .post('/block',
        userToBlockValidator,
        validatorMiddleware,
        BlocklistController.block,
    );

blocklist
    .get('/unblock', DefaultController.methodNotAllowed)
    .post('/unblock', DefaultController.methodNotAllowed)
    .patch('/unblock', DefaultController.methodNotAllowed)
    .delete('/unblock', DefaultController.methodNotAllowed)
    .head('/unblock', DefaultController.methodNotAllowed)
    .put('/unblock',
        userToUnblockValidator,
        validatorMiddleware,
        BlocklistController.unblock,
    );

module.exports = blocklist;
