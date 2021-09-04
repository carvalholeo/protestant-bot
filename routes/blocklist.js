'use strict';
// @ts-check

const {Router} = require('express');

const BlocklistController = require('../controllers/BlocklistController');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const userToBlockValidator =
    require('../validators/publicApi/userToBlockValidator');
const userToUnblockValidator =
    require('../validators/publicApi/userToUnblockValidator');

// eslint-disable-next-line new-cap
const blocklist = Router();


blocklist
    .post('/block',
        userToBlockValidator,
        validatorMiddleware,
        BlocklistController.block,
    );

blocklist
    .put('/unblock',
        userToUnblockValidator,
        validatorMiddleware,
        BlocklistController.unblock,
    );

module.exports = blocklist;
