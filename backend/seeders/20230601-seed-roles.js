'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        id_role: 'RLS-001',
        nama_role: 'Owner',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_role: 'RLS-002',
        nama_role: 'Kasir',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_role: 'RLS-003',
        nama_role: 'Pegawai Gudang',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
