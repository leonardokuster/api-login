const express = require("express");
const adminRoutes = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const AdminController = require('../controllers/adminController');

adminRoutes.use(adminAuth);

adminRoutes
    .get('/admin/home', AdminController.index)
    .get('/admin', AdminController.buscarTodosUsuarios)
    .get('/admin/id/:id', AdminController.buscarUsuarioPorCpfCnpj)
    .put('/admin/id/:id', AdminController.editarUsuario)
    .delete('/admin/id/:id', AdminController.deletarUsuarioPorCpfCnpj)

module.exports = adminRoutes