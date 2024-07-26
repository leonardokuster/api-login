'use strict';
const { Model } = require('sequelize');
const usuarios = require('./usuarios');
const funcionarios = require('./funcionarios');

module.exports = (sequelize, DataTypes) => {
  class empresas extends Model {
    static associate(models) {
      // Define association here
      empresas.belongsTo(models.usuarios, {foreignKey: 'usuario_id'});

      empresas.hasMany(models.funcionarios, { foreignKey: 'empresa_id' });
    }
  }
  empresas.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    razao_social: DataTypes.STRING,
    atividades_exercidas: DataTypes.STRING,
    capital_social: DataTypes.DECIMAL,
    endereco: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    nome_socios: DataTypes.JSONB,
    usuario_id: {
      type: Sequelize.UUID,
      references: {
          model: 'usuarios',
          key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'empresas', 
  });
  return empresas;
};