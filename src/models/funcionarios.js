'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class funcionarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      funcionarios.belongsTo(models.empresas, { foreignKey: 'empresa_id' });
      funcionarios.hasMany(models.dependentes, { foreignKey: 'funcionario_id' });
    }
  }
  funcionarios.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sexo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cor_etnia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_nascimento: {
      type: DataTypes.DATE,
      allowNull: false
    },
    local_nascimento: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nacionalidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orgao_expedidor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    data_rg: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero_casa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complemento_casa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bairro: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cidade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nome_mae: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nome_pai: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado_civil: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nome_conjuge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qnt_dependente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    escolaridade: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pis: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numero_ct: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_ct: {
      type: DataTypes.DATE,
      allowNull: false
    },
    carteira_digital: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    titulo_eleitoral: {
      type: DataTypes.STRING,
      allowNull: true
    },
    zona: {
      type: DataTypes.STRING,
      allowNull: true
    },
    secao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    funcao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data_admissao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    salario: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    contrato_experiencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    horarios: {
      type: DataTypes.STRING,
      allowNull: false
    },
    insalubridade: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    periculosidade: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    quebra_de_caixa: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    vale_transporte: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    quantidade_vales: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    empresa_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'empresas',  
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'funcionarios', 
    timestamps: false
  });
  return funcionarios;
};
