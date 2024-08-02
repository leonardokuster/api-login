'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class socios extends Model {
      static associate(models) {
        socios.belongsTo(models.empresas, {foreignKey: 'empresa_id'});
      }
    }
    socios.init({
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nomeSocio: {
        type: DataTypes.STRING,
        allowNull: false
      },
      cpfSocio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      emailSocio: {
        type: DataTypes.STRING,
        allowNull: true
      },
      telefoneSocio: {
        type: DataTypes.STRING,
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
      modelName: 'socios', 
      timestamps: false
    });
    return socios;
};