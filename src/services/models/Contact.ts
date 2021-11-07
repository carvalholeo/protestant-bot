import models from '../../db/models';
import ErrorLog from './ErrorLog';
import logger from '../../logs/logger';

import ContactInterface from '../../interfaces/typeDefinitions/Contact';

/**
 * Class to handle with contacts received from the front-end.
 * @class Contact
 */
class Contact {
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
      const message = `Error from Contact class, method createContact.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

export default Contact;
