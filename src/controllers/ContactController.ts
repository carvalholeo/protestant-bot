import {Request, Response} from 'express';

import models from '../db/repository';
const {
  Contact,
} = models;
import logger from '../logs/logger';
import email from '../services/emails';
import LogDatabase from '../interfaces/typeDefinitions/LogDatabase';
const {sendMail} = email;

const ContactController = {
  create: async (request: Request, response: Response) => {
    try {
      const {name, email, twitter, message} = request.body;
      const contact = new Contact();

      await contact.createContact({name, email, twitter, message});

      const messageToUser = `Message from ${name} posted on front and
created at database.`;

      const logObject: LogDatabase = {
        emmiter: 'ContactController.create.try',
        level: 'info',
        message: messageToUser,
      };

      await logger(logObject);

      response
          .status(201)
          .json({messageToUser});

      await sendMail({name, email, twitter, message});
    } catch (error: any) {
      console.error(error);
      const message = `Error on register contact at database.
      Reason: ${error.message}`;

      const logObject: LogDatabase = {
        emmiter: 'ContactController.create.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);

      return response
          .status(500)
          .json({message});
    }
  },
};

export default ContactController;
