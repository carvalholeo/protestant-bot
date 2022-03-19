'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Blocklist', 'user_id', Sequelize.INTEGER, { after: 'message' });

    await queryInterface.addConstraint('Blocklist', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userid_blocklist',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Blocklist', 'user_id');
  }
};
