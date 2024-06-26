const express = require("express");
const publicRoutes = express.Router();
const SessionController = require('../controllers/sessionController');

publicRoutes
    .post('/login', SessionController.logarUsuario)
    .post('/signup', SessionController.cadastrarUsuario)

module.exports = publicRoutes