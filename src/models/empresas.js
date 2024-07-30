'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class empresas extends Model {
    static associate(models) {
      empresas.belongsTo(models.usuarios, {foreignKey: 'usuario_id'});
      empresas.hasMany(models.funcionarios, { foreignKey: 'empresa_id' });
    }
  }
  empresas.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    cnpj: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nome_fantasia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    razao_social: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atividades_exercidas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capital_social: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    endereco: {
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
    nome_socios: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
          model: 'usuarios',
          key: 'id'
      },
    },
  }, {
    sequelize,
    modelName: 'empresas', 
    timestamps: false
  });
  return empresas;
};