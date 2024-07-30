'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('funcionarios', 'data_pis');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('funcionarios', 'data_pis', {
      type: Sequelize.DATE,
      allowNull: false,
    });
  }
};
