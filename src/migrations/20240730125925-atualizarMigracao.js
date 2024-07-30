'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('empresas', 'capital_social', {
      type: Sequelize.STRING
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('empresas', 'capital_social', {
      type: Sequelize.DECIMAL
    });
  }
};