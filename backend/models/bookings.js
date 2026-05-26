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
      // define association here
    }
  }
  bookings.init({
    user_id: DataTypes.UUID,
    apartment_id: DataTypes.UUID,
    check_in: DataTypes.STRING,
    check_out: DataTypes.STRING,
    total_price: DataTypes.STRING,
    booking_status: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    payment_status: DataTypes.ENUM('pending', 'paid', 'failed')
  }, {
    sequelize,
    modelName: 'bookings',
  });
  return bookings;
};