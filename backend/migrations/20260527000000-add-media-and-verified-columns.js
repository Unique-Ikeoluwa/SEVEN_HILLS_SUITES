'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add is_verified to users table if not already exists
    const usersTable = await queryInterface.describeTable('users');
    if (!usersTable.is_verified) {
      await queryInterface.addColumn('users', 'is_verified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      });
    }

    // 2. Add images, videos, and apartment_type to apartments table
    const apartmentsTable = await queryInterface.describeTable('apartments');
    if (!apartmentsTable.images) {
      await queryInterface.addColumn('apartments', 'images', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    if (!apartmentsTable.videos) {
      await queryInterface.addColumn('apartments', 'videos', {
        type: Sequelize.TEXT,
        allowNull: true
      });
    }
    if (!apartmentsTable.apartment_type) {
      await queryInterface.addColumn('apartments', 'apartment_type', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const usersTable = await queryInterface.describeTable('users');
    if (usersTable.is_verified) {
      await queryInterface.removeColumn('users', 'is_verified');
    }

    const apartmentsTable = await queryInterface.describeTable('apartments');
    if (apartmentsTable.images) {
      await queryInterface.removeColumn('apartments', 'images');
    }
    if (apartmentsTable.videos) {
      await queryInterface.removeColumn('apartments', 'videos');
    }
    if (apartmentsTable.apartment_type) {
      await queryInterface.removeColumn('apartments', 'apartment_type');
    }
  }
};
