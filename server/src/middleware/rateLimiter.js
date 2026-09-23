const rateLimit = require('express-rate-limit');
const config = require('../config');

// Rate limiter for admin login endpoint (max 5 attempts per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: config.rateLimits.loginWindowMs,
  max: config.rateLimits.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again after 15 minutes for security protection.'
  }
});

// General API rate limiter (120 requests per minute)
const apiLimiter = rateLimit({
  windowMs: config.rateLimits.apiWindowMs,
  max: config.rateLimits.apiMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Rate limit exceeded.'
  }
});

module.exports = {
  loginLimiter,
  apiLimiter
};
