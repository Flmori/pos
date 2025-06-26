'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('products', {
      id_barang: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      nama_barang: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      harga_beli: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      harga_jual: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      stok: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      id_kategori: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'categories',
          key: 'id_kategori'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
    await queryInterface.dropTable('products');
  }
};
