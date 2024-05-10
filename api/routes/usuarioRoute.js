const express = require("express");
const router = express.Router();
const UsuarioController = require('../controllers/usuarioController');

router
    .post('/usuario/login', UsuarioController.logarUsuario)
    .post('/usuario/cadastrar', UsuarioController.cadastrarUsuario)
    .get('/usuario', UsuarioController.buscarTodosUsuarios)
    .get('/usuario/id/:id', UsuarioController.buscarUsuarioPorId)
    .put('/usuario/id/:id', UsuarioController.editarUsuario)
    .delete('/usuario/id/:id', UsuarioController.deletarUsuarioPorId)

module.exports = router