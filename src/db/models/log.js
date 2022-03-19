'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Log.belongsTo(models.User, {
        as: 'log_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  };
  Log.init({
    level: DataTypes.STRING(15),
    emmiter: DataTypes.STRING,
    message: DataTypes.TEXT,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Log',
  });
  return Log;
};
