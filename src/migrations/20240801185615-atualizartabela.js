'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('socios', 'nome', 'nomeSocio');
    await queryInterface.renameColumn('socios', 'cpf', 'cpfSocio');
    await queryInterface.renameColumn('socios', 'email', 'emailSocio');
    await queryInterface.renameColumn('socios', 'telefone', 'telefoneSocio');

    await queryInterface.removeColumn('empresas', 'nomeSocio');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('empresas', 'nomeSocio');

    await queryInterface.renameColumn('socios', 'nomeSocio', 'nome');
    await queryInterface.renameColumn('socios', 'cpfSocio', 'cpf');
    await queryInterface.renameColumn('socios', 'emailSocio', 'email');
    await queryInterface.renameColumn('socios', 'telefoneSocio', 'telefone');
  }
};
