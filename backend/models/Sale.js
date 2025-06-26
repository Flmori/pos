import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';
import Product from './Product.js';

const Sale = sequelize.define('Sale', {
  id_penjualan: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  no_nota: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  id_barang: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    references: {
      model: Product,
      key: 'id_barang',
    },
  },
  jumlah_barang: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  harga_per_unit: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal_item: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: 'sales',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      unique: true,
      fields: ['id_penjualan', 'id_barang'],
    },
  ],
});

Sale.belongsTo(Product, { foreignKey: 'id_barang' });

import moment from 'moment';

Sale.beforeCreate(async (sale, options) => {
  // Generate id_penjualan as before
  const prefix = 'SLTS-';
  const lastSale = await Sale.findOne({
    where: {
      id_penjualan: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['id_penjualan', 'DESC']],
  });
  if (lastSale) {
    const lastIdNum = parseInt(lastSale.id_penjualan.replace(prefix, ''), 10);
    const newIdNum = lastIdNum + 1;
    sale.id_penjualan = prefix + newIdNum.toString().padStart(3, '0');
  } else {
    sale.id_penjualan = prefix + '001';
  }

  // Generate no_nota as yyyymmdd + 4 digit sequence reset daily
  const datePrefix = moment().format('YYYYMMDD');
  const likePattern = `${datePrefix}%`;

  const lastNoNota = await Sale.findOne({
    where: {
      no_nota: {
        [Op.like]: likePattern
      }
    },
    order: [['no_nota', 'DESC']],
  });

  if (lastNoNota && lastNoNota.no_nota) {
    const lastSeq = parseInt(lastNoNota.no_nota.slice(8), 10);
    sale.no_nota = parseInt(datePrefix + (lastSeq + 1).toString().padStart(4, '0'), 10);
  } else {
    sale.no_nota = parseInt(datePrefix + '0001', 10);
  }
});

export default Sale;
