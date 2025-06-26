'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sales', 'no_nota', {
      type: Sequelize.INTEGER,
      allowNull: true,
      after: 'id_penjualan',
    });

    await queryInterface.addColumn('receiving_transactions', 'Referensi', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'id_penerimaan',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sales', 'no_nota');
    await queryInterface.removeColumn('receiving_transactions', 'Referensi');
  }
};
