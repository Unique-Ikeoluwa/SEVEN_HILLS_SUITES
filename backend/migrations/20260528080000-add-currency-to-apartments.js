'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('apartments');
    if (!tableInfo.currency) {
      await queryInterface.addColumn('apartments', 'currency', {
        type: Sequelize.ENUM('USD', 'NGN'),
        defaultValue: 'NGN',
        allowNull: false
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('apartments');
    if (tableInfo.currency) {
      await queryInterface.removeColumn('apartments', 'currency');
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_apartments_currency";');
    }
  }
};
