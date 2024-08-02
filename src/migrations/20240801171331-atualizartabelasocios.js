'use strict';
const { Model, DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('socios', 'empresa_id', {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'empresas',  
        key: 'id',
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('socios', 'empresa_id');
  }
};
