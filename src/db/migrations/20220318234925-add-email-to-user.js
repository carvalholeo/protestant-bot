'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'email', Sequelize.STRING(100));
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Users', 'email')
  }
};
