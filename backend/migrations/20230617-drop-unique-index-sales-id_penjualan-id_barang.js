'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Remove foreign key constraint on id_barang before removing index
    await queryInterface.removeConstraint('sales', 'sales_ibfk_1').catch(() => {});
    await queryInterface.removeIndex('sales', 'sales_id_penjualan_id_barang');
  },

 async down(queryInterface, Sequelize) {
    await queryInterface.addIndex('sales', ['id_penjualan', 'id_barang'], {
      unique: true,
      name: 'sales_id_penjualan_id_barang'
    });
    // Re-add foreign key constraint on id_barang
    await queryInterface.addConstraint('sales', {
      fields: ['id_barang'],
      type: 'foreign key',
      name: 'sales_ibfk_1',
      references: {
        table: 'products',
        field: 'id_barang',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  }
};
