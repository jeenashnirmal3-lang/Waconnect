const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginLimiter } = require('../middleware/rateLimiter');
const { authenticateToken } = require('../middleware/auth.middleware');

// POST /api/auth/login (rate limited)
router.post('/login', loginLimiter, authController.login);

// GET /api/auth/me (protected)
router.get('/me', authenticateToken, authController.me);

module.exports = router;
