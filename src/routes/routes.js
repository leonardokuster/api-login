const express = require('express');
const adminRoutes = require('./adminRoutes');
const collaboratorRoutes = require('./collaboratorRoutes');
const userRoutes = require('./userRoutes');
const publicRoutes = require('./publicRoutes');

const router = express.Router();

router.use(adminRoutes);
router.use(collaboratorRoutes);
router.use(userRoutes);
router.use(publicRoutes);

module.exports = router