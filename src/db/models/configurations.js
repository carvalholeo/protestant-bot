'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Configurations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Configurations.init({
    name: DataTypes.STRING,
    value: DataTypes.TEXT,
    is_active: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Configurations',
    tableName: 'configurations',
    freezeTableName: true,
  });
  return Configurations;
};
