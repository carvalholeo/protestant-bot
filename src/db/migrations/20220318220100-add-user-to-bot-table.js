'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Bots', 'user_id', Sequelize.INTEGER, { after: 'message' });

    await queryInterface.addConstraint('Bots', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userid_bot',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Bots', 'user_id');
  }
};
