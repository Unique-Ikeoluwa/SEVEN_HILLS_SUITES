'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Wallets.init({
    public_address: DataTypes.STRING,
    balance: DataTypes.INTEGER,
    private_key: DataTypes.STRING,
    mnemonic: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Wallets',
    tableName: 'wallet'
  });
  return Wallets;
};