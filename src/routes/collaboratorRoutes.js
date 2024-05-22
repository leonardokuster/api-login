const express = require("express");
const collaboratorRoutes = express.Router();
const collaboratorAuth = require('../middlewares/collaboratorAuth');
const CollaboratorController = require('../controllers/adminController');

collaboratorRoutes.use(collaboratorAuth);

collaboratorRoutes
    .get('/findUser', CollaboratorController.buscarTodosUsuarios)
    .get('/findUser/id/:id', CollaboratorController.buscarUsuarioPorCpfCnpj)

module.exports = collaboratorRoutes