'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('bookings');
    
    if (!tableInfo.guest_name) {
      await queryInterface.addColumn('bookings', 'guest_name', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!tableInfo.guest_email) {
      await queryInterface.addColumn('bookings', 'guest_email', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
    
    if (!tableInfo.guest_phone) {
      await queryInterface.addColumn('bookings', 'guest_phone', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    if (!tableInfo.payment_type) {
      await queryInterface.addColumn('bookings', 'payment_type', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'fiat'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('bookings');
    
    if (tableInfo.guest_name) {
      await queryInterface.removeColumn('bookings', 'guest_name');
    }
    if (tableInfo.guest_email) {
      await queryInterface.removeColumn('bookings', 'guest_email');
    }
    if (tableInfo.guest_phone) {
      await queryInterface.removeColumn('bookings', 'guest_phone');
    }
    if (tableInfo.payment_type) {
      await queryInterface.removeColumn('bookings', 'payment_type');
    }
  }
};
