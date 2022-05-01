'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RateLimit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RateLimit.init({
    limit: DataTypes.INTEGER,
    resource: DataTypes.STRING(100),
    next_reset: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'RateLimit',
    tableName: 'RateLimit',
    freezeTableName: true,
  });
  return RateLimit;
};
