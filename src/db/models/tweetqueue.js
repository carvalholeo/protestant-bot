'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TweetQueue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      TweetQueue.belongsTo(User, {
        as: 'tweetqueue_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  TweetQueue.init({
    tweet: DataTypes.JSON,
    already_retweeted: DataTypes.BOOLEAN,
    tweet_id: DataTypes.STRING(50),
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'TweetQueue',
    tableName: 'TweetQueue',
    freezeTableName: true,
  });
  return TweetQueue;
};
