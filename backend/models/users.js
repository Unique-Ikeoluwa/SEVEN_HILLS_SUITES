'use strict';
const {
  Model,
  BOOLEAN
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasMany(models.bookings, { foreignKey: 'user_id', as: 'bookings' });
      Users.hasMany(models.Message, { foreignKey: 'sender_id', as: 'sentMessages' });
      Users.hasMany(models.Message, { foreignKey: 'receiver_id', as: 'receivedMessages' });
      Users.hasMany(models.Notification, { foreignKey: 'user_id', as: 'notifications' });
    }
  }
  Users.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    role: DataTypes.STRING,
    phone_no: DataTypes.STRING,
    password: DataTypes.STRING,
    otpCode: DataTypes.INTEGER,
    otpExpiresAt: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    is_verified: DataTypes.BOOLEAN
    
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users',
  });
  return Users;
};