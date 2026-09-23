const sessionManager = require('../whatsapp/sessionManager');

exports.getSessions = async (req, res) => {
  try {
    const list = sessionManager.getAllSessions();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createSession = async (req, res) => {
  try {
    const { sessionId, phoneNumber } = req.body;
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID is required' });
    }

    const session = await sessionManager.startSession(sessionId, phoneNumber);
    res.json({
      success: true,
      message: 'Session initialization triggered',
      data: {
        id: session.id,
        status: session.status,
        qr: session.qr,
        pairingCode: session.pairingCode
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    await sessionManager.stopSession(sessionId);
    res.json({ success: true, message: `Session ${sessionId} stopped` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
