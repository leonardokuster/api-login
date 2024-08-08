const express = require("express");
const publicRoutes = express.Router();
const SessionController = require('../controllers/sessionController');
const CompanyController = require('../controllers/companyController');
const EmployeeController = require('../controllers/employeeController');
const taxController = require('../controllers/taxController');


publicRoutes
    .post('/login', SessionController.logarUsuario)
    .post('/signup', SessionController.cadastrarUsuario)
    .get('/users/:usuario_id', SessionController.buscarUsuario);

publicRoutes
    .post('/companies/:usuario_id', CompanyController.criarEmpresa)
    .get('/companies/:usuario_id', CompanyController.buscarEmpresa)
    .put('/companies/:usuario_id', CompanyController.editarEmpresa);

publicRoutes
    .post('/employees/:empresa_id', EmployeeController.cadastrarFuncionario)
    .get('/employees/:empresa_id', EmployeeController.buscarFuncionario)
    .put('/employees/:empresa_id', EmployeeController.editarFuncionario);

publicRoutes
    .post('/calculate', taxController.calculateTax);

module.exports = publicRoutes;
