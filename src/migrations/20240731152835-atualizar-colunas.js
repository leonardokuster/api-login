'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usuarios', 'cep');
    await queryInterface.removeColumn('usuarios', 'endereco');
    await queryInterface.removeColumn('usuarios', 'numeroCasa');
    await queryInterface.removeColumn('usuarios', 'complementoCasa');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'cep', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('usuarios', 'endereco', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('usuarios', 'numeroCasa', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('usuarios', 'complementoCasa', {
      type: Sequelize.STRING,
    });
  }
};
