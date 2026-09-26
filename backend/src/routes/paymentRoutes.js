const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');

router.get('/payment/bank-info', PaymentController.getBankInfo);
router.post('/payment/simulate-webhook', PaymentController.simulateWebhook);
router.post('/payment/webhook', PaymentController.handleSepayWebhook);

module.exports = router;
