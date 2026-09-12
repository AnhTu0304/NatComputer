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
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  Tag,
  CheckCircle2,
  Sparkles,
  Ticket,
  PackageX
} from 'lucide-react';
import CategoryCarousel from '../components/CategoryCarousel';
import { GAMING_PCS } from '../data/catalogData';
import api from '../services/api';

gsap.registerPlugin(useGSAP);

export default function CartPage({
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onAddToCart
}) {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // Promo Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMsg, setCouponMsg] = useState({ type: '', text: '' });
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isValidating, setIsValidating] = useState(false);

  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const finalTotal = Math.max(0, subtotal - discountAmount);

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
    }
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    handleApplyCouponCode(couponCode);
  };

  return (
    <div ref={rootRef} className="cart-page-root wrap">
      {/* ── 1. BREADCRUMB ── */}
      <nav className="cart-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="cart-bc-sep" />
        <span className="cart-bc-active">Giỏ hàng</span>
      </nav>

      {/* ── 2. PAGE TITLE ── */}
      <div className="cart-title-row">
        <h1 className="cart-page-title">GIỎ HÀNG CỦA BẠN</h1>
        <span className="cart-title-accent-line" />
      </div>

      {/* ── 3. MAIN CART CONTENT ── */}
      {cartItems.length > 0 ? (
        <div className="cart-main-grid">
          {/* Left Column — Product List */}
          <div className="cart-list-col">
            <div className="cart-list-panel">
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
                        <p className="cart-item-warranty">Bảo hành: 36 Tháng chính hãng</p>
                        <span className="cart-item-stock">✓ Còn hàng tại Showroom</span>
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
                  <span>Tiếp tục mua hàng</span>
                </Link>
                {onClearCart && (
                  <button className="cart-clear-btn" onClick={onClearCart}>
                    Xóa tất cả giỏ hàng
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column — Sticky Order Summary */}
          <div className="cart-summary-col">
            <div className="cart-summary-card">
              <h2 className="cart-summary-title">TỔNG ĐƠN HÀNG</h2>

              <div className="cart-summary-rows">
                <div className="summary-row">
                  <span>Tạm tính ({cartItems.length} sản phẩm):</span>
                  <span className="val">{fmt(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="summary-row discount">
                    <span>Giảm giá voucher:</span>
                    <span className="val-discount">-{fmt(discountAmount)}</span>
                  </div>
                )}

                <div className="summary-row">
                  <span>Phí vận chuyển:</span>
                  <span className="val-shipping">Miễn phí</span>
                </div>

                <div className="summary-divider" />

                <div className="summary-total-row">
                  <span>TỔNG CỘNG:</span>
                  <span className="val-total">{fmt(finalTotal)}</span>
                </div>
                <p className="summary-tax-note">(Đã bao gồm VAT và ưu đãi đặc quyền)</p>
              </div>

              {/* Coupon Form */}
              <form className="cart-coupon-form" onSubmit={handleApplyCoupon}>
                <div className="coupon-input-wrap">
                  <Tag size={15} className="coupon-icon" />
                  <input
                    type="text"
                    placeholder="Mã giảm giá (ví dụ: NAT500K)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn coupon-apply-btn" disabled={isValidating}>
                  {isValidating ? 'ĐANG KIỂM TRA...' : 'ÁP DỤNG'}
                </button>
              </form>

              {/* Available Public Vouchers Chips */}
              {availableCoupons.length > 0 && (
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="#1c69d4" />
                    <span>Mã ưu đãi khả dụng:</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {availableCoupons.map(c => {
                      const isSelected = appliedCoupon?.code === c.code || couponCode.toUpperCase() === c.code.toUpperCase();
                      const isEligible = subtotal >= (c.minOrderAmount || 0);
                      return (
                        <button
                          key={c.id || c.code}
                          type="button"
                          onClick={() => handleApplyCouponCode(c.code)}
                          title={c.description}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            border: isSelected ? '1px solid #1c69d4' : '1px dashed rgba(255,255,255,0.2)',
                            background: isSelected ? 'rgba(28, 105, 212, 0.25)' : 'rgba(255,255,255,0.05)',
                            color: isSelected ? '#60a5fa' : (isEligible ? '#e2e8f0' : '#94a3b8'),
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <Ticket size={11} color={isSelected ? '#60a5fa' : '#3b82f6'} />
                          <span>{c.code}</span>
                          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>
                            {c.discountType === 'percent' ? `-${c.discountValue}%` : `-${Math.round(c.discountValue / 1000)}k`}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {couponMsg.text && (
                <div className={`coupon-msg ${couponMsg.type}`}>{couponMsg.text}</div>
              )}

              {/* Primary Checkout Button */}
              <button
                className="btn cart-checkout-btn"
                onClick={() => navigate('/checkout', {
                  state: {
                    appliedCoupon: appliedCoupon?.code || (discountAmount > 0 ? couponCode.trim().toUpperCase() : null),
                    discountAmount: discountAmount || 0
                  }
                })}
              >
                <span>TIẾN HÀNH ĐẶT HÀNG</span>
                <ArrowRight size={18} />
              </button>

              {/* Trust Reassurance Pills */}
              <div className="cart-trust-box">
                <div className="trust-item">
                  <Truck size={16} />
                  <span>Giao hàng tận nơi toàn quốc COD</span>
                </div>
                <div className="trust-item">
                  <RotateCcw size={16} />
                  <span>Đổi mới trong 30 ngày nếu lỗi</span>
                </div>
                <div className="trust-item">
                  <CreditCard size={16} />
                  <span>Trả góp 0% lãi suất thẻ Credit</span>
                </div>
                <div className="trust-item">
                  <Headphones size={16} />
                  <span>Tư vấn kỹ thuật 24/7 miễn phí</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── 4. EMPTY CART STATE ── */
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

      {/* ── 5. SERVICE BENEFITS BAR (Full-Width) ── */}
      <section className="cart-benefits-bar">
        <div className="benefit-col">
          <Truck size={24} className="b-icon" />
          <div>
            <h4>GIAO HÀNG TOÀN QUỐC</h4>
            <p>Giao hàng trước, kiểm tra trả tiền sau COD</p>
          </div>
        </div>
        <div className="benefit-col">
          <RotateCcw size={24} className="b-icon" />
          <div>
            <h4>ĐỔI TRẢ DỄ DÀNG</h4>
            <p>Đổi mới 1:1 trong vòng 30 ngày đầu</p>
          </div>
        </div>
        <div className="benefit-col">
          <CreditCard size={24} className="b-icon" />
          <div>
            <h4>THANH TOÁN TIỆN LỢI</h4>
            <p>Tiền mặt, chuyển khoản & trả góp 0%</p>
          </div>
        </div>
        <div className="benefit-col">
          <Headphones size={24} className="b-icon" />
          <div>
            <h4>HỖ TRỢ NHIỆT TÌNH</h4>
            <p>Tư vấn kỹ thuật tổng đài miễn phí 24/7</p>
          </div>
        </div>
      </section>

      {/* ── 6. RECOMMENDED PRODUCTS CAROUSEL ── */}
      <section className="cart-recommended-section">
        <CategoryCarousel
          id="cart-rec"
          eyebrow="— DÀNH CHO BẠN"
          title="CÓ THỂ BẠN SẼ THÍCH"
          items={GAMING_PCS}
          onAddToCart={onAddToCart}
        />
      </section>
    </div>
  );
}
