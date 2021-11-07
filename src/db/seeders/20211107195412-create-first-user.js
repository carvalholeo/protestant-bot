'use strict';

const {hashSync} = require('bcrypt');


module.exports = {
  up: async (queryInterface, Sequelize) => {
    const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
    const password = hashSync('initialPassword', saltRounds);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: password,
        is_active: true,
        has_mfa: false,
        secret_mfa: null,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
