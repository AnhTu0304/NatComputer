const {
  hashPassword,
  comparePassword,
  generateToken,
  verifyJwtToken
} = require('./authMiddleware');

describe('Security & Authentication Module Tests', () => {
  test('hashPassword should hash plain password with bcrypt', async () => {
    const rawPass = 'Secret123!';
    const hashed = await hashPassword(rawPass);
    expect(hashed).toBeDefined();
    expect(hashed).not.toEqual(rawPass);
    expect(hashed.startsWith('$2')).toBeTruthy();
  });

  test('comparePassword should return true for correct password and false for wrong password', async () => {
    const rawPass = 'MyPass999';
    const hashed = await hashPassword(rawPass);
    const isMatch = await comparePassword(rawPass, hashed);
    const isWrong = await comparePassword('WrongPassword', hashed);

    expect(isMatch).toBe(true);
    expect(isWrong).toBe(false);
  });

  test('generateToken and verifyJwtToken should correctly sign and decode JWT payload', () => {
    const user = { id: 'usr_123', email: 'test@nat.vn', role: 'admin', name: 'Admin Nat' };
    const token = generateToken(user);
    expect(typeof token).toBe('string');

    const decoded = verifyJwtToken(token);
    expect(decoded.id).toEqual(user.id);
    expect(decoded.email).toEqual(user.email);
    expect(decoded.role).toEqual(user.role);
  });

  test('verifyJwtToken should return null for invalid or tampered token', () => {
    const invalidToken = 'invalid.jwt.token';
    const decoded = verifyJwtToken(invalidToken);
    expect(decoded).toBeNull();
  });

  test('verifyToken middleware should reject requests without Authorization header', () => {
    const { verifyToken } = require('./authMiddleware');
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  test('requireAdmin middleware should reject non-admin users with 403', () => {
    const { requireAdmin } = require('./authMiddleware');
    const req = { user: { role: 'customer' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    requireAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('requireAdmin middleware should allow admin users to proceed', () => {
    const { requireAdmin } = require('./authMiddleware');
    const req = { user: { role: 'admin' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    requireAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
