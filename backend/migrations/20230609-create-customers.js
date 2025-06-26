'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id_pelanggan: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      nama_pelanggan: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      no_wa: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      alamat: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_member: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      tgl_daftar_member: {
        type: Sequelize.DATE,
        allowNull: true
      },
      poin_loyalitas: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
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
    await queryInterface.dropTable('customers');
  }
};
