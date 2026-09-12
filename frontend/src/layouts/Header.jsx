import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  PhoneCall,
  Wrench,
  ChevronRight,
  ChevronDown,
  Menu,
  Monitor,
  Cpu,
  Gamepad2,
  Tv,
  Box,
  Layers,
  MapPin,
  Globe,
  HardDrive,
  Headphones,
  Sparkles,
  Volume2,
  ShieldCheck,
  Wifi,
  Server,
  Package
} from 'lucide-react';

/* BMW / NAT Computer Circular Logo */
const Logo = () => (
  <div className="hdr-logo-wrapper">
    <svg width="36" height="36" viewBox="0 0 36 36" aria-label="NAT Computer">
      <circle cx="18" cy="18" r="17" fill="#1c69d4" />
      <circle cx="18" cy="18" r="13" fill="white" />
      <path d="M18 5 A13 13 0 0 1 31 18 L18 18Z" fill="#1c69d4" />
      <path d="M18 31 A13 13 0 0 1 5 18 L18 18Z" fill="#1c69d4" />
      <circle cx="18" cy="18" r="13" fill="none" stroke="#1c69d4" strokeWidth="1.5" />
    </svg>
    <div className="header-logo-text">
      <span className="brand-name">NAT COMPUTER</span>
      <span className="brand-sub">GAMING & WORKSTATION</span>
    </div>
  </div>
);

const MAIN_CATEGORIES = [
  { id: 'pc-gaming', label: 'PC GAMING', icon: Gamepad2, href: '/category/pc-gaming' },
  { id: 'pc-workstation', label: 'PC WORKSTATION 2D 3D', icon: Cpu, href: '/category/workstation' },
  { id: 'pc-amd', label: 'PC AMD GAMING', icon: Layers, href: '/category/pc-amd' },
  { id: 'pc-mini', label: 'PC MINI', icon: Box, href: '/category/pc-mini' },
  { id: 'pc-office', label: 'PC VĂN PHÒNG', icon: Monitor, href: '/category/pc-office' },
  { id: 'gaming-gear', label: 'GAMING GEAR', icon: Headphones, href: '/category/gaming-gear' },
];

