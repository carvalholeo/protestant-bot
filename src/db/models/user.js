'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Blocklist,
      Bot,
      RetweetLog,
      TweetQueue,
      Contact,
      Telephone}) {
      User.hasMany(Blocklist, {
        as: 'user_blocklist',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      User.hasMany(Bot, {
        as: 'user_bot',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      User.hasMany(RetweetLog, {
        as: 'user_retweetlog',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      User.hasMany(TweetQueue, {
        as: 'user_tweetqueue',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      User.hasMany(Contact, {
        as: 'user_contact',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });

      User.hasMany(Telephone, {
        as: 'user_telephone',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    has_mfa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    secret_mfa: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: null
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'Users',
    freezeTableName: true,
  });
  return User;
};
