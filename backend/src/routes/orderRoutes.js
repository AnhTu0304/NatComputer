const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');

router.post('/orders', OrderController.createOrder);
router.get('/orders/:id', OrderController.getOrderById);

module.exports = router;