const DROPDOWN_CATEGORIES = [
  {
    id: 'pc-gaming',
    label: 'PC GAMING',
    icon: Gamepad2,
    href: '/category/pc-gaming',
    hasFlyout: true,
    subItems: ['PC Gaming Giá Rẻ', 'PC Stream Game', 'PC Gaming Premium', 'PC Core Ultra', 'PC RTX 4060 / 4070', 'PC RTX 5070 / 5080', 'PC Esport Valorant / CS2', 'PC AAA 4K Gaming'],
    brands: ['Intel', 'ASUS ROG', 'MSI GAMING', 'GIGABYTE AORUS', 'Corsair', 'NZXT', 'Lian Li'],
  },
  {
    id: 'pc-workstation',
    label: 'PC WORKSTATION 2D 3D',
    icon: Cpu,
    href: '/category/workstation',
    hasFlyout: true,
    subItems: ['Render 3D / V-Ray', 'Deep Learning AI', 'Dựng Phim Premiere 4K/8K', 'Kiến Trúc Lumion', 'Threadripper 7000', 'Workstation Dual Xeon'],
    brands: ['ASUS ProArt', 'NVIDIA Quadro', 'AMD Threadripper', 'Intel Xeon', 'Kingston Fury', 'Samsung Pro'],
  },
  {
    id: 'pc-amd',
    label: 'PC AMD GAMING',
    icon: Layers,
    href: '/category/pc-amd',
    hasFlyout: true,
    subItems: ['Ryzen 5 7600 Gaming', 'Ryzen 7 7800X3D Champion', 'Ryzen 7 9800X3D Mới', 'Radeon RX 7800XT', 'Radeon RX 7900XTX'],
    brands: ['AMD Ryzen', 'Radeon', 'ASUS TUF', 'Sapphire', 'PowerColor', 'ASRock'],
  },
  {
    id: 'pc-mini',
    label: 'PC MINI',
    icon: Box,
    href: '/category/pc-mini',
    hasFlyout: true,
    subItems: ['Mini ITX Gaming', 'Mini PC Văn Phòng', 'Mini All White RGB', 'Case Bể Cá Mini'],
    brands: ['Lian Li A4-H2O', 'SSUPD Meshlicious', 'Cooler Master NR200P', 'FormD T1'],
  },
  {
    id: 'pc-office',
    label: 'PC VĂN PHÒNG',
    icon: Monitor,
    href: '/category/pc-office',
    hasFlyout: true,
    subItems: ['PC Kế Toán / Doanh Nghiệp', 'PC Học Tập Giá Tốt', 'PC Core i3 / i5 Slim', 'Máy Tính Đồng Bộ 24/7'],
    brands: ['Dell', 'HP', 'Lenovo', 'Intel', 'Kingston'],
  },
  {
    id: 'pc-ai',
    label: 'PC AI - TRÍ TUỆ NHÂN TẠO',
    icon: Sparkles,
    href: '/category/pc-ai',
    hasFlyout: true,
    subItems: ['Mô hình LLM Local', 'Stable Diffusion Tạo Ảnh', 'Deep Learning Server', 'Multi-GPU RTX 4090 / 5090'],
    brands: ['NVIDIA AI', 'PyTorch', 'TensorFlow', 'ASUS AI Engine'],
  },
  {
    id: 'components',
    label: 'Linh kiện máy tính',
    icon: HardDrive,
    href: '/category/components',
    hasFlyout: true,
    subItems: ['Card Màn Hình (VGA)', 'Bộ Vi Xử Lý (CPU)', 'Bo Mạch Chủ (Mainboard)', 'Bộ Nhớ RAM DDR4/DDR5', 'Ổ Cứng SSD M.2 NVMe', 'Nguồn Máy Tính (PSU)', 'Vỏ Case Máy Tính', 'Tản Nhiệt Nước / Khí'],
    brands: ['ASUS', 'MSI', 'Gigabyte', 'Corsair', 'Samsung', 'Kingston', 'Thermalright', 'NZXT'],
  },
  {
    id: 'monitors',
    label: 'Màn hình máy tính',
    icon: Tv,
    href: '/category/monitors',
    hasFlyout: true,
    subItems: ['Màn Hình Gaming 144Hz - 240Hz', 'Màn Hình Đồ Họa Chuẩn Màu', 'Màn Hình Cong Ultrawide', 'Màn Hình 2K / 4K / OLED', 'Màn Hình Văn Phòng'],
    brands: ['ASUS ROG', 'LG UltraGear', 'Samsung Odyssey', 'Dell UltraSharp', 'BenQ ZOWIE', 'AOC Gaming'],
  },
  {
    id: 'gaming-gear',
    label: 'Gaming Gear',
    icon: Headphones,
    href: '/category/gaming-gear',
    hasFlyout: true,
    subItems: [
      'Thiết Bị Stream',
      'Bàn Phím',
      'Chuột',
      'Tai Nghe Chơi Game',
      'Tay Cầm Chơi Game',
      'GHẾ GAMING',
      'Micro',
      'Phụ Kiện'
    ],
    brands: ['AndaSeat', 'ASUS', 'AULA', 'DAREU', 'E-DRA', 'Elgato', 'HyperX', 'Logitech', 'Razer', 'Steelseries', 'VOICSKY', 'Khác'],
  },
  {
    id: 'pc-combo',
    label: 'Full Bộ PC Kèm Màn Hình',
    icon: Package,
    href: '/category/pc-combo',
    hasFlyout: false,
  },
  {
    id: 'speakers',
    label: 'Loa máy tính',
    icon: Volume2,
    href: '/category/speakers',
    hasFlyout: false,
  },
  {
    id: 'software',
    label: 'Phần mềm',
    icon: ShieldCheck,
    href: '/category/software',
    hasFlyout: false,
  },
  {
    id: 'network',
    label: 'CARD MẠNG KHÔNG DÂY',
    icon: Wifi,
    href: '/category/network',
    hasFlyout: false,
  },
  {
    id: 'virtualization',
    label: 'PC GIẢ LẬP ẢO HÓA',
    icon: Server,
    href: '/category/virtualization',
    hasFlyout: false,
  }
];

