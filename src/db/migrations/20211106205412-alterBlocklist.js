'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Blocklist', 'blocked_by_admin', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        }, {transaction: t}),

        queryInterface.addColumn('Blocklist', 'comment', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Sem razão específica',
        }, {transaction: t}),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Blocklist', 'blocked_by_admin', {transaction: t}),
        queryInterface.removeColumn('Blocklist', 'comment', {transaction: t}),
      ]);
    });
  }
};
