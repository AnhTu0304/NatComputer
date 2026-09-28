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

    const isPendingPayment = req.body.paymentStatus === 'PENDING' ||
      (req.body.paymentStatus !== 'PAID' && (
        finalMethod === 'vietqr' ||
        finalMethod === 'bank' ||
        finalMethod.toLowerCase().includes('vietqr') ||
        finalMethod.toLowerCase().includes('chuyển khoản')
      ));

    const finalPaymentStatus = isPendingPayment ? 'PENDING' : (req.body.paymentStatus || 'PAID');
    const finalOrderStatus = isPendingPayment ? 'PENDING' : 'PROCESSING';

    const newOrder = {
      id: orderId,
      customerName: finalName,
      customerEmail: finalEmail,
      customerPhone: finalPhone,
      shippingAddress: finalAddress,
      paymentMethod: finalMethod,
      paymentStatus: finalPaymentStatus,
      status: finalOrderStatus,
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
      transactionCode: isPendingPayment ? null : ('TXN_' + Math.floor(1000000 + Math.random() * 9000000)),
      amount: finalAmount,
      status: isPendingPayment ? 'PENDING' : 'SUCCESS',
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
    const notiMsg = `Khách hàng ${finalName} vừa đặt hàng ${new Intl.NumberFormat('vi-VN').format(finalAmount)}đ (${finalMethod}).`;
    await NotificationModel.create({
      id: notiId,
      title: notiTitle,
      message: notiMsg,
      type: 'order',
      orderId: orderId
    });

    // Auto-send HTML confirmation email in background after 4s wait ONLY if already paid (e.g. COD/immediate)
    // For VietQR/SePay, invoice email will be sent automatically by PaymentController upon receiving webhook!
    if (!isPendingPayment) {
      queueInvoiceEmailAsync(newOrder, 4000);
    }

    // Realtime broadcast to admin dashboard
    notifyNewOrder(newOrder);

    res.status(201).json({
      message: isPendingPayment ? 'Đơn hàng đã được tạo, vui lòng thanh toán.' : 'Đặt hàng & Thanh toán thành công.',
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
