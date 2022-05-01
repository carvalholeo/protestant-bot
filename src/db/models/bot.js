'use strict';
const {
  Model,
} = require('sequelize');
const {v4: uuidv4} = require('uuid');

module.exports = (sequelize, DataTypes) => {
  class Bot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Bot.belongsTo(models.User, {
        as: 'bot_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  Bot.init({
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4(),
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    twitter_account: {
      type: DataTypes.STRING(15),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    authorization: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    consumer_key: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    consumer_secret: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    access_token: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    access_token_secret: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    bearer_token: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    query: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    blocked_words: {
      type: DataTypes.STRING,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'pt-BR'
    },
    is_payment_on_day: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Bot',
  });
  return Bot;
};
