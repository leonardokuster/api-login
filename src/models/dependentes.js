'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class dependentes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define association here
      dependentes.belongsTo(models.funcionarios, { foreignKey: 'funcionario_id' });
    }
  }
  dependentes.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nomeDependente: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dataNascimentoDependente: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    cpfDependente: {
      type: DataTypes.STRING(14),
      unique: true,
      allowNull: false,
    },
    localNascimentoDependente: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    funcionario_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'funcionarios', 
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'dependentes',
    timestamps: false
  });
  return dependentes;
};
