'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresas', 'usuario_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    });

    await queryInterface.addColumn('usuarios', 'empresa_id', {
      type: Sequelize.UUID,
      allowNull: true,
      references: {
        model: 'empresas', 
        key: 'id'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'empresa_id');
    await queryInterface.removeColumn('empresas', 'usuario_id');
  }
};
