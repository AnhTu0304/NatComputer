import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShoppingCart, Search, Menu, X, User, LogOut, Package, Heart, ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP);

/* Static nav links — hoisted outside component (Vercel: rendering-hoist-jsx) */
const NAV_LINKS = [
  { label: 'Hệ Thống PC', href: '/category/pc-gaming' },
  { label: 'Linh Kiện',   href: '/category/components' },
  { label: '3D Config',   href: '/build' },
  { label: 'AI Tư Vấn',  href: '/ai' },
  { label: 'Showroom',   href: '/category' },
];

/* BMW circular SVG mark */
const Logo = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" aria-label="NAT Computer">
    <circle cx="18" cy="18" r="17" fill="#1c69d4" />
    <circle cx="18" cy="18" r="13" fill="white" />
    <path d="M18 5 A13 13 0 0 1 31 18 L18 18Z" fill="#1c69d4" />
    <path d="M18 31 A13 13 0 0 1 5 18 L18 18Z" fill="#1c69d4" />
    <circle cx="18" cy="18" r="13" fill="none" stroke="#1c69d4" strokeWidth="1.5" />
  </svg>
);

export default function Navbar({ cartCount = 0, onOpenCart, user, onLogout, onOpenAuth }) {
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  /* Passive scroll listener (Vercel: client-passive-event-listeners) */
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  /* GSAP entrance: slide from top (transform only — GSAP perf skill) */
  useGSAP(() => {
    gsap.from(wrapRef.current, { y: -64, opacity: 0, duration: 0.7, ease: 'power3.out' });
  }, { scope: wrapRef });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setShowSearchInput(false);
    } else {
      navigate('/category');
    }
  };

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Announcement bar */}
      <div className="nav-announce">
        ⚡ PHIÊN SẢN CHỚP NHOÁNG: THẾ HỆ RTX 50-SERIES ĐÃ CẬP BẾN — Nhận ưu đãi sớm nhất
      </div>

      {/* Main navbar */}
      <header ref={wrapRef} className={`nav-root${scrolled ? ' scrolled' : ''}`}>
        <div className="wrap">
          <div className="nav-inner">
            {/* Logo — always returns to homepage */}
            <Link to="/" className="nav-logo" aria-label="NAT Computer Home">
              <Logo />
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-ink)', lineHeight: 1.1 }}>
                  NAT COMPUTER
                </div>
                <div className="t-micro" style={{ color: 'var(--c-blue)', marginTop: 1 }}>AI · 3D · PC STORE</div>
              </div>
            </Link>

            {/* Desktop nav links */}
            <nav className="nav-links" aria-label="Primary navigation">
              {NAV_LINKS.map(l => (
                <Link key={l.href} to={l.href} className="nav-link">{l.label}</Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="nav-actions">
              {showSearchInput ? (
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="text"
                    placeholder="Tìm kiếm PC, VGA..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    autoFocus
                    style={{
                      padding: '4px 10px',
                      fontSize: 13,
                      border: '1px solid var(--c-line-strong)',
                      borderRadius: 4,
                      outline: 'none'
                    }}
                  />
                  <button type="submit" className="nav-icon-btn" aria-label="Submit search">
                    <Search size={18} />
                  </button>
                  <button type="button" className="nav-icon-btn" onClick={() => setShowSearchInput(false)}>
                    <X size={18} />
                  </button>
                </form>
              ) : (
                <button
                  className="nav-icon-btn"
                  aria-label="Search"
                  onClick={() => setShowSearchInput(true)}
                >
                  <Search size={20} strokeWidth={1.5} />
                </button>
              )}

              {/* Cart */}
              <button
                onClick={() => {
                  onOpenCart?.();
                  navigate('/cart');
                }}
                className="nav-icon-btn"
                aria-label={`Giỏ hàng (${cartCount})`}
                style={{ position: 'relative' }}
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2,
                    background: 'var(--c-blue)', color: '#fff',
                    fontSize: 10, fontWeight: 700,
                    width: 16, height: 16, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{cartCount}</span>
                )}
              </button>

              {/* User Account / Auth */}
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    className="nav-user-account-btn logged-in"
                    onClick={() => setUserMenuOpen(v => !v)}
                  >
                    <div className="user-avatar-circle">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="user-name-text">{user.name}</span>
                    <ChevronDown size={14} />
                  </button>

                  {userMenuOpen && (
                    <div className="nav-user-dropdown" onClick={() => setUserMenuOpen(false)}>
                      <div className="dropdown-user-info">
                        <strong>{user.name}</strong>
                        <p>{user.email}</p>
                      </div>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item">
                        <User size={15} />
                        <span>Thông tin tài khoản</span>
                      </button>
                      <button className="dropdown-item">
                        <Package size={15} />
                        <span>Đơn hàng của tôi</span>
                      </button>
                      <button className="dropdown-item">
                        <Heart size={15} />
                        <span>Sản phẩm đã lưu</span>
                      </button>
                      <div className="dropdown-divider" />
                      <button className="dropdown-item logout" onClick={onLogout}>
                        <LogOut size={15} />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button className="nav-user-account-btn" onClick={onOpenAuth}>
                  <User size={18} strokeWidth={1.5} />
                  <span>Đăng nhập</span>
                </button>
              )}

              {/* CTA */}
              <Link to="/ai" className="btn btn-blue" style={{ textDecoration: 'none', height: 40, padding: '0 20px', fontSize: 12 }}>
                TƯ VẤN AI
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="nav-icon-btn"
                aria-label="Toggle navigation"
                style={{ display: 'none' }}
                id="mobile-menu-toggle"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'var(--c-canvas)', borderBottom: '1px solid var(--c-line)', zIndex: 99,
        }}>
          {NAV_LINKS.map(l => (
            <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '14px 24px', borderBottom: '1px solid var(--c-line)', fontSize: 14, color: 'var(--c-ink)', fontWeight: 400 }}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
