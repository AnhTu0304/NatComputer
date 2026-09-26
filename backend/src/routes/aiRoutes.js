const express = require('express');
const router = express.Router();
const AiController = require('../controllers/aiController');

// Public AI Chatbot endpoint
router.post('/chat', AiController.chat);

module.exports = router;
