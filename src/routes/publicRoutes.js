const express = require("express");
const publicRoutes = express.Router();
const SessionController = require('../controllers/sessionController');
const SessionValidations = require('../validations/sessionValidations'); 

const sessionValidations = new SessionValidations(); 

publicRoutes
    .post('/login', SessionController.logarUsuario)
    .post('/signup', SessionController.cadastrarUsuario)

module.exports = publicRoutes