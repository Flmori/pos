'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get role IDs
    const roles = await queryInterface.sequelize.query(
      `SELECT id_role, nama_role FROM roles;`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    const ownerRoleId = roles.find(role => role.nama_role === 'Owner').id_role;
    const kasirRoleId = roles.find(role => role.nama_role === 'Kasir').id_role;
    const gudangRoleId = roles.find(role => role.nama_role === 'Pegawai Gudang').id_role;

    const hashedPasswordOwner = await bcrypt.hash('passwordOwner123', 10);
    const hashedPasswordKasir = await bcrypt.hash('passwordKasir123', 10);
    const hashedPasswordGudang = await bcrypt.hash('passwordGudang123', 10);

    await queryInterface.bulkInsert('users', [
      {
        id_user: 'USRS-001',
        username: 'owner',
        password: hashedPasswordOwner,
        nama_lengkap: 'Budi Santoso (Owner)',
        id_role: ownerRoleId,
        email: 'owner@kyuryu.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_user: 'USRS-002',
        username: 'kasir01',
        password: hashedPasswordKasir,
        nama_lengkap: 'Siti Aminah (Kasir)',
        id_role: kasirRoleId,
        email: 'kasir01@kyuryu.com',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_user: 'USRS-003',
        username: 'gudang01',
        password: hashedPasswordGudang,
        nama_lengkap: 'Joko Susilo (Pegawai Gudang)',
        id_role: gudangRoleId,
        email: 'gudang01@kyuryu.com',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
