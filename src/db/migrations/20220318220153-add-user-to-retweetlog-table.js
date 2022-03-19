'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('RetweetLog', 'user_id', Sequelize.INTEGER, { after: 'message' });

    await queryInterface.addConstraint('RetweetLog', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userid_RetweetLog',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('RetweetLog', 'user_id');
  }
};
