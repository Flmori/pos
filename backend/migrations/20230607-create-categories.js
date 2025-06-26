'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('categories', {
      id_kategori: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      nama_kategori: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      deskripsi_kategori: {
        type: Sequelize.TEXT,
        allowNull: true
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
    await queryInterface.dropTable('categories');
  }
};
