'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id_user: {
        type: Sequelize.STRING(10),
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      nama_lengkap: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      id_role: {
        type: Sequelize.STRING(10),
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id_role'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
