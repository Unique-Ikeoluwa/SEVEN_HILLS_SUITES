'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Apartment.hasMany(models.bookings, { foreignKey: 'apartment_id', as: 'bookings' });
    }
  }
  Apartment.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    price: DataTypes.STRING,
    price_in_usd: DataTypes.STRING,
    status: DataTypes.ENUM('available', 'booked'),
    currency: {
      type: DataTypes.ENUM('USD', 'NGN'),
      defaultValue: 'USD',
      allowNull: false
    },
    amenities: DataTypes.STRING,
    images: DataTypes.TEXT,
    videos: DataTypes.TEXT,
    apartment_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Apartment',
    tableName: 'apartments',
  });
  return Apartment;
};