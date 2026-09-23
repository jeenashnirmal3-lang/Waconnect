const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.middleware');
const sessionManager = require('../whatsapp/sessionManager');

router.use(authenticateToken);

// Send message to remote JID via specified session
router.post('/send', async (req, res) => {
  try {
    const { sessionId, to, text } = req.body;
    if (!sessionId || !to || !text) {
      return res.status(400).json({ success: false, message: 'sessionId, to, and text are required' });
    }

    const session = sessionManager.getSession(sessionId);
    if (!session || !session.sock) {
      return res.status(400).json({ success: false, message: 'Session is not connected' });
    }

    // Format destination WhatsApp JID
    const cleanNumber = to.replace(/[^0-9]/g, '');
    const remoteJid = `${cleanNumber}@s.whatsapp.net`;

    const result = await session.sock.sendMessage(remoteJid, { text });
    return res.json({ success: true, message: 'Message queued and dispatched', data: result });
  } catch (err) {
    console.error('Send message error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
