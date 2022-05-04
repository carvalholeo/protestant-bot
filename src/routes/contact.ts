import { Router } from 'express';

import ContactController from '../controllers/ContactController';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import contactFormValidator from '../validators/publicApi/contactFormValidator';

const contact = Router();

contact
    .post('/',
        contactFormValidator,
        validatorMiddleware,
        ContactController.create);

export default contact;
