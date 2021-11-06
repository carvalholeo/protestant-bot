'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RetweetLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  RetweetLog.init({
    message: DataTypes.TEXT,
    tweet_id: DataTypes.STRING(50),
    screen_name: DataTypes.STRING(16),
    tweet: DataTypes.TEXT,
    comment: DataTypes.STRING,
    was_undone: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'RetweetLog',
  });
  return RetweetLog;
};
