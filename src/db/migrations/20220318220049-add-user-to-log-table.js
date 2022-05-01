'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Logs', 'user_id', Sequelize.INTEGER, { after: 'message' });

    await queryInterface.addConstraint('Logs', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userid_log',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Logs', 'user_id');
  }
};
