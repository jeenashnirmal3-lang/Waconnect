const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

// In-memory or fallback rules
global.autoReplyRules = global.autoReplyRules || [];

router.get('/', (req, res) => {
  res.json({ success: true, data: global.autoReplyRules });
});

router.post('/', (req, res) => {
  const newRule = {
    id: 'rule-' + Date.now(),
    createdAt: new Date().toISOString(),
    triggerCount: 0,
    ...req.body
  };
  global.autoReplyRules.unshift(newRule);
  res.status(201).json({ success: true, data: newRule });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const idx = global.autoReplyRules.findIndex(r => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Rule not found' });
  }
  global.autoReplyRules[idx] = { ...global.autoReplyRules[idx], ...req.body };
  res.json({ success: true, data: global.autoReplyRules[idx] });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  global.autoReplyRules = global.autoReplyRules.filter(r => r.id !== id);
  res.json({ success: true, message: 'Rule deleted' });
});

module.exports = router;
