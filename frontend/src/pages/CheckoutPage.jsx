import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  User,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Lock,
  CheckCircle2,
  ChevronRight,
  Zap,
  Tag,
  Ticket,
  Sparkles
} from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';
import PaymentProcessingModal from '../components/PaymentProcessingModal';
import api from '../services/api';
import pcGamingImg from '../image/pc-gaming-premium_ttg_2.jpg';

const DEFAULT_SAMPLE_PC = {
  id: 'deal-ultra-7-5070',
  name: 'PC TTG GAMING LUXURY ULTRA 7 270K PLUS - RTX 5070',
  categoryName: 'Hot Deal Extreme',
  price: 67980000,
  originalPrice: 69900000,
  quantity: 1,
  image: pcGamingImg,
  specs: {
    cpu: 'Intel Core Ultra 7 270K',
    gpu: 'NVIDIA GeForce RTX 5070 12GB',
    ram: '32GB DDR5 6000MHz RGB',
    ssd: '1TB NVMe Gen4',
  },
  specifications: [
    'CPU Intel Core Ultra 7 270K Plus (16 Cores - 24 Threads, Max 5.5GHz)',
    'Mainboard MSI Z890 GAMING PLUS WIFI DDR5',
    'RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 Bus 6000MHz',
    'Ổ Cứng SSD Kingston KC3000 1TB NVMe M.2 PCIe Gen4 (7000MB/s)',
    'Card màn hình NVIDIA GeForce RTX 5070 12GB GDDR7 (All NEW)',
    'Nguồn Corsair RM850e 850W 80 Plus Gold (ATX 3.0)',
  ],
};

