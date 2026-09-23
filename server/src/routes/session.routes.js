const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All session routes require JWT authentication
router.use(authenticateToken);

router.get('/', sessionController.getSessions);
router.post('/create', sessionController.createSession);
router.delete('/:sessionId', sessionController.deleteSession);

module.exports = router;
