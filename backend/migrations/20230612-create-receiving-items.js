'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('receiving_items', {
      id_penerimaan: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'receiving_transactions',
          key: 'id_penerimaan'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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
      jumlah_diterima: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      harga_beli: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      kondisi_barang: {
        type: Sequelize.ENUM('Baik', 'Rusak', 'Cacat'),
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
    await queryInterface.dropTable('receiving_items');
  }
};
