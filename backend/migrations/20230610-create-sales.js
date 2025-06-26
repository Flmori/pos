'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('sales', {
      id_penjualan: {
        type: Sequelize.STRING(10),
        allowNull: false,
        primaryKey: true
      },
      id_barang: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'products',
          key: 'id_barang'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      jumlah_barang: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      harga_per_unit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      subtotal_item: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('sales');
  }
};
