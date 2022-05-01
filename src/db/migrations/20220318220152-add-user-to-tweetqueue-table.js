'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('TweetQueue', 'user_id', Sequelize.INTEGER, { after: 'message' });

    await queryInterface.addConstraint('TweetQueue', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userid_tweetqueue',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.removeColumn('TweetQueue', 'user_id');
  }
};
