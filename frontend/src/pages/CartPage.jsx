import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ChevronRight,
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  Tag,
  CheckCircle2,
  Sparkles,
  Ticket,
  PackageX,
  Printer,
  FileSpreadsheet,
  Check,
  Percent,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Info
} from 'lucide-react';
import api from '../services/api';

gsap.registerPlugin(useGSAP);

const CITY_DISTRICTS = {
  'Hà Nội': ['Ba Đình', 'Hoàn Kiếm', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên', 'Nam Từ Liêm', 'Bắc Từ Liêm', 'Tây Hồ', 'Hà Đông'],
  'TP. Hồ Chí Minh': ['Quận 1', 'Quận 3', 'Quận 5', 'Quận 7', 'Quận 10', 'Bình Thạnh', 'Tân Bình', 'Phú Nhuận', 'Gò Vấp', 'Thủ Đức', 'Bình Tân'],
  'Đà Nẵng': ['Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang'],
  'Hải Phòng': ['Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Kiến An', 'Hải An', 'Đồ Sơn'],
  'Cần Thơ': ['Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt'],
  'Bình Dương': ['Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Bến Cát', 'Tân Uyên'],
  'Đồng Nai': ['Biên Hòa', 'Long Khánh', 'Long Thành', 'Nhơn Trạch', 'Trảng Bom'],
  'Quảng Ninh': ['Hạ Long', 'Cẩm Phả', 'Uông Bí', 'Móng Cái']
};

const SATISFACTION_POLICIES = [
  {
    id: 1,
    title: '1. Liên hệ chăm sóc khách hàng dễ dàng',
    content: 'Quý khách có thể liên hệ trực tiếp qua Hotline 088.697.6868, Zalo Official NAT Computer hoặc live chat trên website để được chuyên viên kỹ thuật hỗ trợ 24/7 tức thì trong 30 giây.'
  },
  {
    id: 2,
    title: '2. Giao hàng nhanh trong 2 giờ mà không thu thêm phí',
    content: 'Áp dụng cho mọi đơn hàng máy tính PC và linh kiện trong khu vực nội thành. Đội ngũ kỹ thuật viên NAT Computer sẽ giao tận nơi, lắp ráp hoàn chỉnh và hướng dẫn sử dụng hoàn toàn miễn phí.'
  },
  {
    id: 3,
    title: '3. Miễn phí lên đời và trải nghiệm sản phẩm trong vòng 15 ngày',
    content: 'Khách hàng có quyền đổi sang bất kỳ dòng sản phẩm cấu hình cao hơn hoặc tương đương mà không mất bất kỳ chi phí khấu hao nào trong 15 ngày đầu sử dụng.'
  },
  {
    id: 4,
    title: '4. Cam kết thu cũ đổi mới trọn đời với tất cả các sản phẩm Gaming Gear và linh kiện máy tính',
    content: 'NAT Computer hỗ trợ chính sách trợ giá lên tới 20% khi quý khách có nhu cầu đổi cũ lấy mới linh kiện (VGA, CPU, Main, RAM, Màn hình, Gear), cam kết thủ tục nhanh gọn trong 15 phút.'
  },
  {
    id: 5,
    title: '5. Cho mượn sản phẩm miễn phí thay thế trong thời gian bảo hành tại NAT COMPUTER',
    content: 'Trong thời gian sản phẩm của quý khách được kiểm tra hoặc gửi hãng bảo hành, NAT Computer sẽ cho quý khách mượn ngay linh kiện/dàn máy tương đương để đảm bảo công việc và giải trí không bị gián đoạn.'
  }
];

export default function CartPage({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // Buyer Information Form State
  const [buyerInfo, setBuyerInfo] = useState(() => {
    try {
      const savedUser = localStorage.getItem('nat_user');
      if (savedUser) {
        const u = JSON.parse(savedUser);
        return {
          name: u.name || '',
          phone: u.phone || '',
          email: u.email || '',
          address: u.address || '',
          city: 'Đà Nẵng',
          district: 'Thanh Khê',
          note: ''
        };
      }
    } catch {
      // fallback
    }
    return {
      name: '',
      phone: '',
      email: '',
      address: '',
      city: 'Đà Nẵng',
      district: 'Thanh Khê',
      note: ''
    };
  });

  const [formErrors, setFormErrors] = useState({});
  const [agreedTerms, setAgreedTerms] = useState(true);

  // Promo Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isValidating, setIsValidating] = useState(false);
  const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);

  // Modals
  const [isInstallmentModalOpen, setIsInstallmentModalOpen] = useState(false);
  const [isPayLaterModalOpen, setIsPayLaterModalOpen] = useState(false);

  // Accordion Expand State (allows toggling open/close)
  const [openAccordionIds, setOpenAccordionIds] = useState([1]);

  const toggleAccordion = (id) => {
    setOpenAccordionIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const finalTotal = Math.max(0, subtotal - discountAmount);
  const estimatedMonthlyInstallment = Math.round(finalTotal / 12);

  // Fetch available public coupons on mount
  useEffect(() => {
    let isMounted = true;
    api.getPublicCoupons().then(res => {
      if (isMounted && res.coupons) {
        setAvailableCoupons(res.coupons);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      '.cart-page-title',
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
    );
    gsap.fromTo(
      '.cart-item-row',
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: rootRef, dependencies: [cartItems.length] });

  // Apply Coupon Handler
  const handleApplyCouponCode = async (codeToApply) => {
    const cleanCode = (codeToApply || couponCode).trim().toUpperCase();
    if (!cleanCode) {
      setCouponMsg({ type: 'error', text: 'Vui lòng nhập mã giảm giá.' });
      return;
    }

    setIsValidating(true);
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
      // Fallback local calculation
      if (cleanCode === 'NAT500K' && subtotal >= 15000000) {
        setDiscountAmount(500000);
        setAppliedCoupon({ code: 'NAT500K' });
        setCouponMsg({ type: 'success', text: 'Áp dụng mã NAT500K thành công (-500.000đ)' });
      } else if (cleanCode === 'FREESHIP' && subtotal >= 5000000) {
        setDiscountAmount(100000);
        setAppliedCoupon({ code: 'FREESHIP' });
        setCouponMsg({ type: 'success', text: 'Áp dụng mã FREESHIP thành công (-100.000đ)' });
      } else if (cleanCode === 'CHAO2026' && subtotal >= 2000000) {
        setDiscountAmount(200000);
        setAppliedCoupon({ code: 'CHAO2026' });
        setCouponMsg({ type: 'success', text: 'Áp dụng mã CHAO2026 thành công (-200.000đ)' });
      } else {
        setDiscountAmount(0);
        setAppliedCoupon(null);
        setCouponMsg({ type: 'error', text: 'Mã giảm giá không hợp lệ hoặc chưa đạt đơn tối thiểu.' });
      }
    } finally {
      setIsValidating(false);
      setIsVoucherModalOpen(false);
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    handleApplyCouponCode(couponCode);
  };

  // Validate Buyer Info Form
  const validateForm = () => {
    const errs = {};
    if (!buyerInfo.name.trim()) errs.name = 'Vui lòng nhập họ và tên';
    if (!buyerInfo.phone.trim()) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(buyerInfo.phone.replace(/\s+/g, ''))) {
      errs.phone = 'Số điện thoại không hợp lệ';
    }
    if (!buyerInfo.email.trim()) {
      errs.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(buyerInfo.email)) {
      errs.email = 'Email không đúng định dạng';
    }
    if (!buyerInfo.address.trim()) errs.address = 'Vui lòng nhập địa chỉ giao hàng';
    if (!agreedTerms) errs.terms = 'Vui lòng đồng ý với điều kiện giao dịch';

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 1. Action: Print Quotation
  const handlePrintQuotation = () => {
    window.print();
  };

  // 2. Action: Export Excel / CSV
  const handleExportExcel = () => {
    if (cartItems.length === 0) return;

    let csvContent = '\uFEFF'; // UTF-8 BOM for Vietnamese characters
    csvContent += 'BÁO GIÁ ĐƠN HÀNG - NAT COMPUTER\n';
    csvContent += `Khách hàng: ${buyerInfo.name || 'Khách lẻ'}\n`;
    csvContent += `Số điện thoại: ${buyerInfo.phone || 'N/A'}\n`;
    csvContent += `Địa chỉ: ${buyerInfo.address || 'N/A'}, ${buyerInfo.district}, ${buyerInfo.city}\n`;
    csvContent += `Ngày xuất: ${new Date().toLocaleDateString('vi-VN')}\n\n`;
    csvContent += 'STT,Tên sản phẩm,Đơn giá (VND),Số lượng,Thành tiền (VND)\n';

    cartItems.forEach((item, index) => {
      const itemPrice = item.price || 0;
      const itemQty = item.quantity || 1;
      const rowTotal = itemPrice * itemQty;
      const cleanName = `"${(item.name || '').replace(/"/g, '""')}"`;
      csvContent += `${index + 1},${cleanName},${itemPrice},${itemQty},${rowTotal}\n`;
    });

    csvContent += `\n,,,Tổng cộng:,${subtotal}\n`;
    csvContent += `,,,Giảm giá voucher:,${discountAmount}\n`;
    csvContent += `,,,Thành tiền thanh toán:,${finalTotal}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Gia_NAT_Computer_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Action: Place Order
  const handleCheckoutOrder = () => {
    if (!validateForm()) return;

    navigate('/checkout', {
      state: {
        buyerInfo,
        appliedCoupon: appliedCoupon?.code || (discountAmount > 0 ? couponCode.trim().toUpperCase() : null),
        discountAmount: discountAmount || 0,
        paymentMode: 'standard'
      }
    });
  };

  // 4. Action: Installment Plan Checkout
  const handleInstallmentOrder = () => {
    if (!validateForm()) {
      setIsInstallmentModalOpen(true);
      return;
    }
    navigate('/checkout', {
      state: {
        buyerInfo,
        appliedCoupon: appliedCoupon?.code || null,
        discountAmount: discountAmount || 0,
        paymentMode: 'installment'
      }
    });
  };

  // 5. Action: Home PayLater
  const handlePayLaterOrder = () => {
    if (!validateForm()) {
      setIsPayLaterModalOpen(true);
      return;
    }
    navigate('/checkout', {
      state: {
        buyerInfo,
        appliedCoupon: appliedCoupon?.code || null,
        discountAmount: discountAmount || 0,
        paymentMode: 'home_paylater'
      }
    });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    const districts = CITY_DISTRICTS[selectedCity] || [];
    setBuyerInfo(prev => ({
      ...prev,
      city: selectedCity,
      district: districts[0] || ''
    }));
  };

  return (
    <div ref={rootRef} className="cart-page-root wrap">
      {/* ── 1. BREADCRUMB ── */}
      <nav className="cart-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="cart-bc-sep" />
        <span className="cart-bc-active">Giỏ hàng & Đặt hàng</span>
      </nav>

      {/* ── 2. PAGE TITLE ── */}
      <div className="cart-title-row">
        <h1 className="cart-page-title">GIỎ HÀNG CỦA BẠN</h1>
        <span className="cart-title-accent-line" />
      </div>

      {cartItems.length > 0 ? (
        <>
          {/* ── 3. CART PRODUCT ITEMS TABLE ── */}
          <div className="cart-list-panel" style={{ marginBottom: '24px' }}>
            <div className="cart-table-head">
              <span className="th-product">Sản phẩm ({cartItems.length})</span>
              <span className="th-price">Đơn giá</span>
              <span className="th-qty">Số lượng</span>
              <span className="th-total">Thành tiền</span>
              <span className="th-action">Xóa</span>
            </div>

            <div className="cart-items-wrapper">
              {cartItems.map((item) => {
                const itemPrice = item.price || 0;
                const itemQty = item.quantity || 1;
                const itemTotal = itemPrice * itemQty;
                const hasOrig = item.originalPrice && item.originalPrice > itemPrice;

                return (
                  <div key={item.id} className="cart-item-row">
                    {/* Product Image */}
                    <div className="cart-item-img-box" onClick={() => navigate(`/product/${item.id}`)}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    {/* Product Details */}
                    <div className="cart-item-info">
                      <h3
                        className="cart-item-name"
                        onClick={() => navigate(`/product/${item.id}`)}
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      <p className="cart-item-warranty">Bảo hành: 36 Tháng chính hãng 1 đổi 1</p>
                      <span className="cart-item-stock">✓ Sẵn hàng tại Showroom</span>
                    </div>

                    {/* Unit Price */}
                    <div className="cart-item-price-col">
                      <div className="cart-item-price-current">{fmt(itemPrice)}</div>
                      {hasOrig && (
                        <div className="cart-item-price-old">{fmt(item.originalPrice)}</div>
                      )}
                    </div>

                    {/* Quantity Selector */}
                    <div className="cart-item-qty-col">
                      <div className="cart-qty-picker">
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, itemQty - 1)}
                          disabled={itemQty <= 1}
                          aria-label="Giảm"
                        >
                          <Minus size={13} />
                        </button>
                        <span>{itemQty}</span>
                        <button
                          onClick={() => onUpdateQuantity?.(item.id, itemQty + 1)}
                          aria-label="Tăng"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Item Total */}
                    <div className="cart-item-total-col">{fmt(itemTotal)}</div>

                    {/* Delete Action */}
                    <div className="cart-item-delete-col">
                      <button
                        className="cart-delete-btn"
                        onClick={() => onRemoveItem?.(item.id)}
                        title="Xóa sản phẩm này"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Panel Footer */}
            <div className="cart-panel-footer">
              <Link to="/" className="cart-continue-link">
                <ArrowLeft size={16} />
                <span>Tiếp tục mua thêm sản phẩm khác</span>
              </Link>
              {onClearCart && (
                <button className="cart-clear-btn" onClick={onClearCart}>
                  Xóa tất cả giỏ hàng
                </button>
              )}
            </div>
          </div>

          {/* ── 4. TWO-COLUMN CHECKOUT / ORDER SECTION (Matches Image 1) ── */}
          <div className="cart-checkout-twocol-grid">
            {/* ── LEFT COLUMN: THÔNG TIN NGƯỜI MUA ── */}
            <div className="buyer-info-card">
              <div className="buyer-info-header">
                <h2 className="buyer-info-title">THÔNG TIN NGƯỜI MUA</h2>
                <p className="buyer-info-subtitle">
                  Để tiếp tục đặt hàng, quý khách xin vui lòng nhập thông tin bên dưới
                </p>
              </div>

              <div className="buyer-form-fields">
                {/* Họ tên */}
                <div className="buyer-field-row">
                  <label className="buyer-label">Họ tên*</label>
                  <div className="buyer-input-wrap">
                    <input
                      type="text"
                      className={`buyer-input ${formErrors.name ? 'input-error' : ''}`}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={buyerInfo.name}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, name: e.target.value }));
                        if (formErrors.name) setFormErrors(prev => ({ ...prev, name: null }));
                      }}
                    />
                    {formErrors.name && <span className="field-error-msg">{formErrors.name}</span>}
                  </div>
                </div>

                {/* SĐT */}
                <div className="buyer-field-row">
                  <label className="buyer-label">SĐT*</label>
                  <div className="buyer-input-wrap">
                    <input
                      type="tel"
                      className={`buyer-input ${formErrors.phone ? 'input-error' : ''}`}
                      placeholder="Ví dụ: 0886976868"
                      value={buyerInfo.phone}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, phone: e.target.value }));
                        if (formErrors.phone) setFormErrors(prev => ({ ...prev, phone: null }));
                      }}
                    />
                    {formErrors.phone && <span className="field-error-msg">{formErrors.phone}</span>}
                  </div>
                </div>

                {/* Email */}
                <div className="buyer-field-row">
                  <label className="buyer-label">Email*</label>
                  <div className="buyer-input-wrap">
                    <input
                      type="email"
                      className={`buyer-input ${formErrors.email ? 'input-error' : ''}`}
                      placeholder="Ví dụ: natcomputer@gmail.com"
                      value={buyerInfo.email}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, email: e.target.value }));
                        if (formErrors.email) setFormErrors(prev => ({ ...prev, email: null }));
                      }}
                    />
                    {formErrors.email && <span className="field-error-msg">{formErrors.email}</span>}
                  </div>
                </div>

                {/* Địa chỉ */}
                <div className="buyer-field-row">
                  <label className="buyer-label">Địa chỉ*</label>
                  <div className="buyer-input-wrap">
                    <input
                      type="text"
                      className={`buyer-input ${formErrors.address ? 'input-error' : ''}`}
                      placeholder="Số nhà, tên đường, tòa nhà..."
                      value={buyerInfo.address}
                      onChange={(e) => {
                        setBuyerInfo(prev => ({ ...prev, address: e.target.value }));
                        if (formErrors.address) setFormErrors(prev => ({ ...prev, address: null }));
                      }}
                    />
                    {formErrors.address && <span className="field-error-msg">{formErrors.address}</span>}
                  </div>
                </div>

                {/* Tỉnh / Thành phố */}
                <div className="buyer-field-row">
                  <label className="buyer-label">Tỉnh/Thành phố*</label>
                  <div className="buyer-input-wrap">
                    <select
                      className="buyer-select"
                      value={buyerInfo.city}
                      onChange={handleCityChange}
                    >
                      {Object.keys(CITY_DISTRICTS).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quận / Huyện */}
                <div className="buyer-field-row">
                  <label className="buyer-label">Quận/Huyện*</label>
                  <div className="buyer-input-wrap">
                    <select
                      className="buyer-select"
                      value={buyerInfo.district}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, district: e.target.value }))}
                    >
                      {(CITY_DISTRICTS[buyerInfo.city] || []).map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Ghi chú */}
                <div className="buyer-field-row">
                  <label className="buyer-label">Ghi chú</label>
                  <div className="buyer-input-wrap">
                    <textarea
                      rows="3"
                      className="buyer-textarea"
                      placeholder="Yêu cầu lắp đặt đặc biệt, thời gian nhận máy, hẹn kỹ thuật..."
                      value={buyerInfo.note}
                      onChange={(e) => setBuyerInfo(prev => ({ ...prev, note: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN: TỔNG TIỀN & 5 ACTION BUTTONS ── */}
            <div className="order-summary-action-card">
              <h2 className="summary-card-title">TỔNG TIỀN</h2>

              {/* Voucher Input Box with Blue Action Button */}
              <div className="summary-voucher-row">
                <input
                  type="text"
                  placeholder="Mã Voucher"
                  className="voucher-code-input"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon(e)}
                />
                <button
                  type="button"
                  className="btn-select-voucher"
                  onClick={() => setIsVoucherModalOpen(true)}
                >
                  <Ticket size={15} />
                  <span>Chọn mã voucher</span>
                </button>
              </div>

              {/* Coupon message feedback */}
              {couponMsg.text && (
                <div className={`cart-voucher-feedback ${couponMsg.type}`}>
                  {couponMsg.text}
                </div>
              )}

              {/* Price Breakdown */}
              <div className="summary-pricing-breakdown">
                <div className="pricing-line">
                  <span className="p-label">Tổng cộng</span>
                  <span className="p-value">{fmt(subtotal)}</span>
                </div>

                <div className="pricing-line">
                  <span className="p-label">Giảm giá Voucher</span>
                  <span className="p-value discount">
                    {discountAmount > 0 ? `-${fmt(discountAmount)}` : '0 VNĐ'}
                  </span>
                </div>

                <div className="pricing-total-highlight">
                  <div className="total-label-box">
                    <span className="main-total-label">Thành tiền</span>
                  </div>
                  <div className="total-amount-box">
                    <span className="main-total-value">{fmt(finalTotal)}</span>
                    <span className="vat-note">(Giá đã bao gồm VAT)</span>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="terms-agreement-row">
                <label className="terms-checkbox-label">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => {
                      setAgreedTerms(e.target.checked);
                      if (formErrors.terms) setFormErrors(prev => ({ ...prev, terms: null }));
                    }}
                  />
                  <span>Tôi đã đọc và đồng ý với các <strong>Điều kiện giao dịch chung</strong> của website</span>
                </label>
                {formErrors.terms && <span className="field-error-msg">{formErrors.terms}</span>}
              </div>

              {/* Action Buttons Grid (Matches Reference Image 1) */}
              <div className="cart-action-buttons-container">
                {/* Row 1: IN BÁO GIÁ & TẢI FILE EXCEL */}
                <div className="btn-group-row">
                  <button
                    type="button"
                    className="btn-dark-teal"
                    onClick={handlePrintQuotation}
                    title="In phiếu báo giá đơn hàng"
                  >
                    <Printer size={16} />
                    <span>IN BÁO GIÁ</span>
                  </button>

                  <button
                    type="button"
                    className="btn-dark-teal"
                    onClick={handleExportExcel}
                    title="Tải file Excel / CSV báo giá"
                  >
                    <FileSpreadsheet size={16} />
                    <span>TẢI FILE EXCEL</span>
                  </button>
                </div>

                {/* Row 2: ĐẶT HÀNG & TRẢ GÓP QUA HỒ SƠ */}
                <div className="btn-group-row">
                  <button
                    type="button"
                    className="btn-prominent-red"
                    onClick={handleCheckoutOrder}
                  >
                    <Check size={18} strokeWidth={3} />
                    <span>ĐẶT HÀNG</span>
                  </button>

                  <button
                    type="button"
                    className="btn-dark-blue"
                    onClick={handleInstallmentOrder}
                  >
                    <CreditCard size={16} />
                    <div className="btn-double-text">
                      <span className="btn-main-txt">TRẢ GÓP QUA HỒ SƠ</span>
                      <span className="btn-sub-txt">CHỈ TỪ {fmt(estimatedMonthlyInstallment)}/THÁNG</span>
                    </div>
                  </button>
                </div>

                {/* Row 3: MUA NGAY - TRẢ SAU HOME PayLater */}
                <button
                  type="button"
                  className="btn-bright-yellow"
                  onClick={handlePayLaterOrder}
                >
                  <div className="paylater-content">
                    <span className="paylater-title">MUA NGAY - TRẢ SAU</span>
                    <span className="paylater-badge">HOME PayLater</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ── 5. EMPTY CART STATE ── */
        <div className="cart-empty-panel">
          <div className="empty-icon-circle">
            <PackageX size={48} strokeWidth={1.5} color="var(--c-muted)" />
          </div>
          <h2 className="empty-title">GIỎ HÀNG CỦA BẠN ĐANG TRỐNG</h2>
          <p className="empty-sub">
            Hãy chọn thêm các sản phẩm PC Gaming, linh kiện cao cấp từ NAT Computer nhé!
          </p>
          <Link to="/" className="btn btn-blue empty-shop-btn">
            <ShoppingCart size={16} />
            <span>TIẾP TỤC MUA SẮM</span>
          </Link>
        </div>
      )}

      {/* ── 6. VOUCHER SELECTION MODAL ── */}
      {isVoucherModalOpen && (
        <div className="cart-modal-backdrop" onClick={() => setIsVoucherModalOpen(false)}>
          <div className="cart-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Ticket size={20} color="#dc2626" />
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>CHỌN MÃ VOUCHER ƯU ĐÃI</h3>
              </div>
              <button className="cart-modal-close" onClick={() => setIsVoucherModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="cart-modal-body">
              {availableCoupons.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {availableCoupons.map(c => {
                    const isSelected = appliedCoupon?.code === c.code || couponCode.toUpperCase() === c.code.toUpperCase();
                    const isEligible = subtotal >= (c.minOrderAmount || 0);

                    return (
                      <div
                        key={c.id || c.code}
                        className={`voucher-card-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleApplyCouponCode(c.code)}
                        style={{
                          border: isSelected ? '2px solid #dc2626' : '1px solid #e2e8f0',
                          borderRadius: '10px',
                          padding: '14px',
                          cursor: 'pointer',
                          background: isSelected ? '#fef2f2' : '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <span style={{ fontWeight: 800, fontSize: '15px', color: '#dc2626' }}>{c.code}</span>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              background: '#fee2e2',
                              color: '#dc2626',
                              padding: '2px 6px',
                              borderRadius: '4px'
                            }}>
                              {c.discountType === 'percent' ? `GIẢM ${c.discountValue}%` : `GIẢM ${fmt(c.discountValue)}`}
                            </span>
                          </div>
                          <p style={{ margin: 0, fontSize: '13px', color: '#475569' }}>{c.description}</p>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            Đơn tối thiểu: {fmt(c.minOrderAmount || 0)}
                          </span>
                        </div>

                        <button
                          type="button"
                          className="btn-apply-voucher-mini"
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: isSelected ? '#16a34a' : '#dc2626',
                            color: '#ffffff',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          {isSelected ? 'ĐÃ CHỌN' : 'ÁP DỤNG'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                  <p>Các mã ưu đãi nổi bật:</p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleApplyCouponCode('NAT500K')}
                      style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      NAT500K (-500.000đ)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCouponCode('FREESHIP')}
                      style={{ padding: '8px 14px', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}
                    >
                      FREESHIP (-100.000đ)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── 9. INSTALLMENT INFO MODAL ── */}
      {isInstallmentModalOpen && (
        <div className="cart-modal-backdrop" onClick={() => setIsInstallmentModalOpen(false)}>
          <div className="cart-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>TRẢ GÓP QUA HỒ SƠ</h3>
              <button className="cart-modal-close" onClick={() => setIsInstallmentModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="cart-modal-body">
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
                Ước tính số tiền trả góp hàng tháng cho đơn hàng <strong>{fmt(finalTotal)}</strong>:
              </p>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', margin: '14px 0', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Kỳ hạn 6 tháng:</span>
                  <strong>{fmt(Math.round(finalTotal / 6))}/tháng</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>Kỳ hạn 12 tháng:</span>
                  <strong style={{ color: '#dc2626' }}>{fmt(Math.round(finalTotal / 12))}/tháng</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>Kỳ hạn 24 tháng:</span>
                  <strong>{fmt(Math.round(finalTotal / 24))}/tháng</strong>
                </div>
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748b' }}>
                * Thủ tục chỉ cần CCCD gắn chip, xét duyệt hồ sơ online trong 15 phút. Vui lòng nhập đầy đủ thông tin người mua và nhấn "ĐẶT HÀNG" để chọn hình thức Trả Góp.
              </p>
              <button
                type="button"
                className="btn-prominent-red"
                style={{ width: '100%', marginTop: '12px' }}
                onClick={() => {
                  setIsInstallmentModalOpen(false);
                  handleCheckoutOrder();
                }}
              >
                TIẾP TỤC ĐẶT HÀNG TRẢ GÓP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 10. HOME PAYLATER MODAL ── */}
      {isPayLaterModalOpen && (
        <div className="cart-modal-backdrop" onClick={() => setIsPayLaterModalOpen(false)}>
          <div className="cart-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cart-modal-header">
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 800 }}>MUA TRƯỚC TRẢ SAU — HOME PAYLATER</h3>
              <button className="cart-modal-close" onClick={() => setIsPayLaterModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="cart-modal-body">
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#334155' }}>
                Mua ngay dàn máy PC / linh kiện hôm nay và chia nhỏ thanh toán qua ví <strong>Home PayLater</strong>:
              </p>
              <ul style={{ fontSize: '13px', color: '#475569', paddingLeft: '20px', lineHeight: 1.8 }}>
                <li>Hạn mức cấp lên đến 25.000.000đ ngay lần đầu đăng ký.</li>
                <li>0% Lãi suất cho kỳ hạn 1 - 3 tháng.</li>
                <li>Không phí ẩn, xét duyệt tức thì qua số điện thoại.</li>
              </ul>
              <button
                type="button"
                className="btn-bright-yellow"
                style={{ width: '100%', marginTop: '12px' }}
                onClick={() => {
                  setIsPayLaterModalOpen(false);
                  handleCheckoutOrder();
                }}
              >
                XÁC NHẬN CHỌN HOME PAYLATER
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
