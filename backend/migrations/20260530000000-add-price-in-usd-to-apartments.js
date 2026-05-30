'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('apartments');
    if (!tableInfo.price_in_usd) {
      await queryInterface.addColumn('apartments', 'price_in_usd', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('apartments');
    if (tableInfo.price_in_usd) {
      await queryInterface.removeColumn('apartments', 'price_in_usd');
    }
  }
};
