'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('receiving_transactions', {
      id_penerimaan: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      nomor_dokumen_penerimaan: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      tanggal_penerimaan: {
        type: Sequelize.DATE,
        allowNull: false
      },
      catatan: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      id_pegawai_gudang: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'users',
          key: 'id_user'
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
    await queryInterface.dropTable('receiving_transactions');
  }
};
