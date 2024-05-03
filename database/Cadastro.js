const Sequelize = require("sequelize");
const connection = require("./database");

const Cadastro = connection.define('cadastros', {
  nome: {
    type: Sequelize.TEXT,
    allowNull: false
  },

  email: {
    type: Sequelize.TEXT,
    allowNull: false
  },

  senha: {
    type: Sequelize.STRING,
    allowNull: false
  },

  tipo: {
    type: Sequelize.STRING, 
    allowNull: false,
    defaultValue: 'normal'
  }
})

Cadastro.sync({force: false}).then(() => {});

module.exports = Cadastro;