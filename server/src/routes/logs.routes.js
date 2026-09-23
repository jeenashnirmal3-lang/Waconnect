const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

global.systemLogs = global.systemLogs || [];

router.get('/', (req, res) => {
  res.json({ success: true, data: global.systemLogs });
});

router.delete('/clear', (req, res) => {
  global.systemLogs = [];
  res.json({ success: true, message: 'Logs cleared successfully' });
});

module.exports = router;
