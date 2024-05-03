const Sequelize = require("sequelize");
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

let connection;
if (config.use_env_variable) {
    connection = new Sequelize(process.env[config.use_env_variable], config, {
      dialectModule: require('pg')
    });
} else {
    connection = new Sequelize(config.database, config.username, config.password, config, {
      dialectModule: require('pg')
    });
}

module.exports = connection;
