import { Request, Response } from 'express';

import { ContactRepository } from '../db/repository';
import logger from '../services/logs/logger';
import { sendMail } from '../services/emails';


class ContactController {
  async create(request: Request, response: Response) {
    try {
      const { name, email, twitter, message } = request.body;
      const contact = new ContactRepository();

      await contact.createContact({ name, email, twitter, message });

      const messageToUser = `Message from ${name} posted on front and
created at database.`;

      logger.info(`${messageToUser} at ContactController.create.try`);

      response
        .status(201)
        .json({ messageToUser });

      await sendMail({ name, email, twitter, message });
    } catch (error: any) {
      console.error(error);
      const message = `Error on register contact at database.
      Reason: ${error.message}`;

      logger.error(`${message} at ContactController.create.try`);

      return response
        .status(500)
        .json({ message });
    }
  }
}

export default new ContactController();
