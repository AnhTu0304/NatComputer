import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, CheckCircle2, Gift, X } from 'lucide-react';
import ProductCard from './ProductCard';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const POPOVER_WIDTH = 320;
const POPOVER_OFFSET_X = 28;
const POPOVER_OFFSET_Y = 0;

export default function CategoryCarousel({
  id,
  eyebrow = '— DANH MỤC SẢN PHẨM',
  title = 'DANH MỤC',
  description,
  items = [],
  onAddToCart,
}) {
  const rootRef = useRef(null);
  const trackRef = useRef(null);

  const [activeItem, setActiveItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const hoverTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const fmt = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Detect mobile devices
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Mouse move tracker for specs popover
  const handleMouseMove = useCallback(
    (e) => {
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
    },
    [isMobile]
  );

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const scrollBy = useCallback((dir) => {
    const t = trackRef.current;
    if (!t) return;
    const step = 260;

    if (dir === 1 && t.scrollLeft + t.clientWidth >= t.scrollWidth - 10) {
      if (typeof t.scrollTo === 'function') t.scrollTo({ left: 0, behavior: 'smooth' });
      else t.scrollLeft = 0;
    } else if (dir === -1 && t.scrollLeft <= 5) {
      if (typeof t.scrollTo === 'function') t.scrollTo({ left: t.scrollWidth, behavior: 'smooth' });
      else t.scrollLeft = t.scrollWidth;
    } else {
      if (typeof t.scrollBy === 'function') t.scrollBy({ left: dir * step, behavior: 'smooth' });
      else t.scrollLeft += dir * step;
    }
  }, []);

  // 5-Second Autoplay Loop
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      scrollBy(1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovered, scrollBy]);

  useGSAP(() => {
    gsap.from('.cat-head-ribbon', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 88%' },
      x: -30, opacity: 0, duration: 0.5, ease: 'power2.out',
    });
    gsap.from('.carousel-card', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 82%' },
      y: 20, opacity: 0, stagger: 0.06, duration: 0.45, ease: 'power2.out',
    });
  }, { scope: rootRef });

  const handleMouseEnterCard = (item) => {
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

  const renderHighlightedText = (text) => {
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

  const getSpecsList = (item) => {
    if (item.specifications?.length) return item.specifications;
    return [
      `CPU: ${item.specs?.cpu || 'Intel Core / AMD Ryzen'}`,
      `Mainboard: ${item.specs?.mainboard || 'B760 / B650 DDR5'}`,
      `RAM: ${item.specs?.ram || '16GB / 32GB High Speed'}`,
      `SSD: ${item.specs?.ssd || '512GB / 1TB NVMe PCIe'}`,
      `VGA: ${item.specs?.gpu || 'NVIDIA GeForce Series'}`,
    ];
  };

  const getPromosList = (item) => {
    if (item.promotions?.length) return item.promotions;
    return [
      'Upgrade lên SSD 1TB NVMe GEN4 thêm 500K',
      'Upgrade lên RAM 32GB DDR5 thêm 700K',
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
          <p className="ppv-cat">{item.categoryName || 'Chi Tiết Sản Phẩm'}</p>
          <h3 className="ppv-title">{item.name}</h3>
        </div>

        <div className="ppv-body">
          <div className="ppv-price-block">
            <div>
              <span className="ppv-label">Giá bán</span>
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
              Thông số kỹ thuật
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
                Khuyến mại kèm
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
    <section id={id} ref={rootRef} className="category-section wrap">
      {/* Red Ribbon Section Header */}
      <div className="cat-head-ribbon-bar">
        <div className="cat-head-ribbon">
          <span>{title}</span>
        </div>
        <Link to={`/category/${id || 'all'}`} className="cat-view-all-link">
          Xem tất cả &gt;&gt;
        </Link>
      </div>

      {/* Carousel Track with 5-Second Autoplay and Pause-on-Hover */}
      <div
        className="carousel-track-wrapper pos-rel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className="carousel-nav-btn carousel-nav-prev"
          aria-label="Cuộn trái"
          onClick={() => scrollBy(-1)}
        >
          <ChevronLeft size={18} color="#000" />
        </button>

        <div className="carousel-track-5col" data-carousel-track ref={trackRef}>
          {items.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              onAddToCart={onAddToCart}
              onMouseEnterCard={handleMouseEnterCard}
              onMouseLeaveCard={handleMouseLeaveCard}
            />
          ))}
        </div>

        <button
          className="carousel-nav-btn carousel-nav-next"
          aria-label="Cuộn phải"
          onClick={() => scrollBy(1)}
        >
          <ChevronRight size={18} color="#000" />
        </button>
      </div>

      {/* Desktop Floating Preview Popover */}
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
          <div className="preview-modal-content" onClick={(e) => e.stopPropagation()}>
            {renderPreviewContent(modalItem, true)}
          </div>
        </div>
      )}
    </section>
  );
}