const { sendInvoiceEmail, queueInvoiceEmailAsync } = require('../services/emailService');
const { readDB, writeDB } = require('../config/dbHelper');

class EmailController {
  static async sendInvoice(req, res) {
    const { recipientEmail, orderId, order, invoiceDetails, isAsync = false, delayMs = 4000 } = req.body;

    const targetEmail = recipientEmail || order?.customerEmail || 'khachhang@natcomputer.vn';
    const targetOrderId = orderId || order?.id || 'NAT-889412';

    const orderPayload = order || {
      id: targetOrderId,
      customerEmail: targetEmail,
      customerName: invoiceDetails?.customerName || 'Quý khách hàng',
      totalAmount: invoiceDetails?.totalAmount || 25000000,
      items: invoiceDetails?.items || []
    };

    // Mode 1: BẤT ĐỒNG BỘ (Asynchronous non-blocking với wait 4s)
    if (isAsync) {
      const waitTime = typeof delayMs === 'number' ? delayMs : 4000;
      const queueInfo = queueInvoiceEmailAsync(orderPayload, waitTime);

      return res.json({
        success: true,
        isAsync: true,
        status: 'QUEUED',
        delayMs: waitTime,
        orderId: targetOrderId,
        recipientEmail: targetEmail,
        message: `Yêu cầu gửi email hóa đơn đã được tiếp nhận bất đồng bộ (chờ ${waitTime / 1000}s để gửi ngầm).`,
        queueInfo: queueInfo
      });
    }

    // Mode 2: ĐỒNG BỘ (Synchronous blocking)
    if (typeof delayMs === 'number' && delayMs > 0) {
      await new Promise(r => setTimeout(r, delayMs));
    }

    const dispatchResult = await sendInvoiceEmail(orderPayload);

    const db = readDB();
    const emailLog = {
      id: 'mail_' + Date.now(),
      recipientEmail: targetEmail,
      orderId: targetOrderId,
      subject: `[NAT COMPUTER] Hóa Đơn Điện Tử Đơn Hàng #${targetOrderId}`,
      status: dispatchResult.status || 'SENT',
      isAsync: false,
      sentAt: new Date().toISOString()
    };

    db.sent_emails = db.sent_emails || [];
    db.sent_emails.push(emailLog);
    writeDB(db);

    res.json({
      success: true,
      isAsync: false,
      status: dispatchResult.status || 'SENT',
      message: `Đã gửi email hóa đơn thành công đến ${emailLog.recipientEmail}`,
      emailLog: emailLog
    });
  }
}

module.exports = EmailController;
