const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * Middleware to verify JWT Bearer token
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required'
    });
  }

  jwt.verify(token, config.jwt.secret, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Invalid or expired token'
      });
    }

    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken
};
