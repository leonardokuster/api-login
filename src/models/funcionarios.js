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
    }
  }
  funcionarios.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    sexo: DataTypes.STRING,
    cor_etnia: DataTypes.STRING,
    data_nascimento: DataTypes.DATE,
    local_nascimento: DataTypes.STRING,
    nacionalidade: DataTypes.STRING,
    cpf: DataTypes.STRING,
    rg: DataTypes.STRING,
    orgao_expedidor: DataTypes.STRING,
    data_rg: DataTypes.DATE,
    cep: DataTypes.STRING,
    endereco: DataTypes.STRING,
    numero_casa: DataTypes.STRING,
    complemento_casa: DataTypes.STRING,
    bairro: DataTypes.STRING,
    cidade: DataTypes.STRING,
    estado: DataTypes.STRING,
    nome_mae: DataTypes.STRING,
    nome_pai: DataTypes.STRING,
    estado_civil: DataTypes.STRING,
    nome_conjuge: DataTypes.STRING,
    qnt_dependente: DataTypes.INTEGER,
    dependentes: DataTypes.JSONB,
    escolaridade: DataTypes.STRING,
    pis: DataTypes.STRING,
    data_pis: DataTypes.DATE,
    numero_ct: DataTypes.STRING,
    serie: DataTypes.STRING,
    data_ct: DataTypes.DATE,
    carteira_digital: DataTypes.BOOLEAN,
    titulo_eleitoral: DataTypes.STRING,
    zona: DataTypes.STRING,
    secao: DataTypes.STRING,
    funcao: DataTypes.STRING,
    data_admissao: DataTypes.DATE,
    salario: DataTypes.DECIMAL,
    contrato_experiencia: DataTypes.STRING,
    horarios: DataTypes.STRING,
    insalubridade: DataTypes.BOOLEAN,
    periculosidade: DataTypes.BOOLEAN,
    quebra_de_caixa: DataTypes.BOOLEAN,
    vale_transporte: DataTypes.BOOLEAN,
    quantidade_vales: DataTypes.INTEGER,
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
  });
  return funcionarios;
};
