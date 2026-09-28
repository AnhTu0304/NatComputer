const { getBankConfig, generateVietQrUrl } = require('../services/vietqrHelper');
const OrderModel = require('../models/OrderModel');
const { notifyPaymentSuccess } = require('../services/socketManager');

class PaymentController {
  static getBankInfo(req, res) {
    const { amount, orderId } = req.query;
    const config = getBankConfig();
    const qrUrl = generateVietQrUrl({
      amount: amount || 0,
      orderId: orderId || ''
    });
    res.json({
      ...config,
      qrUrl
    });
  }

  static async simulateWebhook(req, res) {
    const { orderId, amount, transactionCode, bankCode } = req.body;
    if (!orderId) {
      return res.status(400).json({ error: 'orderId is required' });
    }

    const txnCode = transactionCode || 'SIM-' + Date.now();
    const result = await OrderModel.updatePaymentSuccess(orderId, txnCode);

    // Broadcast realtime socket event to customer room & admin room
    notifyPaymentSuccess(orderId, {
      amount: amount || result?.order?.totalAmount || 0,
      transactionCode: txnCode,
      bankCode: bankCode || 'MBBank'
    });

    res.json({
      success: true,
      message: `Thanh toán cho đơn hàng ${orderId} đã được xác nhận thành công (Realtime).`,
      orderId
    });
  }

  static async handleSepayWebhook(req, res) {
    // 1. Authenticate with SEPAY_API_KEY
    const configuredApiKey = process.env.SEPAY_API_KEY;
    if (configuredApiKey) {
      const authHeader = req.headers['authorization'] || '';
      const apiKeyFromHeader = authHeader.replace(/^(Apikey|Bearer)\s+/i, '').trim();
      const apiKeyFromQuery = req.query?.apiKey;
      const providedKey = apiKeyFromHeader || apiKeyFromQuery;

      if (!providedKey || providedKey !== configuredApiKey) {
        return res.status(401).json({ error: 'Unauthorized: Invalid SePay API Key' });
      }
    }

    // 2. Filter transaction direction (only process incoming money 'in')
    const {
      transferType,
      transferAmount,
      content,
      description,
      referenceCode,
      code,
      id,
      gateway
    } = req.body;

    if (transferType && transferType !== 'in') {
      return res.json({ success: true, message: 'Ignored outbound transfer' });
    }

    // 3. Extract Order ID from content or description
    const textToScan = `${content || ''} ${description || ''}`.trim();
    const match = textToScan.match(/NAT[-\s]*([0-9A-Za-z]+)/i);
    if (!match) {
      // Gracefully acknowledge SePay test webhook pings (e.g. from SePay dashboard "Gửi thử")
      if (textToScan.toLowerCase().includes('test') || id === 0 || !content) {
        return res.status(200).json({
          success: true,
          message: 'SePay webhook test ping received successfully.',
          isTest: true
        });
      }
      return res.status(400).json({ error: 'Không tìm thấy mã đơn hàng NAT trong nội dung giao dịch.' });
    }

    const possibleOrderId1 = `NAT-${match[1]}`;
    const possibleOrderId2 = `NAT ${match[1]}`;
    const possibleOrderId3 = match[0].trim();

    let order = await OrderModel.getById(possibleOrderId1);
    let matchedOrderId = possibleOrderId1;
    if (!order) {
      order = await OrderModel.getById(possibleOrderId2);
      if (order) matchedOrderId = possibleOrderId2;
    }
    if (!order) {
      order = await OrderModel.getById(possibleOrderId3);
      if (order) matchedOrderId = possibleOrderId3;
    }
    if (!order) {
      // Fallback: search all orders if ID format varies
      const allOrders = await OrderModel.getAll();
      const found = allOrders.find(o =>
        o.id.toUpperCase() === possibleOrderId1.toUpperCase() ||
        o.id.toUpperCase() === possibleOrderId3.toUpperCase() ||
        o.id.toUpperCase().includes(match[1].toUpperCase())
      );
      if (found) {
        order = await OrderModel.getById(found.id);
        matchedOrderId = found.id;
      }
    }

    if (!order) {
      if (textToScan.toLowerCase().includes('test') || match[1].toLowerCase().includes('test')) {
        return res.status(200).json({
          success: true,
          message: `SePay test webhook received successfully for simulated code: ${match[0]}`,
          isTest: true
        });
      }
      return res.status(404).json({ error: `Không tìm thấy đơn hàng tương ứng với mã ${match[0]}` });
    }

    // 4. Idempotency Check
    if (order.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        message: 'Order already processed',
        orderId: matchedOrderId
      });
    }

    // 5. Verify transfer amount
    const amount = parseFloat(transferAmount || 0);
    if (amount < (order.totalAmount || 0)) {
      return res.status(400).json({
        error: `Số tiền chuyển khoản không đủ (nhận ${amount}đ, cần ${order.totalAmount}đ).`
      });
    }

    // 6. Update payment success in database
    const txnCode = referenceCode || code || (id ? `SEPAY-${id}` : `TXN-${Date.now()}`);
    await OrderModel.updatePaymentSuccess(matchedOrderId, txnCode);

    // 7. Emit realtime socket event
    notifyPaymentSuccess(matchedOrderId, {
      amount,
      transactionCode: txnCode,
      bankCode: gateway || 'MBBank'
    });

    // 8. Auto-send invoice email asynchronously after 4s wait
    try {
      const { queueInvoiceEmailAsync } = require('../services/emailService');
      queueInvoiceEmailAsync({ ...order, totalAmount: amount, paymentStatus: 'PAID' }, 4000);
    } catch (e) {}

    return res.json({
      success: true,
      message: 'Xác nhận thanh toán SePay thành công.',
      orderId: matchedOrderId
    });
  }
}

module.exports = PaymentController;
