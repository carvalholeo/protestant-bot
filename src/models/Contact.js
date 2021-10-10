// @ts-check

const BaseModel = require('./Base');
const ErrorLog = require('./ErrorLog');
const logger = require('../logs/logger');

/**
 * Class to handle with contacts received from the front-end.
 * @class Contact
 * @extends BaseModel
 */
class Contact extends BaseModel {
  /**
   * Pass to the base class constructor the name of the table.
   */
  constructor() {
    super('contact');
  }

  /**
   * Method to save a contact on database.
   * @param {JSON} contact Object with these properties:
   * - name: name to be answered
   * - email: email to where send a response
   * - twitter: Twitter account liked to the person
   * - message: text with message sent from the app to the dev
   */
  async createContact(contact) {
    try {
      if (typeof(contact) === 'undefined' ||
      typeof(contact.message) === 'undefined') {
        throw new ReferenceError(`You must provide a object of contact
        to be stored on database or, at least, a message.`);
      }
      const data ={
        name: contact.name,
        email: contact.email,
        twitter: contact.twitter,
        message: contact.message,
        created_at: this.dateTime,
        updated_at: this.dateTime,
      };

      await this._connection
          .insert(data);
    } catch (error) {
      const message = `Error from Contact class, method createContact.
      Message catched: ${error.message}.
      Complete Error object: ${error}`;
      logger('error', message, new ErrorLog());
    }
  }
}

module.exports = Contact;
