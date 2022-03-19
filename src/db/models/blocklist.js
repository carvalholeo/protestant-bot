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
      Blocklist.belongsTo(models.User, {
        as: 'blocklist_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  };
  Blocklist.init({
    screen_name: DataTypes.STRING,
    is_blocked_now: DataTypes.BOOLEAN,
    blocked_by_admin: DataTypes.BOOLEAN,
    comment: DataTypes.STRING,
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Blocklist',
    tableName: 'Blocklist',
    freezeTableName: true,
  });
  return Blocklist;
};
