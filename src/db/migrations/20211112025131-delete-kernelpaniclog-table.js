'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('KernelPanicLog');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('KernelPanicLog', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false,
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
};
