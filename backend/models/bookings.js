'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      bookings.belongsTo(models.Users, { foreignKey: 'user_id', as: 'user' });
      bookings.belongsTo(models.Apartment, { foreignKey: 'apartment_id', as: 'apartment' });
      bookings.hasMany(models.Payments, { foreignKey: 'booking_id', as: 'payments' });
    }
  }
  bookings.init({
    user_id: DataTypes.UUID,
    apartment_id: DataTypes.UUID,
    check_in: DataTypes.STRING,
    check_out: DataTypes.STRING,
    total_price: DataTypes.STRING,
    booking_status: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    payment_status: DataTypes.ENUM('pending', 'paid', 'failed'),
    guest_name: DataTypes.STRING,
    guest_email: DataTypes.STRING,
    guest_phone: DataTypes.STRING,
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'fiat'
    }
  }, {
    sequelize,
    modelName: 'bookings',
  });
  return bookings;
};