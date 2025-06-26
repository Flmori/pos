import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Category from './Category.js';

const Product = sequelize.define('Product', {
  id_barang: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_barang: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  harga_beli: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  harga_jual: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stok: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_kategori: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id_kategori',
    },
  },
}, {
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Product.belongsTo(Category, { foreignKey: 'id_kategori' });

export default Product;
