import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import ReceivingTransaction from './ReceivingTransaction.js';
import Product from './Product.js';

const ReceivingItem = sequelize.define('ReceivingItem', {
  id_penerimaan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: ReceivingTransaction,
      key: 'id_penerimaan',
    },
  },
  id_barang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    references: {
      model: Product,
      key: 'id_barang',
    },
  },
  jumlah_diterima: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  harga_beli: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  kondisi_barang: {
    type: DataTypes.ENUM('Baik', 'Rusak', 'Cacat'),
    allowNull: false,
  },
}, {
  tableName: 'receiving_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['id_penerimaan', 'id_barang'],
    },
  ],
});

ReceivingItem.belongsTo(ReceivingTransaction, { foreignKey: 'id_penerimaan' });
ReceivingItem.belongsTo(Product, { foreignKey: 'id_barang' });

export default ReceivingItem;
