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
      // define association here
    }
  };
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
  }, {
    sequelize,
    modelName: 'Bot',
  });
  return Bot;
};
