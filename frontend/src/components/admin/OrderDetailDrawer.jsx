import React, { useState } from 'react';
import {
  X, CheckCircle2, Clock, Truck, Package, Check, AlertCircle,
  FileText, Mail, Ban, RotateCcw, CreditCard, User, MapPin,
  Calendar, ExternalLink, ShieldAlert, ArrowRight, Printer
} from 'lucide-react';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

// Map status to progress step index (0 to 5)
const getTimelineStepIndex = (orderStatus, paymentStatus) => {
  const st = String(orderStatus || '').toUpperCase();
  if (st === 'CANCELLED' || st === 'RETURNED') return -1;
  if (st === 'DELIVERED' || st === 'COMPLETED') return 5;
  if (st === 'SHIPPING') return 4;
  if (st === 'PACKED') return 3;
  if (st === 'CONFIRMED' || st === 'PROCESSING') {
    return paymentStatus === 'PAID' ? 2 : 1;
  }
  return paymentStatus === 'PAID' ? 1 : 0;
};

export default function OrderDetailDrawer({
  order,
  isOpen,
  onClose,
  onConfirmPayment,
  onUpdateStatus,
  onPrintInvoice,
  currencyFormatter = fmt
}) {
  const [emailSent, setEmailSent] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const currentStep = getTimelineStepIndex(order.orderStatus, order.paymentStatus);
  const isPaid = order.paymentStatus === 'PAID';
  const orderId = order.orderId || order.id || 'N/A';

  // Timeline steps definitions
  const timelineSteps = [
    { title: 'Order created', desc: 'Đơn hàng đã được tạo thành công' },
    { title: 'Payment received', desc: isPaid ? 'Đã nhận đủ thanh toán chuyển khoản' : 'Đang chờ khách thanh toán' },
    { title: 'Order confirmed', desc: 'Kỹ thuật viên đã kiểm tra linh kiện tương thích' },
    { title: 'Packed', desc: 'Đã hoàn thiện lắp ráp PC, dán tem bảo hành và đóng thùng xốp' },
    { title: 'Shipped', desc: 'Đã bàn giao đơn vị vận chuyển ViettelPost' },
    { title: 'Delivered', desc: 'Khách hàng đã nhận máy và ký biên bản bàn giao' }
  ];

  // Handler for quick status progression
  const handleQuickAdvanceStatus = async () => {
    setStatusUpdating(true);
    let nextStatus = 'CONFIRMED';
    const cur = String(order.orderStatus || '').toUpperCase();

    if (cur === 'PENDING') nextStatus = 'CONFIRMED';
    else if (cur === 'CONFIRMED') nextStatus = 'PROCESSING';
    else if (cur === 'PROCESSING') nextStatus = 'PACKED';
    else if (cur === 'PACKED') nextStatus = 'SHIPPING';
    else if (cur === 'SHIPPING') nextStatus = 'DELIVERED';

    try {
      if (onUpdateStatus) {
        await onUpdateStatus(order.id, nextStatus);
      }
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendEmailNotification = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  // Calculate items list
  const items = Array.isArray(order.items) && order.items.length > 0 ? order.items : [
    {
      id: 'default-item',
      name: order.productName || 'Dàn Máy PC Gaming Custom NAT Ultra',
      quantity: order.quantity || 1,
      price: order.totalAmount || 0,
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&q=80',
      specs: 'Bảo hành 36 Tháng chính hãng'
    }
  ];

  const subtotal = items.reduce((sum, it) => sum + (Number(it.price) * (Number(it.quantity) || 1)), 0);
  const discount = order.discountAmount || 0;
  const shippingFee = order.shippingFee !== undefined ? order.shippingFee : 0;
  const total = order.totalAmount || (subtotal - discount + shippingFee);

  return (
    <>
      {/* Backdrop */}
      <div className="drawer-backdrop" onClick={onClose} />

      {/* Main Slide-in Drawer */}
      <div className="order-detail-drawer">
        {/* Header Bar */}
        <div className="drawer-header">
          <div className="order-title-col">
            <div className="order-badge-row">
              <span className="order-id-tag">#{orderId}</span>
              <span className={`pill-order-status status-${(order.orderStatus || 'processing').toLowerCase()}`}>
                {order.orderStatus || 'PROCESSING'}
              </span>
              <span className={`pill-payment-status pay-${(order.paymentStatus || 'pending').toLowerCase()}`}>
                {isPaid ? 'Đã Thanh Toán' : 'Chờ Thanh Toán'}
              </span>
            </div>
            <div className="order-date-row">
              <Calendar size={13} />
              <span>Ngày đặt: {order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'Vừa xong'}</span>
            </div>
          </div>

          <button type="button" className="btn-close-drawer" onClick={onClose} title="Đóng bảng">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="drawer-body">
          {/* Email Notification Toast Alert */}
          {emailSent && (
            <div className="drawer-alert-banner">
              <CheckCircle2 size={16} color="#16a34a" />
              <span>Đã gửi email thông báo trạng thái đơn hàng & mã vận đơn đến <strong>{order.customerEmail || 'khách hàng'}</strong> thành công!</span>
            </div>
          )}

          {/* Section: Timeline Tracker */}
          <div className="drawer-section">
            <div className="section-title-row">
              <div className="sec-icon"><Clock size={16} /></div>
              <h4>Hành Trình Đơn Hàng (Order Timeline)</h4>
            </div>

            <div className="timeline-tracker">
              {timelineSteps.map((step, idx) => {
                const isPassed = currentStep >= idx;
                const isCurrent = currentStep === idx;
                return (
                  <div key={idx} className={`timeline-node ${isPassed ? 'completed' : ''} ${isCurrent ? 'active' : ''}`}>
                    <div className="node-marker">
                      {isPassed ? <Check size={12} /> : <span>{idx + 1}</span>}
                    </div>
                    <div className="node-content">
                      <div className="node-title">{step.title}</div>
                      <div className="node-desc">{step.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Progression Helper */}
            {currentStep >= 0 && currentStep < 5 && (
              <div className="quick-advance-box">
                <span className="advance-label">Bước tiếp theo:</span>
                <button
                  type="button"
                  className="btn-advance-status"
                  disabled={statusUpdating}
                  onClick={handleQuickAdvanceStatus}
                >
                  <ArrowRight size={14} /> Chuyển sang bước kế tiếp
                </button>
              </div>
            )}
          </div>

          {/* Section: Customer & Shipping Information Grid */}
          <div className="drawer-grid-2">
            <div className="drawer-section">
              <div className="section-title-row">
                <div className="sec-icon"><User size={16} /></div>
                <h4>Thông Tin Khách Hàng</h4>
              </div>
              <div className="info-detail-list">
                <div className="info-line">
                  <span className="info-label">Họ và tên:</span>
                  <span className="info-val strong">{order.customerName || 'Khách vãng lai'}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-val">{order.customerPhone || 'Chưa cung cấp'}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Email:</span>
                  <span className="info-val">{order.customerEmail || 'Chưa cung cấp'}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Phân khúc:</span>
                  <span className="info-val badge-vip">Khách Hàng Gaming VIP</span>
                </div>
              </div>
            </div>

            <div className="drawer-section">
              <div className="section-title-row">
                <div className="sec-icon"><MapPin size={16} /></div>
                <h4>Vận Chuyển & Giao Nhận</h4>
              </div>
              <div className="info-detail-list">
                <div className="info-line">
                  <span className="info-label">Địa chỉ nhận:</span>
                  <span className="info-val">{order.shippingAddress || 'Nhận trực tiếp tại showroom NAT Computer'}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Đơn vị VC:</span>
                  <span className="info-val strong">{order.shippingMethod || 'Giao Hỏa Tốc 2H ViettelPost'}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Mã vận đơn:</span>
                  <span className="info-val text-code">{order.trackingCode || `VTP-${orderId}`}</span>
                </div>
                <div className="info-line">
                  <span className="info-label">Ghi chú:</span>
                  <span className="info-val text-muted">Hàng linh kiện điện tử dễ vỡ, xin nhẹ tay.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Payment Information */}
          <div className="drawer-section">
            <div className="section-title-row" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div className="sec-icon"><CreditCard size={16} /></div>
                <h4>Thanh Toán & Hạch Toán</h4>
              </div>
              {!isPaid && onConfirmPayment && (
                <button
                  type="button"
                  className="btn-pay-now-action"
                  onClick={() => onConfirmPayment(order.id, order.totalAmount, order.customerName)}
                >
                  <CheckCircle2 size={14} /> Duyệt Thanh Toán MBBank
                </button>
              )}
            </div>

            <div className="info-detail-list">
              <div className="info-line">
                <span className="info-label">Phương thức:</span>
                <span className="info-val strong">{order.paymentMethod || 'Chuyển Khoản QR Ngân Hàng'}</span>
              </div>
              <div className="info-line">
                <span className="info-label">Tình trạng thanh toán:</span>
                <span className={`pill-payment-status pay-${(order.paymentStatus || 'pending').toLowerCase()}`}>
                  {isPaid ? 'Đã Thanh Toán Đầy Đủ' : 'Chưa Thanh Toán (Pending)'}
                </span>
              </div>
              <div className="info-line">
                <span className="info-label">Mã GD MBBank:</span>
                <span className="info-val text-code">{isPaid ? `MBB-${orderId}-OK` : 'Chờ khách quét mã QR'}</span>
              </div>
            </div>
          </div>

          {/* Section: Products Breakdown */}
          <div className="drawer-section">
            <div className="section-title-row">
              <div className="sec-icon"><Package size={16} /></div>
              <h4>Danh Sách Sản Phẩm & Linh Kiện ({items.length} món)</h4>
            </div>

            <div className="order-items-table-wrapper">
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Đơn giá</th>
                    <th style={{ textAlign: 'center' }}>SL</th>
                    <th style={{ textAlign: 'right' }}>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="item-cell-layout">
                          <img
                            src={it.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&q=80'}
                            alt={it.name}
                            className="item-thumb"
                          />
                          <div>
                            <div className="item-name">{it.name}</div>
                            <div className="item-sku">Mã: {it.sku || `SKU-ITEM-${idx + 1}`}</div>
                            {it.specs && <div className="item-spec-note">{it.specs}</div>}
                          </div>
                        </div>
                      </td>
                      <td>{currencyFormatter(it.price)}</td>
                      <td style={{ textAlign: 'center' }}>x{it.quantity || 1}</td>
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>
                        {currencyFormatter((Number(it.price) || 0) * (Number(it.quantity) || 1))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Financial Summary Calculation Card */}
            <div className="financial-calc-card">
              <div className="calc-row">
                <span>Tạm tính linh kiện:</span>
                <span>{currencyFormatter(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="calc-row text-success">
                  <span>Mã giảm giá Voucher:</span>
                  <span>-{currencyFormatter(discount)}</span>
                </div>
              )}
              <div className="calc-row">
                <span>Phí vận chuyển giao hàng:</span>
                <span>{shippingFee === 0 ? 'Miễn phí (Freeship)' : currencyFormatter(shippingFee)}</span>
              </div>
              <div className="calc-divider" />
              <div className="calc-row total-row">
                <span>Tổng tiền thanh toán:</span>
                <span className="total-highlight">{currencyFormatter(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions Footer */}
        <div className="drawer-footer-actions">
          <div className="footer-left">
            <button
              type="button"
              className="btn-drawer-action"
              onClick={() => onPrintInvoice && onPrintInvoice(order)}
            >
              <Printer size={15} /> In Hóa Đơn
            </button>
            <button
              type="button"
              className="btn-drawer-action"
              onClick={handleSendEmailNotification}
            >
              <Mail size={15} /> Gửi Email
            </button>
          </div>

          <div className="footer-right">
            <div className="status-select-wrap">
              <label>Đổi trạng thái:</label>
              <select
                className="select-status-changer"
                value={order.orderStatus || 'PROCESSING'}
                onChange={(e) => onUpdateStatus && onUpdateStatus(order.id, e.target.value)}
              >
                <option value="PENDING">Pending (Chờ duyệt)</option>
                <option value="CONFIRMED">Confirmed (Đã xác nhận)</option>
                <option value="PROCESSING">Processing (Đang ráp máy)</option>
                <option value="PACKED">Packed (Đã đóng gói)</option>
                <option value="SHIPPING">Shipping (Đang giao hàng)</option>
                <option value="DELIVERED">Delivered (Đã giao xong)</option>
                <option value="CANCELLED">Cancelled (Hủy đơn)</option>
                <option value="RETURNED">Returned (Đổi trả / Hoàn)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
