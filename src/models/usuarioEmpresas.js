'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UsuarioEmpresas extends Model {
    static associate(models) {

    }
  }
  UsuarioEmpresas.init({
    usuario_id: {
      type: DataTypes.UUID,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    },
    empresa_id: {
      type: DataTypes.UUID,
      references: {
        model: 'empresas',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'UsuarioEmpresas',
    timestamps: false
  });
  return UsuarioEmpresas;
};
