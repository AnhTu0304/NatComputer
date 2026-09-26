const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/emailController');

router.post('/email/send-invoice', EmailController.sendInvoice);

module.exports = router;
