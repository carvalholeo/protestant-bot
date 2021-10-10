// @ts-check
'use strict';

const {Router} = require('express');

const ContactController = require('../controllers/ContactController');
const validatorMiddleware = require('../middlewares/validatorMiddleware');
const contactFormValidator =
    require('../validators/publicApi/contactFormValidator');

// eslint-disable-next-line new-cap
const contact = Router();


contact
    .post('/',
        contactFormValidator,
        // @ts-ignore
        validatorMiddleware,
        ContactController.create,
    );

module.exports = contact;
