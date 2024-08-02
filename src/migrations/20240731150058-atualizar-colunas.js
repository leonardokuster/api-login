'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('usuarios', 'email', 'emailPessoal');
    await queryInterface.renameColumn('usuarios', 'telefone', 'telefonePessoal');
    await queryInterface.removeColumn('usuarios', 'nomeEmpresa');
    await queryInterface.removeColumn('usuarios', 'cnpj');
    await queryInterface.removeColumn('usuarios', 'createdAt');
    await queryInterface.removeColumn('usuarios', 'updatedAt');
    
    await queryInterface.renameColumn('empresas', 'razao_social', 'razaoSocial');
    await queryInterface.renameColumn('empresas', 'nome_fantasia', 'nomeFantasia');
    await queryInterface.renameColumn('empresas', 'atividades_exercidas', 'atividadesExercidas');
    await queryInterface.renameColumn('empresas', 'capital_social', 'capitalSocial');
    await queryInterface.renameColumn('empresas', 'email', 'emailEmpresa');
    await queryInterface.renameColumn('empresas', 'telefone', 'telefoneEmpresa');
    await queryInterface.renameColumn('empresas', 'nome_socios', 'nomeSocio');
    await queryInterface.addColumn('empresas', 'cep', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('empresas', 'numeroEmpresa', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('empresas', 'complementoEmpresa', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('empresas', 'qntSocios', {
      type: Sequelize.STRING,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'nomeEmpresa', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('usuarios', 'cnpj', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('usuarios', 'createdAt');
    await queryInterface.addColumn('usuarios', 'updatedAt');
    await queryInterface.renameColumn('usuarios', 'emailPessoal', 'email');
    await queryInterface.renameColumn('usuarios', 'telefonePessoal', 'telefone');
    await queryInterface.renameColumn('empresas', 'razaoSocial', 'razao_social');
    await queryInterface.renameColumn('empresas', 'nomeFantasia', 'nome_fantasia');
    await queryInterface.renameColumn('empresas', 'atividadesExercidas', 'atividades_exercidas');
    await queryInterface.renameColumn('empresas', 'capitalSocial', 'capital_social');
    await queryInterface.renameColumn('empresas', 'emailEmpresa', 'email');
    await queryInterface.renameColumn('empresas', 'telefoneEmpresa', 'telefone');
    await queryInterface.renameColumn('empresas', 'nomeSocio', 'nome_socios');
    await queryInterface.removeColumn('empresas', 'cep');
    await queryInterface.removeColumn('empresas', 'numeroEmpresa');
    await queryInterface.removeColumn('empresas', 'complementoEmpresa');
    await queryInterface.removeColumn('empresas', 'qntSocios');

    
  }
};
