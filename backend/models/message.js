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
      Message.belongsTo(models.Users, { foreignKey: 'sender_id', as: 'sender' });
      Message.belongsTo(models.Users, { foreignKey: 'receiver_id', as: 'receiver' });
    }
  }
  Message.init({
    sender_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    room_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Message',
    tableName: 'messages',
  });
  return Message;
};
