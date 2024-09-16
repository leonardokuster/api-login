'use strict';
const { Model, DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('funcionarios', 'nacionalidade')
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('funcionarios', 'nacionalidade', {
      type: DataTypes.STRING,
      allowNull: true
    });
  }
};
