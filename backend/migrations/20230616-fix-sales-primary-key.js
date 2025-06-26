'use strict';

export async function up(queryInterface, Sequelize) {
  // Drop existing primary key on id_penjualan
  await queryInterface.sequelize.query(`
    ALTER TABLE sales DROP PRIMARY KEY;
  `);

  // Add composite primary key on (id_penjualan, id_barang)
  await queryInterface.sequelize.query(`
    ALTER TABLE sales ADD PRIMARY KEY (id_penjualan, id_barang);
  `);
}

export async function down(queryInterface, Sequelize) {
  // Revert to primary key on id_penjualan only
  await queryInterface.sequelize.query(`
    ALTER TABLE sales DROP PRIMARY KEY;
  `);

  await queryInterface.sequelize.query(`
    ALTER TABLE sales ADD PRIMARY KEY (id_penjualan);
  `);
}
