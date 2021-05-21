'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      console.log("models ==>", models)
      User.hasMany(models.Message, {
        as: '_fromUserId',
        foreignKey: 'fromUserId',
      })
      User.hasMany(models.Message, {
        as: '_toUserId',
        foreignKey: 'toUserId',
      })
    }
  };
  User.init({
    name: DataTypes.STRING,
    userId: DataTypes.STRING,
    isOnline: DataTypes.BOOLEAN,
    socketId: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};