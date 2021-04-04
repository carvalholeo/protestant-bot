'use strict';

const {Router} = require('express');

const BlocklistController = require('../controllers/BlocklistController');

// eslint-disable-next-line new-cap
const blocklist = Router();


blocklist.post('/block', BlocklistController.block);
blocklist.post('/unblock', BlocklistController.unblock);

module.exports = blocklist;
