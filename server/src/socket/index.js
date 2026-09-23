const jwt = require('jsonwebtoken');
const config = require('../config');
const sessionManager = require('../whatsapp/sessionManager');

/**
 * Configures Socket.IO with authentication handshake and real-time events
 */
function initSocketIO(io) {
  sessionManager.setSocketIO(io);

  // Authenticate socket connection via JWT query/auth token
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      socket.user = decoded;
      next();
    } catch (err) {
      return next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Admin connected: ${socket.id} (user: ${socket.user?.username})`);

    // Send initial active sessions state
    socket.emit('session:list', sessionManager.getAllSessions());

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Admin disconnected: ${socket.id}`);
    });
  });
}

module.exports = {
  initSocketIO
};
