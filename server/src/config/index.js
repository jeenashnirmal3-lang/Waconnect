require('dotenv').config();
const path = require('path');

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  adminPassword: process.env.ADMIN_DASHBOARD_PASSWORD || '@Jeenash123',
  jwt: {
    secret: process.env.JWT_SECRET || 'jeenash_wa_super_secret_jwt_key_2026',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'jeenash_wa_refresh_key_2026',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  clientUrl: process.env.CLIENT_URL || 'https://wa.jeenashera.online',
  sessionPath: path.resolve(process.env.SESSION_PATH || './sessions'),
  uploadPath: path.resolve(process.env.UPLOAD_PATH || './uploads'),
  logDir: path.resolve(process.env.LOG_DIR || './logs'),
  logLevel: process.env.LOG_LEVEL || 'info',
  rateLimits: {
    loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
    loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '5', 10),
    apiWindowMs: parseInt(process.env.API_RATE_LIMIT_WINDOW_MS || '60000', 10),     // 1 min
    apiMax: parseInt(process.env.API_RATE_LIMIT_MAX || '120', 10)
  }
};
