'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Message.belongsTo(models.User, {
        targetKey: 'id',
        as: '_fromUserIdData',
        foreignKey: 'fromUserId',
        onDelete: 'CASCADE'
      })
      Message.belongsTo(models.User, {
        targetKey: 'id',
        as: '_toUserIdData',
        foreignKey: 'toUserId',
        onDelete: 'CASCADE'
      })
    }
  };
  Message.init({
    fromUserId: DataTypes.STRING,
    message: DataTypes.STRING,
    toUserId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};