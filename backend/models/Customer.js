import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';

const Customer = sequelize.define('Customer', {
  id_pelanggan: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  nama_pelanggan: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  no_wa: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  alamat: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  is_member: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  tgl_daftar_member: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  poin_loyalitas: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
  },
}, {
  tableName: 'customers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

Customer.beforeCreate(async (customer, options) => {
  const prefix = 'CSTM-';
  const lastCustomer = await Customer.findOne({
    where: {
      id_pelanggan: {
        [Op.like]: `${prefix}%`
      }
    },
    order: [['id_pelanggan', 'DESC']],
  });
  if (lastCustomer) {
    const lastIdNum = parseInt(lastCustomer.id_pelanggan.replace(prefix, ''), 10);
    const newIdNum = lastIdNum + 1;
    customer.id_pelanggan = prefix + newIdNum.toString().padStart(3, '0');
  } else {
    customer.id_pelanggan = prefix + '001';
  }
});

export default Customer;
