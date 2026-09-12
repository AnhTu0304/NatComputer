import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, ShoppingCart, CheckCircle2, Gift, X, Zap } from 'lucide-react';
import { HOT_DEALS_PCS } from '../data/catalogData';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const POPOVER_WIDTH = 320;
const POPOVER_OFFSET_X = 28;
const POPOVER_OFFSET_Y = 0;

export default function HotDealsSection({ items = HOT_DEALS_PCS, onAddToCart, onOpenQuickView }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  const [activeItem, setActiveItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const hoverTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const cardRefsRef = useRef({});

  const fmt = v =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Detect mobile / touch devices
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Global mouse-move tracker for floating popover
  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const pw = Math.min(POPOVER_WIDTH, window.innerWidth - 32);
    const approxH = 400;

    let x = e.clientX + POPOVER_OFFSET_X;
    let y = e.clientY + POPOVER_OFFSET_Y;

    if (x + pw + 8 > window.innerWidth) {
      x = e.clientX - pw - POPOVER_OFFSET_X;
    }

    if (y + approxH > window.innerHeight - 8) {
      y = window.innerHeight - approxH - 8;
    }
    if (y < 8) y = 8;

    setCursorPos({ x, y });
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const scrollBy = dir => {
    const t = trackRef.current;
    if (!t) return;
    const step = 540;
    if (typeof t.scrollBy === 'function') t.scrollBy({ left: dir * step, behavior: 'smooth' });
    else t.scrollLeft += dir * step;
  };

  useGSAP(() => {
    const section = rootRef.current;
    gsap.from('.hd-eyebrow, .hd-title', {
      scrollTrigger: { trigger: section, start: 'top 88%' },
      y: 24, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
    });
    gsap.from('.carousel-card', {
      scrollTrigger: { trigger: section, start: 'top 82%' },
      y: 32, opacity: 0, stagger: 0.07, duration: 0.55, ease: 'power2.out',
    });
  }, { scope: rootRef });

  const handleMouseEnterCard = item => {
    if (isMobile) return;
    clearTimeout(closeTimerRef.current);
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveItem(item);
    }, 180);
  };

  const handleMouseLeaveCard = () => {
    if (isMobile) return;
    clearTimeout(hoverTimerRef.current);
    closeTimerRef.current = setTimeout(() => setActiveItem(null), 200);
  };

  const handleCardClick = item => {
    navigate(`/product/${item.id}`);
  };

  const renderHighlightedText = text => {
    if (!text) return null;
    const parts = text.split(/(thêm\s+[\d\.,]+[\s]?(?:triệu|k|đ|vnđ)?)/gi);
    return parts.map((part, i) =>
      /thêm\s+[\d\.,]+[\s]?(?:triệu|k|đ|vnđ)?/i.test(part) ? (
        <span key={i} className="highlight-red">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getSpecsList = item => {
    if (item.specifications?.length) return item.specifications;
    return [
      `CPU: ${item.specs?.cpu || 'Intel Core / AMD Ryzen'}`,
      `Mainboard: ${item.specs?.mainboard || 'MSI / ASUS DDR5'}`,
      `RAM: ${item.specs?.ram || '32GB High Speed DDR5'}`,
      `SSD: ${item.specs?.ssd || '1TB NVMe PCIe Gen4'}`,
      `VGA: ${item.specs?.gpu || 'NVIDIA GeForce RTX Series'}`,
    ];
  };

  const getPromosList = item => {
    if (item.promotions?.length) return item.promotions;
    return [
      'Upgrade lên SSD 1TB NVMe GEN4 thêm 500K',
      'Upgrade lên RAM 64GB DDR5 thêm 1.400K',
    ];
  };

  const renderPreviewContent = (item, isModal = false) => {
    const hasOrig = item.originalPrice && item.originalPrice > item.price;
    const specs = getSpecsList(item).slice(0, 6);
    const promos = getPromosList(item).slice(0, 4);

    return (
      <>
        <div className="ppv-header">
          {isModal && (
            <button className="ppv-close" onClick={() => setModalItem(null)}>
              <X size={16} color="#fff" />
            </button>
          )}
          <p className="ppv-cat">{item.categoryName || 'Hot Deal Nổi Bật'}</p>
          <h3 className="ppv-title">{item.name}</h3>
        </div>

        <div className="ppv-body">
          <div className="ppv-price-block">
            <div>
              <span className="ppv-label">Giá Hot Deal</span>
              <div className="ppv-price">{fmt(item.price)}</div>
              {hasOrig && <div className="ppv-price-old">{fmt(item.originalPrice)}</div>}
            </div>
            <div className="ppv-divider" />
            <div>
              <span className="ppv-label">Bảo hành</span>
              <div className="ppv-warranty">{item.warranty || '36 Tháng'}</div>
            </div>
          </div>

          <div className="ppv-section">
            <div className="ppv-section-label">
              <span className="ppv-dot" />
              Cấu hình chi tiết
            </div>
            <ul className="ppv-specs">
              {specs.map((s, i) => (
                <li key={i}>
                  <CheckCircle2 size={13} className="ppv-check" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {promos.length > 0 && (
            <div className="ppv-section ppv-section--promo">
              <div className="ppv-section-label">
                <span className="ppv-dot ppv-dot--red" />
                Quà tặng &amp; Ưu đãi kèm
              </div>
              <ul className="ppv-promos">
                {promos.map((p, i) => (
                  <li key={i}>
                    <Gift size={12} className="ppv-gift" />
                    <span>{renderHighlightedText(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <section ref={rootRef} className="hd-section wrap">

      {/* ── Top M-Stripe ── */}
      <div className="hd-m-stripe" />

      {/* ── Section Header ── */}
      <div className="hd-header">
        <div className="hd-eyebrow">
          <span className="eyebrow-line" />
          <Zap size={13} color="var(--c-red)" fill="var(--c-red)" />
          <span className="t-label white-s">KHUYẾN MÃI ĐẶC BIỆT</span>
        </div>

        <div className="hd-title-row">
          <h2 className="hd-title t-d2 white">
            DEAL HOT MỖI NGÀY
            <span className="hd-title-accent"> — KHUYẾN MÃI LIỀN TAY</span>
          </h2>
          <Link to="/category/hot-deals" className="hd-view-all btn btn-outline-dark btn-sm">
            Xem tất cả
          </Link>
        </div>
      </div>

      {/* ── Carousel ── */}
      <div className="hd-carousel-wrapper">
        <button
          className="hd-nav-btn hd-nav-prev"
          aria-label="Cuộn trái"
          onClick={() => scrollBy(-1)}
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="hd-track" ref={trackRef}>
          {items.map(item => {
            const hasOrig = item.originalPrice && item.originalPrice > item.price;
            const disc = hasOrig
              ? Math.round((1 - item.price / item.originalPrice) * 100)
              : 0;

            return (
              <div
                key={item.id}
                ref={el => (cardRefsRef.current[item.id] = el)}
                className="carousel-card"
                onMouseEnter={() => handleMouseEnterCard(item)}
                onMouseLeave={handleMouseLeaveCard}
              >
                {/* Image */}
                <div className="carousel-card-img" onClick={() => handleCardClick(item)}>
                  <img src={item.image} alt={item.name} loading="lazy" />
                  {item.badge && <span className="carousel-card-badge">{item.badge}</span>}
                </div>

                {/* Body */}
                <div className="carousel-card-body">
                  <h3
                    className="carousel-card-title"
                    title={item.name}
                    onClick={() => handleCardClick(item)}
                  >
                    {item.name}
                  </h3>

                  <div className="carousel-card-price-area">
                    <div className="price-primary-row">
                      <span className="price-current">{fmt(item.price)}</span>
                      {hasOrig && (
                        <span className="discount-badge">{item.discount || `-${disc}%`}</span>
                      )}
                    </div>
                    {hasOrig && <div className="price-original">{fmt(item.originalPrice)}</div>}
                  </div>

                  {/* Action Row */}
                  <div className="carousel-card-footer">
                    <button
                      className="btn-add-to-cart"
                      onClick={e => { e.stopPropagation(); onAddToCart?.(item); }}
                    >
                      <ShoppingCart size={14} />
                      THÊM VÀO GIỎ
                    </button>
                    <span className="stock-status-pill">Còn hàng</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="hd-nav-btn hd-nav-next"
          aria-label="Cuộn phải"
          onClick={() => scrollBy(1)}
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>
      </div>

      {/* Desktop Popover */}
      {!isMobile && activeItem && (
        <div
          className="ppv-container"
          style={{
            position: 'fixed',
            top: cursorPos.y,
            left: cursorPos.x,
            width: Math.min(POPOVER_WIDTH, window.innerWidth - 32),
            zIndex: 9999,
            pointerEvents: 'none',
            transition: 'top 0.08s linear, left 0.08s linear',
          }}
        >
          {renderPreviewContent(activeItem)}
        </div>
      )}

      {/* Mobile Modal */}
      {isMobile && modalItem && (
        <div className="preview-modal-overlay" onClick={() => setModalItem(null)}>
          <div className="preview-modal-content" onClick={e => e.stopPropagation()}>
            {renderPreviewContent(modalItem, true)}
          </div>
        </div>
      )}
    </section>
  );
}
