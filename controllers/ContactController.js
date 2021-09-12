// @ts-check
'use strict';

const {
  Contact,
  ErrorLog,
  AccessLog,
} = require('../models');
const logger = require('../logs/logger');

const ContactController = {
  create: async (request, response) => {
    try {
      const {name, email, twitter, message} = request.body;
      const contact = new Contact();

      // @ts-ignore
      await contact.createContact({name, email, twitter, message});

      const messageToUser = `Message from ${name} posted on front and
created at database.`;

      await logger('access', messageToUser, new AccessLog());
      return response
          .status(201)
          .json({messageToUser});
    } catch (error) {
      console.error(error);
      const message = `Error on block user.
      Reason: ${error}`;
      await logger('error', message, new ErrorLog());
      return response
          .status(500)
          .json({message});
    }
  },
};

module.exports = ContactController;
