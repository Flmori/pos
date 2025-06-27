import sequelize from '../config/database.js';
import { DataTypes } from 'sequelize';

import User from './User.js';
import Role from './Role.js';
import Category from './Category.js';
import Product from './Product.js';
import Customer from './Customer.js';
import Sale from './Sale.js';
import ReceivingTransaction from './ReceivingTransaction.js';
import ReceivingItem from './ReceivingItem.js';

// Define associations here

// User and Role
Role.hasMany(User, { foreignKey: 'roleId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

// ReceivingTransaction associations
ReceivingTransaction.belongsTo(User, { foreignKey: 'id_pegawai_gudang' });
ReceivingTransaction.hasMany(ReceivingItem, { foreignKey: 'id_penerimaan' });

// ReceivingItem associations
ReceivingItem.belongsTo(ReceivingTransaction, { foreignKey: 'id_penerimaan' });
ReceivingItem.belongsTo(Product, { foreignKey: 'id_barang' });

// Product associations
Category.hasMany(Product, { foreignKey: 'id_kategori' });
Product.belongsTo(Category, { foreignKey: 'id_kategori' });

// Customer and Sale associations
Customer.hasMany(Sale, { foreignKey: 'customerId' });
Sale.belongsTo(Customer, { foreignKey: 'customerId' });

// Export models and sequelize instance
export {
  sequelize,
  User,
  Role,
  Category,
  Product,
  Customer,
  Sale,
  ReceivingTransaction,
  ReceivingItem,
};
