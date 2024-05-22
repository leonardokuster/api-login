const express = require("express");
const adminRoutes = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const AdminController = require('../controllers/adminController');

adminRoutes.use(adminAuth);

adminRoutes
    .get('/findUser', AdminController.buscarTodosUsuarios)
    .get('/findUser/id/:id', AdminController.buscarUsuarioPorCpfCnpj)
    .put('/modifyUser/id/:id', AdminController.editarUsuario)
    .delete('/deleteUser/id/:id', AdminController.deletarUsuarioPorCpfCnpj)

module.exports = adminRoutes