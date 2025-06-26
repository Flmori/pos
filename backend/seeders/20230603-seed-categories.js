'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('categories', [
      {
        id_kategori: 'CTGR-001',
        nama_kategori: 'Kopi Klasik',
        deskripsi_kategori: 'Minuman kopi dasar yang populer.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_kategori: 'CTGR-002',
        nama_kategori: 'Kopi Signature',
        deskripsi_kategori: 'Minuman kopi spesial racikan Toko KyuRyu.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_kategori: 'CTGR-003',
        nama_kategori: 'Manual Brew',
        deskripsi_kategori: 'Minuman kopi hasil seduh manual.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_kategori: 'CTGR-004',
        nama_kategori: 'Non-Kopi',
        deskripsi_kategori: 'Minuman selain kopi.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_kategori: 'CTGR-005',
        nama_kategori: 'Pastry & Roti',
        deskripsi_kategori: 'Berbagai jenis pastry dan roti.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_kategori: 'CTGR-006',
        nama_kategori: 'Kudapan Berat',
        deskripsi_kategori: 'Makanan berat atau camilan mengenyangkan.',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id_kategori: 'CTGR-007',
        nama_kategori: 'Dessert',
        deskripsi_kategori: 'Hidangan penutup manis.',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('categories', null, {});
  }
};
