const OrderModel = require('../models/OrderModel');
const NotificationModel = require('../models/NotificationModel');
const { sendInvoiceEmail, queueInvoiceEmailAsync } = require('../services/emailService');
const { notifyNewOrder } = require('../services/socketManager');

class OrderController {
  static async createOrder(req, res) {
    const {
      orderId: clientOrderId,
      customerName,
      name,
      customerEmail,
      email,
      customerPhone,
      phone,
      shippingAddress,
      customerAddress,
      paymentMethod,
      totalAmount,
      totalPrice,
      items = [],
      discountAmount,
      appliedCoupon
    } = req.body;

    const finalAmount = parseFloat(totalAmount || totalPrice || 0);
    if (!finalAmount) {
      return res.status(400).json({ error: 'Tổng giá trị đơn hàng là bắt buộc.' });
    }

    const orderId = clientOrderId || 'NAT-' + Math.floor(100000 + Math.random() * 900000);
    const finalName = customerName || name || 'Quý khách hàng';
    const finalPhone = customerPhone || phone || '0886976868';
    const finalAddress = shippingAddress || customerAddress || '456 Trần Duy Hưng, Cầu Giấy, Hà Nội';
    const finalMethod = paymentMethod || 'Chuyển khoản QR';
    const finalEmail = customerEmail || email || 'khachhang@natcomputer.vn';

    const newOrder = {
      id: orderId,
      customerName: finalName,
      customerEmail: finalEmail,
      customerPhone: finalPhone,
      shippingAddress: finalAddress,
      paymentMethod: finalMethod,
      paymentStatus: 'PAID',
      status: 'PROCESSING',
      totalAmount: finalAmount,
      totalPrice: finalAmount,
      appliedCoupon: appliedCoupon || null,
      discountAmount: discountAmount || 0,
      items: items,
      createdAt: new Date().toISOString()
    };

    const newPayment = {
      id: 'pay_' + Date.now(),
      orderId: orderId,
      gateway: finalMethod,
      transactionCode: 'TXN_' + Math.floor(1000000 + Math.random() * 9000000),
      amount: finalAmount,
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    };

    // Save order and payment
    await OrderModel.create({
      order: newOrder,
      payment: newPayment,
      items,
      appliedCoupon
    });

    // Auto-generate order notification
    const notiId = 'noti_' + Date.now();
    const notiTitle = `🔔 Đơn Đặt Hàng Mới #${orderId}!`;
    const notiMsg = `Khách hàng ${customerName} vừa đặt hàng ${new Intl.NumberFormat('vi-VN').format(finalAmount)}đ (${finalMethod}).`;
    await NotificationModel.create({
      id: notiId,
      title: notiTitle,
      message: notiMsg,
      type: 'order',
      orderId: orderId
    });

    // Auto-send HTML confirmation email in background after 4s wait
    queueInvoiceEmailAsync(newOrder, 4000);

    // Realtime broadcast to admin dashboard
    notifyNewOrder(newOrder);

    res.status(201).json({
      message: 'Đặt hàng & Thanh toán thành công.',
      order: newOrder,
      payment: newPayment
    });
  }

  static async getOrderById(req, res) {
    const { id } = req.params;
    const order = await OrderModel.getById(id);
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }
    res.json({ order });
  }
}

module.exports = OrderController;
