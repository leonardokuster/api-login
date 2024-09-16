'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class funcionarios extends Model {

    static associate(models) {
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
    corEtnia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataNascimento: {
      type: DataTypes.STRING,
      allowNull: false
    },
    localNascimento: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true 
    },
    rg: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orgaoExpedidor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataRg: {
      type: DataTypes.STRING,
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
    numeroCasa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complementoCasa: {
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
    nomeMae: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomePai: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estadoCivil: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nomeConjuge: {
      type: DataTypes.STRING,
      allowNull: true
    },
    qntDependente: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
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
    numeroCt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dataCt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    carteiraDigital: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    tituloEleitoral: {
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
    dataAdmissao: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salario: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    contratoExperiencia: {
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
    quebraDeCaixa: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    valeTransporte: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    quantidadeVales: {
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
