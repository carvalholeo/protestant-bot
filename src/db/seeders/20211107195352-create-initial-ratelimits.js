'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const reset = Date.now();
    await queryInterface.bulkInsert('RateLimit', [
      {
        id: 1,
        limit: 75,
        resource: 'statuses/retweet',
        next_reset: reset,
      },
      {
        id: 2,
        limit: 1000,
        resource: 'favorites/create',
        next_reset: reset,
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RateLimit', null, {});
  },
};
