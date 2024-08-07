'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {

    static associate(models) {
      usuarios.hasMany(models.empresas, { foreignKey: 'usuario_id' });
    }
  }
  usuarios.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: DataTypes.STRING,
    cpf: DataTypes.STRING,
    emailPessoal: DataTypes.STRING,
    telefonePessoal: DataTypes.STRING,
    dataNascimento: DataTypes.STRING,
    senha: DataTypes.STRING,
    tipo: DataTypes.STRING,
    possuiEmpresa: DataTypes.STRING,
    qntEmpresas: DataTypes.INTEGER,
    empresa_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'empresas',  
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'usuarios',
    timestamps: false
  });
  return usuarios;
};