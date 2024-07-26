const express = require("express");
const publicRoutes = express.Router();
const SessionController = require('../controllers/sessionController');
const CompanyController = require('../controllers/companyController');
const EmployeeController = require('../controllers/employeeController');
const taxController = require('../controllers/taxController');

publicRoutes
    .post('/login', SessionController.logarUsuario)
    .post('/signup', SessionController.cadastrarUsuario)
    .post('/companies', CompanyController.criarEmpresa)
    .get('/companies', CompanyController.buscarEmpresa) 
    .put('/companies/:id', CompanyController.editarEmpresa) 
    .post('/employees', EmployeeController.cadastrarFuncionario)
    .put('/employees/:id', EmployeeController.editarFuncionario) 
    .post('/calculate', taxController.calculateTax);

module.exports = publicRoutes;
