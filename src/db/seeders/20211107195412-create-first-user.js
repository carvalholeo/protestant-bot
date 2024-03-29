'use strict';

const {hashSync} = require('bcrypt');
const {faker} = require('@faker-js/faker');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
    // deepcode ignore HardcodedNonCryptoSecret: Used to create an initial password when installing project
    const password = faker.internet.password();
    const hashed = hashSync(password, saltRounds);

    console.log(password)

    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: hashed,
        is_active: true,
        has_mfa: false,
        secret_mfa: null,
      },
    ], {});
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
