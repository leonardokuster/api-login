'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('funcionarios', {
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
      sexo: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cor_etnia: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_nascimento: {
        type: Sequelize.DATE,
        allowNull: false
      },
      local_nascimento: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nacionalidade: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: false
      },
      rg: {
        type: Sequelize.STRING
      },
      orgao_expedidor: {
        type: Sequelize.STRING
      },
      data_rg: {
        type: Sequelize.DATE
      },
      cep: {
        type: Sequelize.STRING,
        allowNull: false
      },
      endereco: {
        type: Sequelize.STRING,
        allowNull: false
      },
      numero_casa: {
        type: Sequelize.STRING,
        allowNull: false
      },
      complemento_casa: {
        type: Sequelize.STRING
      },
      bairro: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cidade: {
        type: Sequelize.STRING,
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome_mae: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome_pai: {
        type: Sequelize.STRING
      },
      estado_civil: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nome_conjuge: {
        type: Sequelize.STRING
      },
      qnt_dependente: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      dependentes: {
        type: Sequelize.JSONB
      },
      escolaridade: {
        type: Sequelize.STRING,
        allowNull: false
      },
      pis: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_pis: {
        type: Sequelize.DATE,
        allowNull: false
      },
      numero_ct: {
        type: Sequelize.STRING,
        allowNull: false
      },
      serie: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_ct: {
        type: Sequelize.DATE,
        allowNull: false
      },
      carteira_digital: {
        type: Sequelize.BOOLEAN
      },
      titulo_eleitoral: {
        type: Sequelize.STRING
      },
      zona: {
        type: Sequelize.STRING
      },
      secao: {
        type: Sequelize.STRING
      },
      funcao: {
        type: Sequelize.STRING,
        allowNull: false
      },
      data_admissao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      salario: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      contrato_experiencia: {
        type: Sequelize.STRING
      },
      horarios: {
        type: Sequelize.STRING,
        allowNull: false
      },
      insalubridade: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      periculosidade: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      quebra_de_caixa: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      vale_transporte: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      quantidade_vales: {
        type: Sequelize.INTEGER
      },
      empresa_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'empresas',
          key: 'id'
        }
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
    await queryInterface.dropTable('funcionarios');
  }
};
