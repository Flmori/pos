import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './Product.js';

const ReceivingItem = sequelize.define('ReceivingItem', {
  id_penerimaan: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    references: {
      model: 'receiving_transactions',
      key: 'id_penerimaan',
    },
  },
  id_barang: {
    type: DataTypes.STRING(10),
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

export default ReceivingItem;
