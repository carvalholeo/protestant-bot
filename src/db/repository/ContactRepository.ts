import models from '../models';
import logger from '../../logs/logger';

import ContactInterface from '../../interfaces/typeDefinitions/Contact';
import LogDatabase from '../../interfaces/typeDefinitions/LogDatabase';

/**
 * Class to handle with contacts received from the front-end.
 * @class Contact
 */
class ContactRepository {
  /**
   * Method to save a contact on database.
   * @param {ContactInterface} contact Object with these properties:
   * - name: name to be answered
   * - email: email to where send a response
   * - twitter: Twitter account liked to the person
   * - message: text with message sent from the app to the dev
   */
  async createContact(contact: ContactInterface) {
    try {
      if (typeof(contact.message) === 'undefined') {
        throw new ReferenceError(`You must provide a object of contact
        to be stored on database or, at least, a message.`);
      }
      const data = {
        name: contact.name,
        email: contact.email,
        twitter: contact.twitter,
        message: contact.message,
      };

      await models.Contact.create(data);
    } catch (error: any) {
      const logObject: LogDatabase = {
        emmiter: 'ContactService.createContact.catch',
        level: 'error',
        message: error.message,
      };

      await logger(logObject);
    }
  }
}

export default ContactRepository;
