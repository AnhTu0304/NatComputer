import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ChevronRight,
  Zap,
  Clock,
  Flame,
  Heart,
  ShoppingCart,
  CheckCircle2,
  Gift,
  Grid,
  List,
  Filter,
  SlidersHorizontal,
  Truck,
  RotateCcw,
  CreditCard,
  ShieldCheck,
  Headphones
} from 'lucide-react';
import { HOT_DEALS_PCS, GAMING_PCS } from '../data/catalogData';
import api from '../services/api';

gsap.registerPlugin(useGSAP);

const SALE_TABS = [
  { id: 'all', label: 'TẤT CẢ DEALS' },
  { id: 'pc-gaming', label: 'PC GAMING' },
  { id: 'pc-high', label: 'PC CAO CẤP' },
  { id: 'vga', label: 'VGA / GPU' },
  { id: 'cpu', label: 'CPU' },
  { id: 'ram', label: 'RAM' },
  { id: 'ssd', label: 'SSD' },
  { id: 'monitors', label: 'MÀN HÌNH' },
  { id: 'accessories', label: 'PHỤ KIỆN' },
];

const POPOVER_WIDTH = 320;
const POPOVER_OFFSET_X = 28;
const POPOVER_OFFSET_Y = 0;

export default function HotSalePage({ onAddToCart }) {
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('discount-desc');
  const [viewMode, setViewMode] = useState('grid');
  const [wishlist, setWishlist] = useState({});

  // Cursor-following popover states
  const [activeItem, setActiveItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const hoverTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 38, seconds: 45 });

  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Live countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Detect mobile
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Global mousemove for cursor-following popover
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

  const toggleWishlist = (id, e) => {
    e.stopPropagation();
    setWishlist(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCardClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  const [quickChip, setQuickChip] = useState('all');
  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getProducts().then(res => {
      if (isMounted && res && res.products && res.products.length > 0) {
        setLiveProducts(res.products);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const rawSaleItems = liveProducts.length > 0
    ? liveProducts
    : [...HOT_DEALS_PCS, ...GAMING_PCS];

  // 1. Filter by Active Tab
  const tabFilteredItems = rawSaleItems.filter(item => {
    const lowerName = (item.name || '').toLowerCase();
    const lowerCat = (item.category || item.category_id || '').toLowerCase();
    const specsStr = (item.specifications || []).join(' ').toLowerCase() + ' ' + JSON.stringify(item.specs || {}).toLowerCase();

    if (activeTab === 'all') return true;
    if (activeTab === 'pc-gaming') {
      return (['gaming', 'pc-gaming'].includes(lowerCat) || lowerName.includes('gaming')) &&
        !lowerName.includes('chuột') && !lowerName.includes('tai nghe') && !lowerName.includes('bàn phím');
    }
    if (activeTab === 'pc-high') {
      return item.price >= 35000000 || lowerCat === 'workstation' || lowerName.includes('luxury') || lowerName.includes('titan') || lowerName.includes('workstation');
    }
    if (activeTab === 'vga') {
      return (lowerCat === 'components' || lowerCat === 'linh-kien') && (lowerName.includes('vga') || lowerName.includes('card') || lowerName.includes('rtx') || lowerName.includes('radeon'));
    }
    if (activeTab === 'cpu') {
      return (lowerCat === 'components' || lowerCat === 'linh-kien') && (lowerName.includes('cpu') || lowerName.includes('vi xử lý') || lowerName.includes('core i') || lowerName.includes('ryzen'));
    }
    if (activeTab === 'ram') {
      return (lowerCat === 'components' || lowerCat === 'linh-kien') && (lowerName.includes('ram') || lowerName.includes('ddr4') || lowerName.includes('ddr5') || specsStr.includes('ddr5'));
    }
    if (activeTab === 'ssd') {
      return (lowerCat === 'components' || lowerCat === 'linh-kien') && (lowerName.includes('ssd') || lowerName.includes('nvme') || lowerName.includes('ổ cứng'));
    }
    if (activeTab === 'monitors') {
      return ['monitors', 'man-hinh'].includes(lowerCat) || lowerName.includes('màn hình');
    }
    if (activeTab === 'accessories' || activeTab === 'gaming-gear') {
      return lowerCat.includes('gear') || lowerName.includes('phím') || lowerName.includes('chuột') || lowerName.includes('tai nghe') || lowerName.includes('ghế') || lowerName.includes('tay cầm') || lowerName.includes('stream');
    }
    return true;
  });

  // 2. Filter by Quick Chips
  const chipFilteredItems = tabFilteredItems.filter(item => {
    const lowerName = (item.name || '').toLowerCase();
    const specsStr = (item.specifications || []).join(' ').toLowerCase() + ' ' + JSON.stringify(item.specs || {}).toLowerCase();

    if (quickChip === 'all') return true;
    if (quickChip === 'under-15m') return item.price < 15000000;
    if (quickChip === '15m-25m') return item.price >= 15000000 && item.price <= 25000000;
    if (quickChip === '25m-35m') return item.price > 25000000 && item.price <= 35000000;
    if (quickChip === 'above-35m') return item.price > 35000000;
    if (quickChip === 'gpu-rtx') return lowerName.includes('4060') || lowerName.includes('4070') || specsStr.includes('4060') || specsStr.includes('4070');
    if (quickChip === 'in-stock') return item.stock !== 'Hết hàng';
    return true;
  });

  // 3. Sort Items
  const sortedItems = [...chipFilteredItems].sort((a, b) => {
    const discA = a.originalPrice && a.originalPrice > a.price ? (1 - a.price / a.originalPrice) : 0;
    const discB = b.originalPrice && b.originalPrice > b.price ? (1 - b.price / b.originalPrice) : 0;

    if (sortBy === 'discount-desc') {
      return discB - discA;
    }
    if (sortBy === 'price-asc') {
      return a.price - b.price;
    }
    if (sortBy === 'price-desc') {
      return b.price - a.price;
    }
    if (sortBy === 'bestseller') {
      return (b.rating || 5) - (a.rating || 5);
    }
    return 0;
  });

  const firstGridItems = sortedItems.slice(0, 8);
  const secondGridItems = sortedItems.slice(8);

  const featuredDealItem = {
    id: 'featured-flash-deal-1',
    name: 'SUPER PC NAT TITAN - INTEL I9 14900KS / RTX 4090 24GB',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    price: 49990000,
    originalPrice: 65990000,
    soldPercent: 78,
    stockLeft: 4,
    specs: ['Intel Core i9 14900KS Special Edition', 'ASUS ROG MAXIMUS Z790 HERO', '64GB Corsair Dominator Titanium DDR5', 'NVIDIA GeForce RTX 4090 24GB OG', '2TB NVMe PCIe 4.0 Gen4 M.2 SSD'],
  };

  return (
    <div ref={rootRef} className="hotsale-page-root wrap">
      {/* ── 1. BREADCRUMB ── */}
      <nav className="hotsale-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="bc-sep" />
        <span className="bc-active">HOT SALE</span>
      </nav>

      {/* ── 2. HERO SALE BANNER ── */}
      <section className="hotsale-hero-banner">
        <div className="hero-banner-content">
          <div className="hero-badge">
            <Zap size={14} fill="#fff" color="#fff" />
            <span>LIMITED DEAL - GIẢM TỚI 50%</span>
          </div>

          <h1 className="hero-banner-title">
            HOT SALE <span className="highlight-red">— DEAL GAMING BÙNG NỔ</span>
          </h1>

          <p className="hero-banner-sub">
            Sở hữu dàn PC Gaming RTX 40-Series & 50-Series đỉnh cao với mức giá ưu đãi chưa từng có tại NAT Computer. Số lượng deal có hạn!
          </p>

          {/* Realtime Countdown Timer */}
          <div className="hero-timer-box">
            <span className="timer-label"><Clock size={16} /> KẾT THÚC SAU:</span>
            <div className="timer-digits">
              <div className="time-unit">
                <span className="num">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="unit">GIỜ</span>
              </div>
              <span className="colon">:</span>
              <div className="time-unit">
                <span className="num">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="unit">PHÚT</span>
              </div>
              <span className="colon">:</span>
              <div className="time-unit">
                <span className="num">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="unit">GIÂY</span>
              </div>
            </div>
          </div>

          <a href="#sale-products" className="btn btn-red hero-cta-btn">
            XEM DEAL NGAY
          </a>
        </div>

        <div className="hero-banner-visual">
          <div className="discount-pill-glow">-50% OFF</div>
          <img
            src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=700&q=80"
            alt="PC Gaming High End Hot Sale"
          />
        </div>
      </section>

      {/* ── 3. SALE CATEGORY TABS ── */}
      <div className="hotsale-tabs-bar">
        {SALE_TABS.map(tab => (
          <button
            key={tab.id}
            className={`sale-tab-item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 4. PRODUCT LISTING TOOLBAR & FILTER CHIPS ── */}
      <div id="sale-products" className="hotsale-toolbar">
        <div className="toolbar-left">
          <h2>Sản phẩm HOT SALE</h2>
          <span className="product-count">({sortedItems.length} sản phẩm đang giảm giá)</span>
        </div>

        <div className="toolbar-right">
          <div className="sort-control">
            <span>Sắp xếp theo:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="discount-desc">Giảm giá nhiều nhất</option>
              <option value="price-asc">Giá từ thấp đến cao</option>
              <option value="price-desc">Giá từ cao đến thấp</option>
              <option value="bestseller">Bán chạy nhất</option>
            </select>
          </div>

          <div className="view-mode-toggles">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filter-chips-row">
        <span className="chip-label">Lọc nhanh:</span>
        <button
          className={`chip-item ${quickChip === 'all' ? 'active' : ''}`}
          onClick={() => setQuickChip('all')}
        >
          Tất cả giá
        </button>
        <button
          className={`chip-item ${quickChip === 'under-15m' ? 'active' : ''}`}
          onClick={() => setQuickChip('under-15m')}
        >
          Dưới 15 triệu
        </button>
        <button
          className={`chip-item ${quickChip === '15m-25m' ? 'active' : ''}`}
          onClick={() => setQuickChip('15m-25m')}
        >
          15tr - 25tr
        </button>
        <button
          className={`chip-item ${quickChip === '25m-35m' ? 'active' : ''}`}
          onClick={() => setQuickChip('25m-35m')}
        >
          25tr - 35tr
        </button>
        <button
          className={`chip-item ${quickChip === 'above-35m' ? 'active' : ''}`}
          onClick={() => setQuickChip('above-35m')}
        >
          Trên 35 triệu
        </button>
        <button
          className={`chip-item ${quickChip === 'gpu-rtx' ? 'active' : ''}`}
          onClick={() => setQuickChip('gpu-rtx')}
        >
          GPU RTX 4060 / 4070
        </button>
        <button
          className={`chip-item ${quickChip === 'in-stock' ? 'active' : ''}`}
          onClick={() => setQuickChip('in-stock')}
        >
          Sẵn hàng Showroom
        </button>
      </div>

      {/* ── 5. PRODUCT GRID PART 1 ── */}
      <div className="hotsale-products-grid">
        {sortedItems.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', gridColumn: '1 / -1', background: '#fff', borderRadius: 8, border: '1px dashed #cbd5e1' }}>
            <Zap size={36} color="#94a3b8" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#334155', marginBottom: 6 }}>Không tìm thấy sản phẩm phù hợp với bộ lọc</h3>
            <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>Vui lòng thử chọn khoảng giá hoặc tab danh mục khác</p>
            <button className="btn btn-outline-dark btn-sm" onClick={() => { setActiveTab('all'); setQuickChip('all'); }}>
              Đặt lại bộ lọc
            </button>
          </div>
        )}
        {firstGridItems.map(item => {
          const hasOrig = item.originalPrice && item.originalPrice > item.price;
          const disc = hasOrig ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
          const isWish = !!wishlist[item.id];

          return (
            <div
              key={item.id}
              className="carousel-card hotsale-card"
              onMouseEnter={() => handleMouseEnterCard(item)}
              onMouseLeave={handleMouseLeaveCard}
            >
              <button
                className={`wishlist-btn ${isWish ? 'active' : ''}`}
                onClick={(e) => toggleWishlist(item.id, e)}
                title="Thêm vào yêu thích"
              >
                <Heart size={16} fill={isWish ? '#dc2626' : 'none'} color={isWish ? '#dc2626' : '#94a3b8'} />
              </button>

              <div className="carousel-card-img" onClick={() => handleCardClick(item)}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="hotsale-badge">-{disc || 20}%</span>
              </div>

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
                  </div>
                  {hasOrig && <div className="price-original">{fmt(item.originalPrice)}</div>}
                </div>

                <div className="carousel-card-footer">
                  <button
                    className="btn-add-to-cart"
                    onClick={(e) => { e.stopPropagation(); onAddToCart?.(item); }}
                  >
                    <ShoppingCart size={14} />
                    THÊM VÀO GIỎ
                  </button>
                  <span className="stock-status-pill">Còn 5 suất</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 6. FEATURED FLASH DEAL BANNER (Giữa Trang) ── */}
      <section className="featured-flash-deal-card">
        <div className="flash-deal-badge">
          <Flame size={18} fill="#ff4d4f" color="#ff4d4f" />
          <span>FLASH DEAL ĐỘC QUYỀN TRONG NGÀY</span>
        </div>

        <div className="flash-deal-grid">
          <div className="flash-deal-img-box" onClick={() => navigate('/product/featured-flash-deal-1')}>
            <img src={featuredDealItem.image} alt={featuredDealItem.name} />
            <div className="flash-save-tag">TIẾT KIỆM 16.000.000đ</div>
          </div>

          <div className="flash-deal-info">
            <h3 className="flash-deal-title">{featuredDealItem.name}</h3>

            <div className="flash-deal-prices">
              <span className="current-sale">{fmt(featuredDealItem.price)}</span>
              <span className="old-orig">{fmt(featuredDealItem.originalPrice)}</span>
              <span className="badge-disc">-24% OFF</span>
            </div>

            <div className="flash-progress-box">
              <div className="progress-labels">
                <span>🔥 Đã bán: {featuredDealItem.soldPercent}%</span>
                <span>Chỉ còn {featuredDealItem.stockLeft} bộ cuối cùng</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${featuredDealItem.soldPercent}%` }} />
              </div>
            </div>

            <ul className="flash-specs-list">
              {featuredDealItem.specs.map((s, i) => (
                <li key={i}>
                  <CheckCircle2 size={14} className="check-ic" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <button
              className="btn btn-red flash-buy-btn"
              onClick={() => onAddToCart?.(featuredDealItem)}
            >
              <ShoppingCart size={18} />
              <span>MUA NGAY DEAL ĐỘC QUYỀN này</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── 7. PRODUCT GRID PART 2 ── */}
      <div className="hotsale-products-grid" style={{ marginTop: 40 }}>
        {secondGridItems.map(item => {
          const hasOrig = item.originalPrice && item.originalPrice > item.price;
          const disc = hasOrig ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;
          const isWish = !!wishlist[item.id];

          return (
            <div
              key={item.id}
              className="carousel-card hotsale-card"
              onMouseEnter={() => handleMouseEnterCard(item)}
              onMouseLeave={handleMouseLeaveCard}
            >
              <button
                className={`wishlist-btn ${isWish ? 'active' : ''}`}
                onClick={(e) => toggleWishlist(item.id, e)}
                title="Thêm vào yêu thích"
              >
                <Heart size={16} fill={isWish ? '#dc2626' : 'none'} color={isWish ? '#dc2626' : '#94a3b8'} />
              </button>

              <div className="carousel-card-img" onClick={() => handleCardClick(item)}>
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="hotsale-badge">-{disc || 18}%</span>
              </div>

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
                  </div>
                  {hasOrig && <div className="price-original">{fmt(item.originalPrice)}</div>}
                </div>

                <div className="carousel-card-footer">
                  <button
                    className="btn-add-to-cart"
                    onClick={(e) => { e.stopPropagation(); onAddToCart?.(item); }}
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

      {/* Pagination */}
      <div className="hotsale-pagination">
        <button className="page-btn active">1</button>
        <button className="page-btn">2</button>
        <button className="page-btn">3</button>
        <button className="page-btn">4</button>
        <button className="page-btn">Next ›</button>
      </div>

      {/* ── 8. CURSOR-FOLLOWING SPEC HOVER PREVIEW POPOVER ── */}
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
          <div className="ppv-header">
            <p className="ppv-cat">{activeItem.categoryName || 'HOT SALE PC'}</p>
            <h3 className="ppv-title">{activeItem.name}</h3>
          </div>
          <div className="ppv-body">
            <div className="ppv-price-block">
              <div>
                <span className="ppv-label">Giá Hot Sale</span>
                <div className="ppv-price">{fmt(activeItem.price)}</div>
                {activeItem.originalPrice && <div className="ppv-price-old">{fmt(activeItem.originalPrice)}</div>}
              </div>
              <div className="ppv-divider" />
              <div>
                <span className="ppv-label">Bảo hành</span>
                <div className="ppv-warranty">36 Tháng</div>
              </div>
            </div>
            <div className="ppv-section">
              <div className="ppv-section-label">
                <span className="ppv-dot" />
                Cấu hình khuyến mãi
              </div>
              <ul className="ppv-specs">
                {(activeItem.specifications || [
                  `CPU: ${activeItem.specs?.cpu || 'Intel Core i7 / AMD Ryzen 7'}`,
                  `RAM: ${activeItem.specs?.ram || '32GB DDR5'}`,
                  `VGA: ${activeItem.specs?.gpu || 'RTX 4070 Ti SUPER 16GB'}`,
                  `SSD: ${activeItem.specs?.ssd || '1TB NVMe Gen4'}`,
                ]).map((s, i) => (
                  <li key={i}>
                    <CheckCircle2 size={13} className="ppv-check" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── 9. TRUST SERVICE BAR ── */}
      <section className="cart-benefits-bar" style={{ marginTop: 60 }}>
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
          <ShieldCheck size={24} className="b-icon" />
          <div>
            <h4>BẢO HÀNH CHÍNH HÃNG</h4>
            <p>Cam kết 100% linh kiện mới chính hãng 36T</p>
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
    </div>
  );
}
