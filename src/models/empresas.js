'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class empresas extends Model {
    static associate(models) {
      empresas.belongsTo(models.usuarios, {foreignKey: 'usuario_id'});
      empresas.hasMany(models.funcionarios, { foreignKey: 'empresa_id' });
      empresas.hasMany(models.socios, { foreignKey: 'empresa_id' });
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
    nomeFantasia: {
      type: DataTypes.STRING,
      allowNull: false
    },
    razaoSocial: {
      type: DataTypes.STRING,
      allowNull: false
    },
    atividadesExercidas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    capitalSocial: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: false
    },
    endereco: {
      type: DataTypes.STRING,
      allowNull: false
    },
    numeroEmpresa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    complementoEmpresa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailEmpresa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telefoneEmpresa: {
      type: DataTypes.STRING,
      allowNull: false
    },
    qntSocios: {
      type: DataTypes.INTEGER,
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