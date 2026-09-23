const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

// In-memory or fallback password check against ADMIN_DASHBOARD_PASSWORD (@Jeenash123)
exports.login = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Compare with configured admin password
    const isMatch = password === config.adminPassword;
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please verify your admin password.'
      });
    }

    // Generate JWT access token (15m expiry)
    const token = jwt.sign(
      { role: 'ADMIN', username: 'admin' },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Generate refresh token (7d expiry)
    const refreshToken = jwt.sign(
      { role: 'ADMIN', username: 'admin' },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: {
        username: 'admin',
        role: 'ADMIN'
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication'
    });
  }
};

exports.me = (req, res) => {
  return res.json({
    success: true,
    user: req.user
  });
};
