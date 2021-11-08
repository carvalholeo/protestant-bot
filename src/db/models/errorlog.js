'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ErrorLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ErrorLog.init({
    message: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'ErrorLog',
    tableName: 'errorlog',
    freezeTableName: true,
  });
  return ErrorLog;
};
