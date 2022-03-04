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
    static associate(models) {
      // define association here
    }
  };
  TweetQueue.init({
    tweet: DataTypes.JSON,
    already_retweeted: DataTypes.BOOLEAN,
    tweet_id: DataTypes.STRING(50),
  }, {
    sequelize,
    modelName: 'TweetQueue',
    tableName: 'TweetQueue',
    freezeTableName: true,
  });
  return TweetQueue;
};
