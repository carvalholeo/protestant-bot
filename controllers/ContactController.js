// @ts-check
'use strict';

const {
  Contact,
  ErrorLog,
  AccessLog,
} = require('../models');
const logger = require('../logs/logger');
const {sendMail} = require('../services/emails');

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
      response
          .status(201)
          .json({messageToUser});

      // @ts-ignore
      await sendMail({name, email, twitter, message});
    } catch (error) {
      console.error(error);
      const message = `Error on register contact at database.
      Reason: ${error}`;
      await logger('error', message, new ErrorLog());
      return response
          .status(500)
          .json({message});
    }
  },
};

module.exports = ContactController;
