import { Request, Response } from 'express';

import models from '../models';
const {
  Contact, ErrorLog, AccessLog,
} = models;
import logger from '../logs/logger';
import email from '../services/emails';
const { sendMail } = email;

const ContactController = {
  create: async (request: Request, response: Response) => {
    try {
      const { name, email, twitter, message } = request.body;
      const contact = new Contact();

      await contact.createContact({ name, email, twitter, message });

      const messageToUser = `Message from ${name} posted on front and
created at database.`;

      await logger('access', messageToUser, new AccessLog());
      response
        .status(201)
        .json({ messageToUser });

      await sendMail({ name, email, twitter, message });
    } catch (error) {
      console.error(error);
      const message = `Error on register contact at database.
      Reason: ${error}`;
      await logger('error', message, new ErrorLog());
      return response
        .status(500)
        .json({ message });
    }
  },
};

export default ContactController;
