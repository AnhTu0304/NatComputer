import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Box, Sparkles, MousePointerClick, Layers } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function HeroBanner() {
  const rootRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hb-card', { y: 30, opacity: 0, duration: 0.7 });
    tl.from('.hb-eyebrow', { y: 20, opacity: 0, duration: 0.5 }, '-=0.4');
    tl.from('.hb-title', { y: 30, opacity: 0, duration: 0.7 }, '-=0.3');
    tl.from('.hb-desc', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
    tl.from('.hb-cta', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3');
    tl.from('.hb-features', { y: 16, opacity: 0, duration: 0.5 }, '-=0.2');
  }, { scope: rootRef });

  return (
    <section id="hero" ref={rootRef} className="hb-root">
      {/* Dynamic Ambient Tech Glow & Grid Pattern */}
      <div className="hb-bg-wrapper">
        <div className="hb-glow-orb-1" />
        <div className="hb-glow-orb-2" />
        <div className="hb-grid-pattern" />
      </div>

      <div className="wrap" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hb-card">
          <div className="hb-center">
            <div className="hb-eyebrow" style={{ justifyContent: 'center' }}>
              <div className="hero-m-stripe" />
              <span className="t-micro muted">TÍNH NĂNG MỚI · BUILD PC 3D LIVE</span>
            </div>

            <h1 className="hb-title ink">
              BUILD PC VỚI{' '}
              <span className="blue">MÔ HÌNH 3D</span>
              <br />
              VÀ TƯ VẤN <span className="blue">AI</span>
            </h1>

            <p className="hb-desc muted">
              Tự tay lắp ráp cấu hình trên mô hình 3D chân thực — xoay 360°, thay đổi linh kiện,
              đổi màu RGB ngay trên website trước khi quyết định mua. Trợ lý AI kiểm tra tương thích
              và tối ưu ngân sách trong 30 giây.
            </p>

            <div className="hb-cta" style={{ justifyContent: 'center' }}>
              <Link to="/build" className="btn btn-blue btn-lg">
                <Box size={16} /> BUILD PC 3D NGAY
              </Link>
              <Link to="/ai" className="btn btn-outline-blue btn-lg">
                <Sparkles size={16} /> NHẬN TƯ VẤN AI
              </Link>
            </div>

            <div className="hb-features" style={{ justifyContent: 'center' }}>
              {[
                { icon: MousePointerClick, label: 'Xoay 360°' },
                { icon: Layers, label: 'Linh Kiện Thay Đổi' },
                { icon: Sparkles, label: 'Đổi Màu RGB' },
              ].map(f => (
                <div key={f.label} className="hb-feature">
                  <f.icon size={14} color="var(--c-blue)" />
                  <span className="t-micro muted">{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}