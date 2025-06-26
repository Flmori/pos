import { DataTypes, Op } from 'sequelize';
import sequelize from '../config/database.js';
import bcrypt from 'bcryptjs';
import Role from './Role.js';

const User = sequelize.define('User', {
  id_user: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  nama_lengkap: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  id_role: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: Role,
      key: 'id_role',
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      isEmail: true,
    },
  },
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: async (user) => {
      if (!user.id_user) {
        // Generate new id_user with prefix USRS- and zero-padded number
        const lastUser = await User.findOne({
          order: [['id_user', 'DESC']],
          where: {
            id_user: {
              [Op.like]: 'USRS-%'
            }
          }
        });
        let newIdNumber = 1;
        if (lastUser && lastUser.id_user) {
          const lastNumber = parseInt(lastUser.id_user.split('-')[1], 10);
          if (!isNaN(lastNumber)) {
            newIdNumber = lastNumber + 1;
          }
        }
        user.id_user = `USRS-${String(newIdNumber).padStart(3, '0')}`;
      }
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

User.belongsTo(Role, { foreignKey: 'id_role' });

export default User;
