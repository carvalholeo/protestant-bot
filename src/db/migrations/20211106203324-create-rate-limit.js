'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RateLimit', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      limit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      resource: {
        type: Sequelize.STRING(100),
        allowNull: false,
        defaultValue: 'statuses/retweet',
      },
      next_reset: {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 15,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RateLimit');
  },
};
