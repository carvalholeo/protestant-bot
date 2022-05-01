'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Contact.belongsTo(models.User, {
        as: 'contact_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  Contact.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    twitter: DataTypes.STRING,
    message: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Contact',
    tableName: 'Contacts',
    freezeTableName: true,
  });
  return Contact;
};
