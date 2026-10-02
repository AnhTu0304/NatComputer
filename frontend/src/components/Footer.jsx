import React, { useRef } from 'react';
import { MapPin, Phone, Clock, Navigation } from 'lucide-react';

/* Static showroom data */
const SHOWROOMS = [
  {
    city: 'HÀ NỘI',
    name: 'Showroom Cầu Giấy - Hà Nội',
    address: '456 Trần Duy Hưng, Phường Trung Hòa, Cầu Giấy, Hà Nội',
    phone: '024.3456.7890',
    hours: '08:30 - 21:30 (Cả CN & Ngày Lễ)',
  },
  {
    city: 'TP. HỒ CHÍ MINH',
    name: 'Showroom Quận 7 - TP. HCM',
    address: '123 Nguyễn Văn Linh, Phường Tân Phong, Quận 7, TP. HCM',
    phone: '028.3456.7890',
    hours: '08:30 - 21:30 (Cả CN & Ngày Lễ)',
  },
  {
    city: 'ĐÀ NẴNG',
    name: 'Showroom Hải Châu - Đà Nẵng',
    address: '789 Nguyễn Văn Linh, Phường Nam Dương, Hải Châu, TP. Đà Nẵng',
    phone: '0236.3456.7890',
    hours: '08:30 - 21:30 (Cả CN & Ngày Lễ)',
  },
];

/* Static footer columns — hoisted */
const FOOTER_COLS = {
  'SẢN PHẨM': ['NAT TITAN X', 'NAT PHANTOM', 'NAT AURORA', 'Tự build cấu hình 3D', 'Workstations'],
  'DỊCH VỤ': ['Tản nhiệt nước Custom', 'Bảo hành tận nơi', 'AI Tư vấn tương thích', 'Giao hàng hỏa tốc'],
  'HỖ TRỢ': ['Trung tâm bảo hành', 'Tải Drivers / BIOS', 'Cộng đồng Discord', 'Liên hệ hỗ trợ'],
};

export default function Footer() {
  const rootRef = useRef(null);

  return (
    <div ref={rootRef}>
      {/* ── Upper Showroom Band with Soft Background ── */}
      <section id="showroom" className="footer-showroom-band">
        <div className="wrap">
          <div className="footer-showroom-header">
            <span className="footer-showroom-badge">HỆ THỐNG TRẢI NGHIỆM</span>
            <h3 className="footer-showroom-title">HỆ THỐNG SHOWROOM NAT COMPUTER</h3>
            <p className="footer-showroom-sub">Đến và trải nghiệm thực tế dàn máy PC Gaming & Workstation cao cấp</p>
          </div>

          <div className="footer-showroom-grid">
            {SHOWROOMS.map((sr) => (
              <div key={sr.city} className="footer-showroom-card">
                <div className="footer-showroom-card-head">
                  <div className="footer-showroom-pin">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="footer-showroom-city">{sr.city}</h4>
                    <span className="footer-showroom-name">{sr.name}</span>
                  </div>
                </div>

                <p className="footer-showroom-addr">{sr.address}</p>

                <div className="footer-showroom-meta">
                  <div className="footer-showroom-meta-item">
                    <Phone size={14} className="meta-icon" />
                    <span>Hotline: <strong>{sr.phone}</strong></span>
                  </div>
                  <div className="footer-showroom-meta-item">
                    <Clock size={14} className="meta-icon" />
                    <span>{sr.hours}</span>
                  </div>
                </div>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(sr.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-showroom-direction-btn"
                >
                  <Navigation size={13} />
                  <span>Xem chỉ đường Google Maps</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer — sleek dark ── */}
      <footer id="footer" className="footer-root">

        <div className="wrap">
          {/* Footer grid */}
          <div className="footer-grid">
            {/* Brand */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'var(--sp-md)' }}>
                <svg width="32" height="32" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="17" fill="#1c69d4" />
                  <circle cx="18" cy="18" r="13" fill="white" />
                  <path d="M18 5 A13 13 0 0 1 31 18 L18 18Z" fill="#1c69d4" />
                  <path d="M18 31 A13 13 0 0 1 5 18 L18 18Z" fill="#1c69d4" />
                </svg>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>NAT COMPUTER</span>
              </div>
              <p className="t-body-s" style={{ color: 'rgba(255,255,255,0.5)', maxWidth: 260, marginBottom: 'var(--sp-lg)' }}>
                Kỷ nguyên máy tính đỉnh cao tới ưu hóa bởi AI. Thiết kế tỉ mỉ, chế tác hoàn hảo cho mọi nhu cầu tối thượng.
              </p>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 'var(--sp-sm)' }}>
                {['FB', 'YT', 'IG', 'DC'].map(s => (
                  <a key={s} href="#" style={{
                    width: 36, height: 36, border: '1px solid rgba(255,255,255,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.55)', fontSize: 11, fontWeight: 700,
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#1c69d4'; e.currentTarget.style.color = '#1c69d4'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(FOOTER_COLS).map(([heading, links]) => (
              <div key={heading}>
                <div className="t-label" style={{ color: '#fff', marginBottom: 'var(--sp-md)' }}>
                  {heading}
                </div>
                <ul style={{ listStyle: 'none' }}>
                  {links.map(l => (
                    <li key={l}>
                      <a
                        href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
                        className="footer-link"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 'var(--sp-lg)',
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
          }}>
            <span className="t-body-s" style={{ color: 'rgba(255,255,255,0.35)' }}>
              © 2026 NAT COMPUTER INC. All specifications subject to customization.
            </span>
            <div style={{ display: 'flex', gap: 'var(--sp-lg)' }}>
              <a href="#privacy" className="footer-link" style={{ fontSize: 12 }}>Điều khoản bảo mật</a>
              <a href="#terms"   className="footer-link" style={{ fontSize: 12 }}>Chính sách dịch vụ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
