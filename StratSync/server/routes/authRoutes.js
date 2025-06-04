const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Ruta para login administrador
router.post('/admin-login', authController.adminLogin);

module.exports = router;
