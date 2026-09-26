const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/register', authLimiter, AuthController.register);
router.post('/login', authLimiter, AuthController.login);
router.get('/me', verifyToken, AuthController.getMe);
router.post('/google', AuthController.googleAuth);

module.exports = router;
