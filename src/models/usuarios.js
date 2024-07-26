'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      usuarios.hasOne(models.empresas, { foreignKey: 'usuario_id' });
    }
  }
  usuarios.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    telefone: DataTypes.STRING,
    cpf: DataTypes.STRING,
    possuiEmpresa: DataTypes.STRING,
    cnpj: DataTypes.STRING,
    nomeEmpresa: DataTypes.STRING,
    cep: DataTypes.STRING,
    endereco: DataTypes.STRING,
    numeroCasa: DataTypes.STRING,
    complementoCasa: DataTypes.STRING,
    dataNascimento: DataTypes.STRING,
    senha: DataTypes.STRING,
    tipo: DataTypes.STRING,
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
  });
  return usuarios;
};