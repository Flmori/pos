import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  id_kategori: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  nama_kategori: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  deskripsi_kategori: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (category) => {
      if (!category.id_kategori) {
        // Generate new id_kategori with prefix CTGR- and zero-padded number
        const lastCategory = await Category.findOne({
          order: [['id_kategori', 'DESC']],
          where: {
            id_kategori: {
              [Op.like]: 'CTGR-%'
            }
          }
        });
        let newIdNumber = 1;
        if (lastCategory && lastCategory.id_kategori) {
          const lastNumber = parseInt(lastCategory.id_kategori.split('-')[1], 10);
          if (!isNaN(lastNumber)) {
            newIdNumber = lastNumber + 1;
          }
        }
        category.id_kategori = `CTGR-${String(newIdNumber).padStart(3, '0')}`;
      }
    }
  }
});

export default Category;
