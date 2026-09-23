const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');

router.use(authenticateToken);

global.contactsList = global.contactsList || [];

router.get('/', (req, res) => {
  res.json({ success: true, data: global.contactsList });
});

router.post('/', (req, res) => {
  const newContact = {
    id: 'contact-' + Date.now(),
    createdAt: new Date().toISOString(),
    isWhitelisted: false,
    isBlacklisted: false,
    ...req.body
  };
  global.contactsList.push(newContact);
  res.status(201).json({ success: true, data: newContact });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const idx = global.contactsList.findIndex(c => c.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Contact not found' });
  }
  global.contactsList[idx] = { ...global.contactsList[idx], ...req.body };
  res.json({ success: true, data: global.contactsList[idx] });
});

module.exports = router;
