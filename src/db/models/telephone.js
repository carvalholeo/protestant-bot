'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telephone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User}) {
      Telephone.belongsTo(User, {
        as: 'telephone_user',
        foreignKey: 'user_id',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    }
  }
  Telephone.init({
    ddi: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ddd: {
      type: DataTypes.INTEGER
    },
    tel: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
    sequelize,
    modelName: 'Telephone',
  });
  return Telephone;
};