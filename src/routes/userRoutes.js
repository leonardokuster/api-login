const express = require("express");
const userRoutes = express.Router();
const userAuth = require('../middlewares/userAuth');
const UserController = require('../controllers/userController');

userRoutes.use(userAuth);

userRoutes
    .get('/home', UserController.index)

module.exports = userRoutes