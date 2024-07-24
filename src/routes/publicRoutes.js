const express = require("express");
const publicRoutes = express.Router();
const SessionController = require('../controllers/sessionController');
const taxController = require('../controllers/taxController');
const companyController = require('../controllers/companyController');
const employeeController = require('../controllers/employeeController');

publicRoutes
    .post('/login', SessionController.logarUsuario)
    .post('/signup', SessionController.cadastrarUsuario)
    .post('/calculate', taxController.calculateTax)
    .post('/companies', companyController.createCompany) 
    .post('/employees', employeeController.createEmployee); 

module.exports = publicRoutes;