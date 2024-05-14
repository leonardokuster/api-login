const express = require("express");
const adminRoutes = express.Router();
const adminAuth = require('../middlewares/adminAuth');
const AdminController = require('../controllers/adminController');

adminRoutes.use(adminAuth);

adminRoutes
    .post('/admin/cadastrar', AdminController.cadastrarUsuario)
    .get('/admin/home', AdminController.index)
    .get('/admin', AdminController.buscarTodosUsuarios)
    .get('/admin/id/:id', AdminController.buscarUsuarioPorId)
    .put('/admin/id/:id', AdminController.editarUsuario)
    .delete('/admin/id/:id', AdminController.deletarUsuarioPorId)

module.exports = adminRoutes