const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nat_computer_super_secure_jwt_secret_key_2026_@!';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Hash plain password with bcrypt salt rounds = 10
 */
async function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare plain password against hash
 * Also supports matching plain text if password wasn't hashed yet in legacy seed data
 */
async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  if (hashedPassword.startsWith('$2a$') || hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2y$')) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
  return plainPassword === hashedPassword;
}

/**
 * Generate signed JWT token
 */
function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role || 'customer'
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode JWT token string
 */
function verifyJwtToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

/**
 * Express middleware to verify Bearer Token in Authorization header
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Truy cập bị từ chối. Vui lòng cung cấp mã xác thực Bearer Token.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyJwtToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Mã xác thực không hợp lệ hoặc đã hết hạn.' });
  }

  req.user = decoded;
  next();
}

/**
 * Express middleware to require admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Bạn không có quyền truy cập khu vực quản trị (Admin Only).' });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  hashPassword,
  comparePassword,
  generateToken,
  verifyJwtToken,
  verifyToken,
  requireAdmin
};
