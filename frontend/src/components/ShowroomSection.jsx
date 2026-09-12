import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Phone, Clock, ChevronRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SHOWROOMS = [
  {
    city: 'TP. HỒ CHÍ MINH',
    address: '123 Nguyễn Văn Linh, Quận 7',
    phone: '028.3456.7890',
    hours: '09:00 - 21:00',
  },
  {
    city: 'HÀ NỘI',
    address: '456 Trần Duy Hưng, Cầu Giấy',
    phone: '024.3456.7890',
    hours: '09:00 - 21:00',
  },
  {
    city: 'ĐÀ NẴNG',
    address: '789 Nguyễn Văn Linh, Hải Châu',
    phone: '0236.3456.7890',
    hours: '09:00 - 21:00',
  },
];

export default function ShowroomSection() {
  const rootRef = useRef(null);

  useGSAP(() => {
    gsap.from('.sr-head', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 85%' },
      y: 24, opacity: 0, duration: 0.6, ease: 'power2.out',
    });
    gsap.from('.sr-card', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      y: 28, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
    });
  }, { scope: rootRef });

  return (
    <section id="showroom" ref={rootRef} className="sr-section">
      <div className="wrap">
        <div className="sr-head section-head">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span className="t-label muted">— ĐẾN VÀ TRẢI NGHIỆM THỰC TẾ</span>
          </div>
          <h2 className="t-d2 ink">HỆ THỐNG SHOWROOM</h2>
        </div>

        <div className="sr-grid">
          {SHOWROOMS.map(s => (
            <div key={s.city} className="sr-card anim-t">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--sp-md)' }}>
                <MapPin size={16} color="var(--c-blue)" />
                <span className="t-title ink" style={{ fontSize: 15 }}>{s.city}</span>
              </div>

              <p className="t-body-s muted" style={{ marginBottom: 'var(--sp-sm)' }}>{s.address}</p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <Phone size={13} color="var(--c-muted)" />
                <span className="t-body-s" style={{ color: 'var(--c-ink)' }}>{s.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={13} color="var(--c-muted)" />
                <span className="t-body-s muted">{s.hours}</span>
              </div>

              <button className="link-label" style={{ marginTop: 'var(--sp-md)' }}>
                CHỈ ĐƯỜNG <ChevronRight size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}