import React, { useState } from 'react';
import { Printer, CheckCircle, ShieldCheck, X, Mail, CheckCircle2, Send, Check } from 'lucide-react';
import api from '../services/api';

export default function InvoiceModal({ order, onClose }) {
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  if (!order) return null;

  const fmt = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const handlePrint = () => {
    window.print();
  };

  const handleResendEmail = async () => {
    if (!order.customerEmail || isSendingEmail) return;
    setIsSendingEmail(true);
    try {
      await api.sendInvoiceEmail(order.customerEmail, order.id, {
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        customerEmail: order.customerEmail,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        paymentMethodLabel: order.paymentMethodLabel,
        totalAmount: order.totalPrice,
        items: order.items || []
      });
      setEmailSentSuccess(true);
      setTimeout(() => setEmailSentSuccess(false), 3000);
    } catch (e) {
      console.error('Resend invoice email error:', e);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="invoice-overlay" onClick={onClose}>
      <div className="invoice-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Actions */}
        <div className="invoice-actions-bar no-print">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} /> In Hóa Đơn
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm"
              onClick={handleResendEmail}
              disabled={isSendingEmail}
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {emailSentSuccess ? <Check size={16} color="#22c55e" /> : <Send size={15} />}
              <span>{emailSentSuccess ? 'Đã Gửi Lại!' : isSendingEmail ? 'Đang gửi...' : 'Gửi lại Email'}</span>
            </button>
          </div>
          <button type="button" className="invoice-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Email Confirmation Success Banner */}
        <div className="email-sent-banner no-print">
          <div className="banner-icon-circle">
            <Mail size={18} color="#ffffff" />
          </div>
          <div className="banner-text">
            <strong>XÁC NHẬN THANH TOÁN &amp; GỬI EMAIL THÀNH CÔNG!</strong>
            <p>Email xác nhận đơn hàng kèm Hóa đơn điện tử đã được gửi tới <strong>{order.customerEmail || 'khách hàng'}</strong></p>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="invoice-printable-area" id="printable-invoice">
          {/* Company Branding & Header */}
          <div className="invoice-header">
            <div className="invoice-brand">
              <h1 className="brand-logo-text">NAT COMPUTER</h1>
              <p className="brand-sub-text">HỆ THỐNG MÁY TÍNH & PC GAMING CAO CẤP</p>
              <p className="brand-contact-info">
                Địa chỉ: 456 Trần Duy Hưng, Cầu Giấy, Hà Nội | Hotline: 024.3456.7890
              </p>
            </div>
            <div className="invoice-title-block">
              <h2 className="invoice-main-title">HÓA ĐƠN BÁN HÀNG</h2>
              <p className="invoice-id">Mã đơn hàng: <strong>{order.id}</strong></p>
              <p className="invoice-date">
                Ngày đặt: {new Date(order.createdAt || Date.now()).toLocaleDateString('vi-VN')}
              </p>
            </div>
          </div>

          <hr className="invoice-divider" />

          {/* Customer & Shipping Info */}
          <div className="invoice-info-grid">
            <div className="info-box">
              <h4 className="info-box-title">THÔNG TIN KHÁCH HÀNG</h4>
              <p><strong>Họ và tên:</strong> {order.customerName || 'Khách hàng'}</p>
              <p><strong>Số điện thoại:</strong> {order.customerPhone || 'N/A'}</p>
              <p><strong>Email:</strong> {order.customerEmail || 'N/A'}</p>
            </div>

            <div className="info-box">
              <h4 className="info-box-title">ĐỊA CHỈ GIAO HÀNG & PHƯƠNG THỨC</h4>
              <p><strong>Địa chỉ nhận hàng:</strong> {order.shippingAddress || 'N/A'}</p>
              <p>
                <strong>Phương thức thanh toán:</strong>{' '}
                <span className="payment-method-badge">{order.paymentMethodLabel || order.paymentMethod}</span>
              </p>
              <p><strong>Trạng thái:</strong> <span className="status-badge-paid">ĐÃ XÁC NHẬN</span></p>
            </div>
          </div>

          {/* Product Items Table with Specs */}
          <div className="invoice-table-wrap">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên Sản Phẩm & Cấu Hình Chi Tiết</th>
                  <th className="text-center">Số Lượng</th>
                  <th className="text-right">Đơn Giá</th>
                  <th className="text-right">Thành Tiền</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, index) => {
                  const specs = item.specifications || (item.specs ? [
                    `CPU: ${item.specs.cpu || ''}`,
                    `Card màn hình GPU: ${item.specs.gpu || ''}`,
                    `Bộ nhớ RAM: ${item.specs.ram || ''}`,
                    `Ổ cứng lưu trữ SSD: ${item.specs.ssd || ''}`,
                  ].filter(Boolean) : []);

                  return (
                    <tr key={item.id || index}>
                      <td className="text-center">{index + 1}</td>
                      <td>
                        <div className="invoice-item-name">{item.name}</div>
                        {specs.length > 0 && (
                          <div className="invoice-specs-detail-box">
                            <div className="invoice-specs-header">
                              <ShieldCheck size={14} color="#16a34a" />
                              <span>Cấu hình kỹ thuật chi tiết &amp; Bảo hành chính hãng 36 tháng:</span>
                            </div>
                            <ul className="invoice-specs-list">
                              {specs.map((specLine, sIdx) => (
                                <li key={sIdx} className="invoice-spec-line">
                                  <CheckCircle2 size={12} color="#22c55e" className="spec-check-ic" />
                                  <span>{specLine}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </td>
                      <td className="text-center">{item.quantity || 1}</td>
                      <td className="text-right">{fmt(item.price)}</td>
                      <td className="text-right">{fmt(item.price * (item.quantity || 1))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pricing Total Summary */}
          <div className="invoice-summary-block">
            <div className="summary-row">
              <span>Tạm tính tiền hàng:</span>
              <span>{fmt(order.subtotal || order.totalPrice)}</span>
            </div>
            <div className="summary-row">
              <span>Phí vận chuyển giao hàng:</span>
              <span>Miễn phí</span>
            </div>
            <div className="summary-row total-row">
              <span>TỔNG CỘNG THANH TOÁN:</span>
              <span className="total-amount">{fmt(order.totalPrice)}</span>
            </div>
          </div>

          {/* Signatures & Footer Stamp */}
          <div className="invoice-footer-signatures">
            <div className="sig-box">
              <p className="sig-title">Người Mua Hàng</p>
              <p className="sig-sub">(Ký &amp; ghi rõ họ tên)</p>
            </div>
            <div className="sig-box">
              <p className="sig-title">Đại Diện NAT Computer</p>
              <p className="sig-sub">(Ký &amp; đóng dấu)</p>
              <div className="sig-stamp">
                <CheckCircle size={32} color="#22c55e" />
                <span>ĐÃ XÁC NHẬN BẢO HÀNH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
