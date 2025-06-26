import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';

const Role = sequelize.define('Role', {
  id_role: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  nama_role: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
}, {
  tableName: 'roles',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (role) => {
      if (!role.id_role) {
        // Generate new id_role with prefix RLS- and zero-padded number
        const lastRole = await Role.findOne({
          order: [['id_role', 'DESC']],
          where: {
            id_role: {
              [Op.like]: 'RLS-%'
            }
          }
        });
        let newIdNumber = 1;
        if (lastRole && lastRole.id_role) {
          const lastNumber = parseInt(lastRole.id_role.split('-')[1], 10);
          if (!isNaN(lastNumber)) {
            newIdNumber = lastNumber + 1;
          }
        }
        role.id_role = `RLS-${String(newIdNumber).padStart(3, '0')}`;
      }
    }
  }
});

export default Role;
