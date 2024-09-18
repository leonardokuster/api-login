const express = require('express');
const publicRoutes = require('./publicRoutes');

const router = express.Router();

router.use(publicRoutes);

module.exports = router