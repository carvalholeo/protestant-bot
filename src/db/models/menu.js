/* eslint-disable require-jsdoc */
'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Menu.hasMany(models.Menu, {
        foreignKey: 'page_father',
        as: 'pageFatherId',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Menu.belongsTo(models.Menu, {
        foreignKey: {
          field: 'id',
          allowNull: true,
          defaultValue: null,
        },
        as: 'page_son',
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
    }
  };
  Menu.init({
    page_name: DataTypes.STRING,
    path: DataTypes.STRING,
    page_father: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Menu',
    tableName: 'Menus',
    freezeTableName: true,
  });
  return Menu;
};
