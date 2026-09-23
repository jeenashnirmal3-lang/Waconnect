const { createBaileysSession } = require('./baileys');
const { handleIncomingMessage } = require('./messageHandler');

class SessionManager {
  constructor() {
    this.sessions = new Map(); // sessionId -> { sock, status, qr, pairingCode, metadata }
    this.io = null;
  }

  setSocketIO(io) {
    this.io = io;
  }

  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  async startSession(sessionId, phoneForPairing = null) {
    if (this.sessions.has(sessionId)) {
      const existing = this.sessions.get(sessionId);
      if (existing.status === 'connected') {
        return existing;
      }
    }

    const sessionState = {
      id: sessionId,
      status: 'connecting',
      qr: null,
      pairingCode: null,
      phoneNumber: phoneForPairing || null,
      sock: null
    };

    this.sessions.set(sessionId, sessionState);
    this.broadcast('session:status', { sessionId, status: 'connecting' });

    try {
      const instance = await createBaileysSession(sessionId, {
        onQR: (qrDataUrl, rawQR) => {
          sessionState.qr = qrDataUrl;
          sessionState.status = 'waiting_qr';
          this.broadcast('session:qr', { sessionId, qr: qrDataUrl });
        },
        onConnected: (info) => {
          sessionState.status = 'connected';
          sessionState.qr = null;
          sessionState.pairingCode = null;
          sessionState.phoneNumber = info.phoneNumber;
          this.broadcast('session:status', {
            sessionId,
            status: 'connected',
            phoneNumber: info.phoneNumber,
            platform: info.platform
          });
        },
        onDisconnected: ({ reason, loggedOut }) => {
          sessionState.status = loggedOut ? 'disconnected' : 'connecting';
          this.broadcast('session:status', {
            sessionId,
            status: sessionState.status,
            reason
          });
        },
        onMessage: async (m, sock) => {
          await handleIncomingMessage(m, sessionId, sock, this.io);
        }
      });

      sessionState.sock = instance.sock;

      // If user requested pairing code instead of QR code
      if (phoneForPairing) {
        // slight pause to allow connection handshake
        setTimeout(async () => {
          try {
            const code = await instance.requestPairingCode(phoneForPairing);
            sessionState.pairingCode = code;
            this.broadcast('session:pairing_code', { sessionId, code });
          } catch (err) {
            console.error(`[SessionManager] Pairing code failed:`, err);
            this.broadcast('session:error', { sessionId, message: 'Failed to request pairing code' });
          }
        }, 1500);
      }

      return sessionState;
    } catch (err) {
      console.error(`[SessionManager] Error starting session ${sessionId}:`, err);
      sessionState.status = 'error';
      this.broadcast('session:status', { sessionId, status: 'error', error: err.message });
      throw err;
    }
  }

  async stopSession(sessionId) {
    const session = this.sessions.get(sessionId);
    if (session && session.sock) {
      try {
        await session.sock.logout();
      } catch (e) {
        // ignore
      }
      session.status = 'disconnected';
      this.broadcast('session:status', { sessionId, status: 'disconnected' });
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  getAllSessions() {
    return Array.from(this.sessions.values()).map(s => ({
      id: s.id,
      status: s.status,
      phoneNumber: s.phoneNumber,
      hasQr: !!s.qr,
      hasPairingCode: !!s.pairingCode
    }));
  }
}

module.exports = new SessionManager();
