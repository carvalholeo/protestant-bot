'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('RetweetLog', 'tweet_id', {
          type: Sequelize.STRING(50),
          allowNull: true,
          defaultValue: null,
          unique: true,
        }, {transaction: t}),

        queryInterface.addColumn('RetweetLog', 'screen_name', {
          type: Sequelize.STRING(16),
          allowNull: true,
          defaultValue: null,
        }, {transaction: t}),

        queryInterface.addColumn('RetweetLog', 'tweet', {
          type: Sequelize.TEXT,
          allowNull: true,
          defaultValue: null,
        }, {transaction: t}),

        queryInterface.addColumn('RetweetLog', 'comment', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Sem razão específica',
        }, {transaction: t}),

        queryInterface.addColumn('RetweetLog', 'was_undone', {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        }, {transaction: t}),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('RetweetLog', 'tweet_id', {transaction: t}),
        queryInterface.removeColumn('RetweetLog', 'screen_name', {transaction: t}),
        queryInterface.removeColumn('RetweetLog', 'tweet', {transaction: t}),
        queryInterface.removeColumn('RetweetLog', 'comment', {transaction: t}),
        queryInterface.removeColumn('RetweetLog', 'was_undone', {transaction: t}),
      ]);
    });
  },
};
