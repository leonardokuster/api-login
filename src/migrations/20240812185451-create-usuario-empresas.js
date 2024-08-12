'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('UsuarioEmpresas', {
      usuario_id: {
        type: Sequelize.UUID,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        allowNull: false
      },
      empresa_id: {
        type: Sequelize.UUID,
        references: {
          model: 'empresas',
          key: 'id'
        },
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('UsuarioEmpresas');
  }
};