export default function CheckoutPage({ user, cartItems = [], onClearCart, onAddToCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [paymentMethod, setPaymentMethod] = useState('vietqr');
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [sampleItem, setSampleItem] = useState(null);

  // Voucher / Coupon State
  const [couponCode, setCouponCode] = useState(location.state?.appliedCoupon || '');
  const [discountAmount, setDiscountAmount] = useState(location.state?.discountAmount || 0);
  const [appliedCoupon, setAppliedCoupon] = useState(location.state?.appliedCoupon ? { code: location.state.appliedCoupon } : null);
  const [couponMsg, setCouponMsg] = useState({ type: location.state?.discountAmount ? 'success' : '', text: location.state?.discountAmount ? `Đã áp dụng mã ${location.state.appliedCoupon}` : '' });
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const directBuyItem = location.state?.directBuyItem;

  // Determine effective cart items
  const effectiveCartItems =
    cartItems.length > 0
      ? cartItems
      : directBuyItem
        ? [directBuyItem]
        : sampleItem
          ? [sampleItem]
          : [];

  const fmt = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const subtotal = effectiveCartItems.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const shippingFee = 0;
  const totalPrice = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = async (e) => {
    e?.preventDefault();
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) {
      setCouponMsg({ type: 'error', text: 'Vui lòng nhập mã giảm giá.' });
      return;
    }

    setIsValidatingCoupon(true);
    setCouponMsg({ type: '', text: '' });

    try {
      const res = await api.validateCoupon(cleanCode, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setAppliedCoupon(res.coupon);
        setCouponCode(res.coupon.code);
        setCouponMsg({ type: 'success', text: res.message });
      } else {
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCouponMsg({ type: 'error', text: res.error || 'Mã giảm giá không hợp lệ.' });
      }
    } catch {
      if (cleanCode === 'NAT500K' && subtotal >= 15000000) {
        setDiscountAmount(500000);
        setAppliedCoupon({ code: 'NAT500K' });
        setCouponMsg({ type: 'success', text: 'Áp dụng mã NAT500K (-500.000đ)' });
      } else {
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCouponMsg({ type: 'error', text: 'Không thể xác thực mã giảm giá.' });
      }
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  // 1. Guard: Check if user is logged in
  if (!user) {
    return (
      <div className="checkout-guard-root wrap">
        <div className="checkout-guard-card">
          <div className="guard-icon-wrap warning">
            <Lock size={44} color="#e22718" />
          </div>
          <h2 className="guard-title">Yêu Cầu Đăng Nhập Tài Khoản</h2>
          <p className="guard-desc">
            Vui lòng đăng nhập tài khoản NAT Computer để tiếp tục thanh toán đơn hàng và nhận chính sách bảo hành chính hãng.
          </p>
          <div className="guard-action-buttons">
            <Link to="/login" className="btn btn-red hover-btn-effect">
              Đăng Nhập / Đăng Ký Ngay
            </Link>
            <Link to="/" className="btn btn-outline-dark">
              Trở Về Trang Chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Guard: Check if mandatory profile information is complete
  const isProfileComplete = user.phone && (user.address || user.shippingAddress);

  if (!isProfileComplete) {
    return (
      <div className="checkout-guard-root wrap">
        <div className="checkout-guard-card">
          <div className="guard-icon-wrap info">
            <AlertTriangle size={44} color="#f59e0b" />
          </div>
          <h2 className="guard-title">Cần Cập Nhật Thông Tin Giao Hàng</h2>
          <p className="guard-desc">
            Tài khoản của bạn chưa có đủ <strong>Số điện thoại</strong> và <strong>Địa chỉ nhận hàng</strong>. Vui lòng cập nhật đầy đủ thông tin tại trang Cá nhân trước khi đặt hàng.
          </p>
          <div className="guard-action-buttons">
            <Link to="/profile" className="btn btn-red hover-btn-effect">
              Cập Nhật Thông Tin Profile
            </Link>
            <Link to="/cart" className="btn btn-outline-dark">
              Quay Lại Giỏ Hàng
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Guard: If no items in cart, allow 1-click loading sample product to test checkout & invoice!
  if (effectiveCartItems.length === 0) {
    return (
      <div className="checkout-guard-root wrap">
        <div className="checkout-guard-card">
          <h2 className="guard-title">Giỏ Hàng Của Bạn Đang Trống</h2>
          <p className="guard-desc">
            Bạn có thể chọn xem hóa đơn để kiểm tra hóa đơn vửa mua .
          </p>
          <div className="guard-action-buttons">
            <button
              type="button"
              className="btn btn-red hover-btn-effect"
              onClick={() => setSampleItem(DEFAULT_SAMPLE_PC)}
            >
              <Zap size={16} />
              <span>TẢI PC GAMING MẪU ĐỂ THANH TOÁN &amp; XEM HÓA ĐƠN NGAY</span>
            </button>
            <Link to="/" className="btn btn-outline-dark">
              Khám Phá Sản Phẩm Trực Tiếp
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    const paymentLabels = {
      momo: 'Ví MoMo (Mã QR / App)',
      zalopay: 'Ví ZaloPay (Mã QR / App)',
      vietqr: 'Chuyển khoản Ngân hàng (VietQR)',
      cod: 'Thanh toán khi nhận hàng (COD)',
    };

    const newOrder = {
      id: `NAT-ORD-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customerName: user.name || user.fullName || 'Khách hàng NAT',
      customerPhone: user.phone,
      customerEmail: user.email,
      shippingAddress: user.address || user.shippingAddress,
      paymentMethod,
      paymentMethodLabel: paymentLabels[paymentMethod] || paymentMethod,
      items: [...effectiveCartItems],
      subtotal,
      shippingFee,
      discountAmount,
      appliedCoupon: appliedCoupon?.code || (discountAmount > 0 ? couponCode.trim().toUpperCase() : null),
      totalPrice,
      status: 'Đã xác nhận (Đã thanh toán)',
    };

    setPendingOrder(newOrder);
    setIsProcessingPayment(true);
  };

  const handlePaymentComplete = async () => {
    setIsProcessingPayment(false);
    setConfirmedOrder(pendingOrder);

    // Sync order with backend database
    try {
      await api.createOrder({
        customerName: pendingOrder.customerName,
        customerEmail: pendingOrder.customerEmail,
        customerPhone: pendingOrder.customerPhone,
        shippingAddress: pendingOrder.shippingAddress,
        paymentMethod: pendingOrder.paymentMethod,
        items: pendingOrder.items,
        totalAmount: pendingOrder.totalPrice,
        appliedCoupon: pendingOrder.appliedCoupon,
        discountAmount: pendingOrder.discountAmount
      });
    } catch (err) {
      console.error('Error syncing order with backend:', err);
    }

    try {
      const savedOrders = JSON.parse(localStorage.getItem('nat_orders') || '[]');
      localStorage.setItem('nat_orders', JSON.stringify([pendingOrder, ...savedOrders]));
    } catch (e) {
      console.error(e);
    }

    onClearCart?.();
  };

  return (
    <div className="checkout-page-root wrap">
      {/* Breadcrumb Navigation */}
      <div className="checkout-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} />
        <Link to="/cart">Giỏ hàng</Link>
        <ChevronRight size={14} />
        <span>Thanh toán đơn hàng</span>
      </div>

      <h1 className="checkout-page-title">XÁC NHẬN &amp; THANH TOÁN ĐƠN HÀNG</h1>

      <div className="checkout-grid-container">
        {/* LEFT COLUMN: Customer Info, Products & Warranty */}
        <div className="checkout-left-col">
          {/* Customer Info Card */}
          <div className="checkout-card-box">
            <div className="card-box-header">
              <User size={18} className="header-icon" />
              <h3>THÔNG TIN GIAO HÀNG (ĐÃ XÁC THỰC)</h3>
              <Link to="/profile" className="edit-profile-link">Chỉnh sửa</Link>
            </div>
            <div className="customer-info-body">
              <div className="info-item">
                <User size={14} color="#64748b" />
                <span><strong>Họ và tên:</strong> {user.name || user.fullName}</span>
              </div>
              <div className="info-item">
                <Phone size={14} color="#64748b" />
                <span><strong>Số điện thoại:</strong> {user.phone}</span>
              </div>
              <div className="info-item">
                <Mail size={14} color="#64748b" />
                <span><strong>Email nhận hóa đơn:</strong> {user.email}</span>
              </div>
              <div className="info-item">
                <MapPin size={14} color="#64748b" />
                <span><strong>Địa chỉ giao hàng:</strong> {user.address || user.shippingAddress}</span>
              </div>
            </div>
          </div>

          {/* Product Items & Config Breakdown */}
          <div className="checkout-card-box">
            <div className="card-box-header">
              <ShieldCheck size={18} className="header-icon" />
              <h3>DANH SÁCH SẢN PHẨM &amp; CẤU HÌNH ĐẶT MUA ({effectiveCartItems.length})</h3>
            </div>
            <div className="checkout-products-list">
              {effectiveCartItems.map((item) => {
                const specs = item.specifications || (item.specs ? [
                  `CPU: ${item.specs.cpu || ''}`,
                  `GPU: ${item.specs.gpu || ''}`,
                  `RAM: ${item.specs.ram || ''}`,
                  `SSD: ${item.specs.ssd || ''}`,
                ].filter(Boolean) : []);

                return (
                  <div key={item.id} className="checkout-product-item">
                    <img src={item.image} alt={item.name} className="product-thumb" />
                    <div className="product-details">
                      <h4 className="product-name">{item.name}</h4>
                      <p className="product-warranty">
                        <ShieldCheck size={13} color="#22c55e" /> Bảo hành 36 tháng chính hãng NAT
                      </p>
                      {specs.length > 0 && (
                        <div className="product-specs-list">
                          {specs.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="spec-tag-item">• {s}</span>
                          ))}
                        </div>
                      )}
                      <div className="product-price-qty">
                        <span>Đơn giá: {fmt(item.price)}</span>
                        <span>Số lượng: x{item.quantity || 1}</span>
                        <span className="item-total">Thành tiền: {fmt(item.price * (item.quantity || 1))}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Customer Commitment Policy */}
          <div className="checkout-card-box commitment-box">
            <div className="card-box-header">
              <CheckCircle2 size={18} color="#22c55e" />
              <h3>CAM KẾT CHÍNH SÁCH BẢO HÀNH NAT COMPUTER</h3>
            </div>
            <ul className="policy-list">
              <li>✓ Cam kết 100% linh kiện nhập khẩu chính hãng mới full box.</li>
              <li>✓ 1 đổi 1 trong 30 ngày đầu tiên nếu phát sinh lỗi nhà sản xuất.</li>
              <li>✓ Miễn phí lắp đặt, cài đặt Windows và phần mềm cơ bản.</li>
              <li>✓ Bảo hành tận nơi tại nhà nội thành Hà Nội &amp; TP.HCM.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT COLUMN: Payment Methods & Order Total */}
        <div className="checkout-right-col">
          <div className="checkout-card-box payment-section-box">
            <div className="card-box-header">
              <CreditCard size={18} className="header-icon" />
              <h3>PHƯƠNG THỨC THANH TOÁN</h3>
            </div>

            <div className="payment-options-list">
              {/* MoMo Option */}
              <label className={`payment-option-card ${paymentMethod === 'momo' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title-row">
                    <span className="pay-badge momo-badge">MoMo</span>
                    <span className="pay-name">Ví MoMo (Quét mã QR / App)</span>
                  </div>
                  <p className="pay-desc">Thanh toán tức thì qua ví MoMo an toàn &amp; tiện lợi.</p>
                </div>
              </label>

              {/* ZaloPay Option */}
              <label className={`payment-option-card ${paymentMethod === 'zalopay' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="zalopay"
                  checked={paymentMethod === 'zalopay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title-row">
                    <span className="pay-badge zalopay-badge">ZaloPay</span>
                    <span className="pay-name">Ví ZaloPay (Quét mã QR / App)</span>
                  </div>
                  <p className="pay-desc">Thanh toán qua ZaloPay nhận thêm mã ưu đãi.</p>
                </div>
              </label>

              {/* VietQR Option */}
              <label className={`payment-option-card ${paymentMethod === 'vietqr' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="vietqr"
                  checked={paymentMethod === 'vietqr'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title-row">
                    <QrCode size={18} color="#1c69d4" />
                    <span className="pay-name">Chuyển khoản Ngân hàng (VietQR)</span>
                  </div>
                  <p className="pay-desc">Chuyển khoản liên ngân hàng 24/7 bằng mã QR.</p>
                </div>
              </label>

              {/* COD Option */}
              <label className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div className="option-content">
                  <div className="option-title-row">
                    <Truck size={18} color="#16a34a" />
                    <span className="pay-name">Thanh toán khi nhận hàng (COD)</span>
                  </div>
                  <p className="pay-desc">Thanh toán tiền mặt cho shipper khi đã nhận &amp; kiểm tra máy.</p>
                </div>
              </label>
            </div>

            {/* Dynamic QR Display for MoMo / ZaloPay / VietQR */}
            {paymentMethod !== 'cod' && (
              <div className="qr-pay-info-box">
                <h4 className="qr-box-title">Thông Tin Quét Mã Thanh Toán</h4>
                <div className="qr-display-flex">
                  <div className="qr-code-placeholder">
                    {paymentMethod === 'vietqr' ? (
                      <img
                        src={`https://img.vietqr.io/image/MB-0773071629-compact2.png?amount=${totalPrice}&addInfo=NAT%20CHECKOUT&accountName=NGO%20ANH%20TU`}
                        alt="VietQR MBBank"
                        style={{ width: '90px', height: '90px', objectFit: 'contain', borderRadius: '4px', background: '#fff' }}
                      />
                    ) : (
                      <QrCode size={90} color={paymentMethod === 'momo' ? '#d82d8b' : '#0068ff'} />
                    )}
                  </div>
                  <div className="qr-details-text">
                    <p><strong>Ngân hàng:</strong> {paymentMethod === 'vietqr' ? 'MBBank (Ngân hàng Quân Đội)' : paymentMethod.toUpperCase()}</p>
                    <p><strong>Chủ tài khoản:</strong> {paymentMethod === 'vietqr' ? 'NGO ANH TU' : 'CÔNG TY TNHH NAT COMPUTER'}</p>
                    <p><strong>Số tài khoản:</strong> {paymentMethod === 'vietqr' ? '0773071629' : '0243.456.7890'}</p>
                    <p className="qr-memo-text">
                      <strong>Nội dung CK:</strong> NAT {user.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Order Price Summary */}
            <div className="checkout-summary-box">
              <div className="summary-line">
                <span>Tạm tính ({effectiveCartItems.length} sản phẩm):</span>
                <span>{fmt(subtotal)}</span>
              </div>

              {/* Coupon input form */}
              <div style={{ margin: '12px 0', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Tag size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                      type="text"
                      placeholder="Mã voucher..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 10px 8px 32px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        borderRadius: '6px',
                        color: '#fff',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isValidatingCoupon}
                    className="btn btn-outline-dark"
                    style={{ padding: '0 12px', fontSize: '13px' }}
                  >
                    {isValidatingCoupon ? 'Kiểm tra...' : 'Áp Dụng'}
                  </button>
                </form>
                {couponMsg.text && (
                  <p style={{ margin: '6px 0 0', fontSize: '12px', color: couponMsg.type === 'success' ? '#22c55e' : '#ef4444' }}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="summary-line discount-line" style={{ color: '#22c55e' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Ticket size={14} />
                    Giảm giá ({appliedCoupon?.code || couponCode}):
                  </span>
                  <span>-{fmt(discountAmount)}</span>
                </div>
              )}

              <div className="summary-line">
                <span>Phí vận chuyển giao hàng:</span>
                <span className="text-green">Miễn phí</span>
              </div>
              <hr className="summary-hr" />
              <div className="summary-line total-line">
                <span>TỔNG CỘNG THANH TOÁN:</span>
                <span className="final-price">{fmt(totalPrice)}</span>
              </div>

              <button
                type="button"
                className="btn btn-red btn-lg btn-block checkout-submit-btn hover-btn-effect"
                onClick={handleConfirmOrder}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? 'Đang Kết Nối Thanh Toán...' : 'XÁC NHẬN ĐẶT HÀNG & THANH TOÁN'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Processing & VietQR Modal */}
      {isProcessingPayment && (
        <PaymentProcessingModal
          paymentMethod={pendingOrder?.paymentMethod || paymentMethod}
          paymentMethodLabel={pendingOrder?.paymentMethodLabel}
          customerEmail={user.email}
          orderId={pendingOrder?.id}
          totalAmount={pendingOrder?.totalPrice || totalPrice}
          onComplete={handlePaymentComplete}
        />
      )}

      {/* Invoice Modal after Order Placement */}
      {confirmedOrder && (
        <InvoiceModal
          order={confirmedOrder}
          onClose={() => {
            setConfirmedOrder(null);
            navigate('/account');
          }}
        />
      )}
    </div>
  );
}
