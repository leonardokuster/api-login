'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('empresas', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      nome: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/
        }
      },
      razao_social: {
        type: Sequelize.STRING,
        allowNull: false
      },
      atividades_exercidas: {
        type: Sequelize.STRING,
        allowNull: false
      },
      capital_social: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      telefone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome_socios: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('empresas');
  }
};
