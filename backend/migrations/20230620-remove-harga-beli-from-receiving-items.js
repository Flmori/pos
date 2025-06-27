'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Remove the 'harga_beli' column from 'receiving_items' table
    await queryInterface.removeColumn('receiving_items', 'harga_beli').catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // Add the 'harga_beli' column back to 'receiving_items' table
    await queryInterface.addColumn('receiving_items', 'harga_beli', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    });
  }
};
