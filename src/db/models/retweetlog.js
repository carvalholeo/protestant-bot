'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RetweetLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      RetweetLog.belongsTo(User, {
        as: 'retweetlog_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  RetweetLog.init({
    message: DataTypes.TEXT,
    tweet_id: DataTypes.STRING(50),
    screen_name: DataTypes.STRING(16),
    tweet: DataTypes.TEXT,
    comment: DataTypes.STRING,
    was_undone: DataTypes.BOOLEAN,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'RetweetLog',
    tableName: 'RetweetLog',
    freezeTableName: true,
  });
  return RetweetLog;
};
