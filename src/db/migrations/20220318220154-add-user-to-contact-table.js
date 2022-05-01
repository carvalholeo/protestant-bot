'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Contacts', 'user_id', Sequelize.INTEGER, { after: 'message' });

    await queryInterface.addConstraint('Contacts', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userid_Contacts',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, _Sequelize) {
    await queryInterface.removeColumn('Contacts', 'user_id');
  }
};
