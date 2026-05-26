'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      user_id: {
        type: Sequelize.UUID
      },
      apartment_id: {
        type: Sequelize.UUID
      },
      check_in: {
        type: Sequelize.STRING
      },
      check_out: {
        type: Sequelize.STRING
      },
      total_price: {
        type: Sequelize.STRING
      },
      booking_status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled')
      },
      payment_status: {
        type: Sequelize.ENUM('pending', 'paid', 'failed')
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookings');
  }
};