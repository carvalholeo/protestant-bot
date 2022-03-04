'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('TweetQueue', 'tweet_id', {
          type: Sequelize.STRING(50),
          allowNull: true,
          defaultValue: null,
          unique: true,
        }, {transaction: t}),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('TweetQueue', 'tweet_id', {transaction: t}),
      ]);
    });
  },
};
