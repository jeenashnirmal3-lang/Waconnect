const express = require('express');
const http = require('http');
const helmet = require('helmet');
const cors = require('cors');
const { Server } = require('socket.io');
const config = require('./config');
const { apiLimiter } = require('./middleware/rateLimiter');
const { initSocketIO } = require('./socket');

// Route imports
const authRoutes = require('./routes/auth.routes');
const sessionRoutes = require('./routes/session.routes');
const chatRoutes = require('./routes/chat.routes');
const rulesRoutes = require('./routes/rules.routes');
const contactsRoutes = require('./routes/contacts.routes');
const logsRoutes = require('./routes/logs.routes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: [config.clientUrl, 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

initSocketIO(io);

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Allows flexible cross-origin assets for WhatsApp QR/avatars
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: [config.clientUrl, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general API rate limiting
app.use('/api/', apiLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Jeenash WA Platform'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rules', rulesRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/logs', logsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    success: false,
    message: config.env === 'production' ? 'Internal server error' : err.message
  });
});

// Start Server
server.listen(config.port, () => {
  console.log(`===============================================`);
  console.log(`🚀 Jeenash WA Backend Server running on port ${config.port}`);
  console.log(`📡 Environment: ${config.env}`);
  console.log(`🌐 Authorized Client: ${config.clientUrl}`);
  console.log(`===============================================`);
});

// Graceful Shutdown
const shutdown = () => {
  console.log('\nReceived kill signal. Closing connections gracefully...');
  server.close(() => {
    console.log('HTTP & WebSocket server closed.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = { app, server };
