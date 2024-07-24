'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'cpf', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('usuarios', 'cnpj', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn('usuarios', 'possuiEmpresa', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn('usuarios', 'nomeEmpresa', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('usuarios', 'cpfCnpj');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'cpfCnpj', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.removeColumn('usuarios', 'cpf');
    await queryInterface.removeColumn('usuarios', 'cnpj');
    await queryInterface.removeColumn('usuarios', 'possuiEmpresa');
    await queryInterface.removeColumn('usuarios', 'nomeEmpresa');
  }
};
