'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Bots', 'consumer_key', Sequelize.STRING(30));
    await queryInterface.addColumn('Bots', 'consumer_secret', Sequelize.STRING(60));
    await queryInterface.addColumn('Bots', 'access_token', Sequelize.STRING(60));
    await queryInterface.addColumn('Bots', 'access_token_secret', Sequelize.STRING(50));
    await queryInterface.addColumn('Bots', 'bearer_token', Sequelize.STRING(150));
    await queryInterface.addColumn('Bots', 'query', Sequelize.STRING(150));
    await queryInterface.addColumn('Bots', 'blocked_words', Sequelize.STRING);
    await queryInterface.addColumn('Bots', 'language', Sequelize.STRING(10));
    await queryInterface.addColumn('Bots', 'is_payment_on_day', Sequelize.BOOLEAN);
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Bots', 'consumer_key');
    await queryInterface.removeColumn('Bots', 'consumer_secret');
    await queryInterface.removeColumn('Bots', 'access_token');
    await queryInterface.removeColumn('Bots', 'access_token_secret');
    await queryInterface.removeColumn('Bots', 'bearer_token');
    await queryInterface.removeColumn('Bots', 'query');
    await queryInterface.removeColumn('Bots', 'blocked_words');
    await queryInterface.removeColumn('Bots', 'language');
    await queryInterface.removeColumn('Bots', 'is_payment_on_day');
  }
}
