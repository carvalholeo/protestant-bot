'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blocklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Blocklist.init({
    screen_name: DataTypes.STRING,
    is_blocked_now: DataTypes.BOOLEAN,
    blocked_by_admin: DataTypes.BOOLEAN,
    comment: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Blocklist',
    tableName: 'Blocklist',
    freezeTableName: true,
  });
  return Blocklist;
};
