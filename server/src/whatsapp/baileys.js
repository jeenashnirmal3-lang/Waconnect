const {
  default: makeWASocket,
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const config = require('../config');

// Ensure sessions directory exists with secure permissions (chmod 700)
if (!fs.existsSync(config.sessionPath)) {
  fs.mkdirSync(config.sessionPath, { recursive: true, mode: 0o700 });
}

/**
 * Initializes a Baileys WhatsApp client instance for a given session ID
 * @param {string} sessionId Unique ID for session
 * @param {Object} options Configuration callbacks: onQR, onPairingCode, onConnected, onDisconnected, onMessage
 * @returns {Promise<Object>} Socket object and control methods
 */
async function createBaileysSession(sessionId, options = {}) {
  const sessionDir = path.join(config.sessionPath, sessionId);
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true, mode: 0o700 });
  }

  // Multi-file auth state stores auth keys and creds in the session directory
  const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  const logger = pino({ level: 'silent' });

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ['Jeenash WA Platform', 'Chrome', '122.0.0.0'],
    syncFullHistory: false,
    markOnlineOnConnect: true,
    connectTimeoutMs: 60000,
    keepAliveIntervalMs: 25000,
    generateHighQualityLinkPreview: true
  });

  // Automatically persist credentials whenever updated
  sock.ev.on('creds.update', saveCreds);

  // Connection state updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      try {
        const qrDataUrl = await qrcode.toDataURL(qr);
        if (options.onQR) {
          options.onQR(qrDataUrl, qr);
        }
      } catch (err) {
        console.error(`[Session ${sessionId}] QR generation failed:`, err);
      }
    }

    if (connection === 'close') {
      const statusCode = (lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.warn(`[Session ${sessionId}] Connection closed (code: ${statusCode}). Reconnect: ${shouldReconnect}`);

      if (options.onDisconnected) {
        options.onDisconnected({
          reason: statusCode,
          loggedOut: !shouldReconnect
        });
      }

      if (shouldReconnect) {
        // Natural exponential backoff reconnect
        await delay(3000);
        createBaileysSession(sessionId, options);
      } else {
        // Clean session folder if permanently logged out
        try {
          fs.rmSync(sessionDir, { recursive: true, force: true });
        } catch (e) {
          // ignore
        }
      }
    } else if (connection === 'open') {
      console.log(`[Session ${sessionId}] Connected successfully!`);
      const userJid = sock.user?.id || '';
      const phoneNumber = userJid.split(':')[0] || userJid.split('@')[0];

      if (options.onConnected) {
        options.onConnected({
          jid: userJid,
          phoneNumber,
          platform: 'Baileys Multi-Device v' + version.join('.')
        });
      }
    }
  });

  // Handle incoming messages
  sock.ev.on('messages.upsert', async (m) => {
    if (options.onMessage) {
      options.onMessage(m, sock);
    }
  });

  return {
    sock,
    sessionId,
    requestPairingCode: async (phoneNumber) => {
      // Baileys pairing code method
      const cleaned = phoneNumber.replace(/[^0-9]/g, '');
      const code = await sock.requestPairingCode(cleaned);
      return code;
    },
    logout: async () => {
      try {
        await sock.logout();
      } catch (e) {
        // ignore
      }
    }
  };
}

module.exports = {
  createBaileysSession
};
