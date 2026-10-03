/**
 * Authentication Middleware for Tourism Management System
 * Validates JWT tokens for Users and Admins
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'tourism_jwt_secure_secret_key_change_in_production_2026';

/**
 * Verify logged in user or admin
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
}

/**
 * Verify Admin privileges
 */
function verifyAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ success: false, message: 'Access forbidden. Administrator rights required.' });
    }
  });
}

/**
 * Optional user middleware (doesn't fail if not logged in)
 */
function optionalUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return next();
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
  } catch (e) {
    // ignore invalid token for optional auth
  }
  next();
}

module.exports = {
  verifyToken,
  verifyAdmin,
  optionalUser,
  JWT_SECRET
};
