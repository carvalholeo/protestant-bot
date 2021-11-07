'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class KernelPanicLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  KernelPanicLog.init({
    message: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'KernelPanicLog',
    tableName: 'kernelpaniclog',
    freezeTableName: true,
  });
  return KernelPanicLog;
};