export default function Header({ cartCount = 0, user, onLogout }) {
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [stickyCatMenuOpen, setStickyCatMenuOpen] = useState(false);
  const [hoveredCatId, setHoveredCatId] = useState('gaming-gear');

  const catMenuRef = useRef(null);
  const stickyCatMenuRef = useRef(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catMenuRef.current && !catMenuRef.current.contains(e.target)) {
        setCatMenuOpen(false);
      }
      if (stickyCatMenuRef.current && !stickyCatMenuRef.current.contains(e.target)) {
        setStickyCatMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Stable Hysteresis Scroll Listener
  useEffect(() => {
    let active = false;
    const handleScroll = () => {
      const y = window.scrollY;
      if (!active && y > 200) {
        active = true;
        setScrolled(true);
      } else if (active && y < 100) {
        active = false;
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
    } else {
      navigate('/category');
    }
  };

  const activeCategory = DROPDOWN_CATEGORIES.find(c => c.id === hoveredCatId) || DROPDOWN_CATEGORIES[0];

  const renderMegaMenu = (closeFn) => (
    <div className="mega-menu-flyout-container">
      {/* CỘT TRÁI: DANH SÁCH MENU DỌC */}
      <div className="mega-menu-sidebar">
        {DROPDOWN_CATEGORIES.map((item) => {
          const isHovered = item.id === hoveredCatId;
          return (
            <div
              key={item.id}
              className={`mega-sidebar-item ${isHovered ? 'active' : ''}`}
              onMouseEnter={() => setHoveredCatId(item.id)}
              onClick={() => {
                navigate(item.href);
                closeFn();
              }}
            >
              <span className="mega-sidebar-label">{item.label}</span>
              {item.hasFlyout && <ChevronRight size={14} className="mega-sidebar-arrow" />}
            </div>
          );
        })}
      </div>

      {/* CỘT PHẢI: CHI TIẾT DANH MỤC CON + THƯƠNG HIỆU + BANNER */}
      {activeCategory && activeCategory.hasFlyout && (
        <div className="mega-menu-content-panel">
          <div className="mega-panel-main">
            {/* 1. Lưới các danh mục con (chữ cam đỏ đậm) */}
            <div className="mega-subitems-grid">
              {(activeCategory.subItems || []).map((sub, idx) => (
                <Link
                  key={idx}
                  to={`${activeCategory.href}?sub=${encodeURIComponent(sub)}`}
                  className="mega-subitem-link"
                  onClick={closeFn}
                >
                  {sub}
                </Link>
              ))}
            </div>

            {/* 2. Dải thương hiệu chính hãng bên dưới */}
            {activeCategory.brands && activeCategory.brands.length > 0 && (
              <div className="mega-brands-section">
                <div className="mega-brands-grid">
                  {activeCategory.brands.map((brand, bIdx) => (
                    <div
                      key={bIdx}
                      className="mega-brand-chip"
                      onClick={() => {
                        navigate(`${activeCategory.href}?brand=${encodeURIComponent(brand)}`);
                        closeFn();
                      }}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Banner Quảng cáo tư vấn Build PC bên phải */}
          <div className="mega-promo-banner-box" onClick={() => { navigate('/build'); closeFn(); }}>
            <div className="mega-banner-tag">NAT COMPUTER</div>
            <div className="mega-banner-title">TƯ VẤN BUILD PC THEO NHU CẦU</div>
            <div className="mega-banner-pc-img">
              <img
                src="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80"
                alt="Build PC Gaming"
              />
            </div>
            <div className="mega-banner-hotline">
              HOTLINE: <span>088.697.6868</span>
            </div>
            <button className="mega-banner-cta-btn">XEM NGAY</button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <header className="site-header">
      {/* ═══════════════════════════════════════════════════════
         1. NORMAL HEADER WRAPPER (ALWAYS RETAINED IN DOM FLOW)
         ═══════════════════════════════════════════════════════ */}
      <div className="normal-header-wrapper">
        {/* TẦNG 1: TOP DARK STRIP */}
        <div className="header-top-strip">
          <div className="wrap hdr-top-flex">
            <div className="hdr-top-left-links">
              <Link to="/showroom" className="top-badge-pill">
                <MapPin size={13} />
                <span>Hệ thống showroom</span>
              </Link>

              <a href="tel:0886976868" className="top-badge-pill">
                <PhoneCall size={13} />
                <span>Bán hàng trực tuyến</span>
              </a>

              <Link to="/category" className="top-link-txt">
                Trang tin công nghệ
              </Link>

              <Link to="/build" className="top-badge-pill highlight-pill">
                <Globe size={13} />
                <span>TƯ VẤN BUILD PC</span>
              </Link>

              <Link to="/ai" className="top-link-txt">
                Trợ lý AI phần cứng
              </Link>
            </div>

            <div className="hdr-top-right-auth">
              {user ? (
                <div className="user-auth-links">
                  {user.role === 'admin' && (
                    <>
                      <span className="auth-admin-badge" onClick={() => navigate('/admin')}>
                        ⚡ Quản Trị Admin
                      </span>
                      <span className="auth-sep">|</span>
                    </>
                  )}
                  <span className="auth-action-link" onClick={() => navigate('/profile')}>
                    Tài khoản ({user.name})
                  </span>
                  <span className="auth-sep">|</span>
                  <span className="auth-action-link logout-link" onClick={onLogout}>
                    Đăng xuất
                  </span>
                </div>
              ) : (
                <div className="user-auth-links">
                  <span className="auth-action-link" onClick={() => navigate('/login')}>
                    Đăng nhập
                  </span>
                  <span className="auth-sep">|</span>
                  <span className="auth-action-link" onClick={() => navigate('/register')}>
                    Đăng ký
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TẦNG 2: MAIN HEADER ROW */}
        <div className="header-main-row">
          <div className="wrap hdr-main-flex">
            <Link to="/" className="hdr-logo-link">
              <Logo />
            </Link>

            <div className="hdr-search-container">
              <form onSubmit={handleSearchSubmit} className="hdr-search-inline-box">
                <input
                  type="text"
                  className="hdr-search-input"
                  placeholder="Tìm kiếm sản phẩm, Gaming Gear, linh kiện, PC Gaming..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                />
                <button type="submit" className="hdr-search-btn" title="Tìm kiếm">
                  <Search size={18} />
                </button>
              </form>
            </div>

            <div className="hdr-utility-capsules">
              <a href="tel:0886976868" className="utility-capsule-item">
                <div className="capsule-ic-circle">
                  <PhoneCall size={16} />
                </div>
                <div className="capsule-text-col">
                  <span className="capsule-label">Hotline mua hàng</span>
                  <span className="capsule-val">088.697.6868</span>
                </div>
              </a>

              <Link to="/build" className="utility-capsule-item">
                <div className="capsule-ic-circle">
                  <Wrench size={16} />
                </div>
                <div className="capsule-text-col">
                  <span className="capsule-label">Xây dựng</span>
                  <span className="capsule-val">Cấu hình PC</span>
                </div>
              </Link>

              <div className="utility-capsule-item cart-capsule-item" onClick={() => navigate('/cart')}>
                <div className="capsule-ic-circle cart-circle pos-rel">
                  <ShoppingCart size={16} />
                  {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
                </div>
                <div className="capsule-text-col">
                  <span className="capsule-val bold-txt">Giỏ hàng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TẦNG 3: CATEGORY NAV ROW */}
        <div className="header-category-row">
          <div className="wrap hdr-cat-flex">
            <div
              ref={catMenuRef}
              className="hdr-main-cat-wrapper pos-rel"
            >
              <button
                type="button"
                className="hdr-main-cat-btn"
                onClick={() => setCatMenuOpen((v) => !v)}
              >
                <Menu size={18} />
                <span>DANH MỤC SẢN PHẨM</span>
                <ChevronDown size={14} className={`cat-arrow ${catMenuOpen ? 'open' : ''}`} />
              </button>

              {catMenuOpen && renderMegaMenu(() => setCatMenuOpen(false))}
            </div>

            <nav className="hdr-cat-nav-list">
              {MAIN_CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <Link key={cat.id} to={cat.href} className="hdr-cat-item-link">
                    <div className="cat-item-ic-wrap">
                      <IconComp size={15} />
                    </div>
                    <span>{cat.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         2. INDEPENDENT STICKY OVERLAY BAR
         ═══════════════════════════════════════════════════════ */}
      <div className={`sticky-header-fixed-bar ${scrolled ? 'show' : ''}`}>
        <div className="wrap sticky-bar-flex">
          {/* Left: Category Dropdown Button */}
          <div
            ref={stickyCatMenuRef}
            className="hdr-main-cat-wrapper pos-rel"
          >
            <button
              type="button"
              className="hdr-main-cat-btn"
              onClick={() => setStickyCatMenuOpen((v) => !v)}
            >
              <Menu size={18} />
              <span>DANH MỤC SẢN PHẨM</span>
              <ChevronDown size={14} className={`cat-arrow ${stickyCatMenuOpen ? 'open' : ''}`} />
            </button>

            {stickyCatMenuOpen && renderMegaMenu(() => setStickyCatMenuOpen(false))}
          </div>

          {/* Center: Full Inline Search Bar */}
          <div className="hdr-search-container">
            <form onSubmit={handleSearchSubmit} className="hdr-search-inline-box">
              <input
                type="text"
                className="hdr-search-input"
                placeholder="Tìm kiếm Gaming Gear, PC Gaming..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
              <button type="submit" className="hdr-search-btn" title="Tìm kiếm">
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Right: Full Utility Capsules Group */}
          <div className="hdr-utility-capsules">
            <a href="tel:0886976868" className="utility-capsule-item">
              <div className="capsule-ic-circle">
                <PhoneCall size={16} />
              </div>
              <div className="capsule-text-col">
                <span className="capsule-label">Hotline</span>
                <span className="capsule-val">088.697.6868</span>
              </div>
            </a>

            <Link to="/build" className="utility-capsule-item">
              <div className="capsule-ic-circle">
                <Wrench size={16} />
              </div>
              <div className="capsule-text-col">
                <span className="capsule-label">Xây dựng</span>
                <span className="capsule-val">Cấu hình PC</span>
              </div>
            </Link>

            <div className="utility-capsule-item cart-capsule-item" onClick={() => navigate('/cart')}>
              <div className="capsule-ic-circle cart-circle pos-rel">
                <ShoppingCart size={16} />
                {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
              </div>
              <div className="capsule-text-col">
                <span className="capsule-val bold-txt">Giỏ hàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
