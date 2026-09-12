import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/* Static options — hoisted (Vercel: rendering-hoist-jsx) */
const PURPOSES = [
  { id: 'gaming',     label: 'Chơi Game Heavy',   mod: 0 },
  { id: 'workstation', label: 'Render 3D & AI',   mod: 20000000 },
  { id: 'esport',     label: 'Game Esport',        mod: -8000000 },
  { id: 'office',     label: 'Văn Phòng & Học',   mod: -10000000 },
];
const BRANDS = [
  { id: 'intel', label: 'Intel Core Gen 14' },
  { id: 'amd',   label: 'AMD Ryzen 7000' },
];
const RESS = [
  { id: '1080p', label: 'FHD 1080p', mod: -6000000 },
  { id: '2k',    label: '2K 144Hz',  mod: 0 },
  { id: '4k',    label: '4K 120Hz',  mod: 25000000 },
];

const ChipGroup = ({ opts, val, onChange }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
    {opts.map(o => (
      <button key={o.id} onClick={() => onChange(o.id)} style={{
        padding: '8px 16px', border: val === o.id ? '2px solid var(--c-blue)' : '1px solid var(--c-line)',
        background: val === o.id ? 'var(--c-blue-light)' : 'var(--c-canvas)',
        color: val === o.id ? 'var(--c-blue)' : 'var(--c-ink)',
        fontSize: 13, fontWeight: val === o.id ? 700 : 400,
        cursor: 'pointer', transition: 'all 0.15s',
      }}>{o.label}</button>
    ))}
  </div>
);

export default function BuildWizardPreview({ onOpenAiModal }) {
  const rootRef = useRef(null);
  const [purpose, setPurpose] = useState('gaming');
  const [brand, setBrand] = useState('intel');
  const [res, setRes] = useState('2k');

  /* Derived during render — no effect (Vercel: rerender-derived-state-no-effect) */
  const baseBudget = 25000000;
  const purposeMod = PURPOSES.find(p => p.id === purpose)?.mod || 0;
  const resMod = RESS.find(r => r.id === res)?.mod || 0;
  const estimated = baseBudget + purposeMod + resMod;
  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  useGSAP(() => {
    gsap.from('.wiz-inner', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      y: 36, opacity: 0, duration: 0.8, ease: 'power2.out',
    });
  }, { scope: rootRef });

  return (
    <section id="build-wizard" ref={rootRef} className="section-s">
      <div className="wrap">
        <div className="wiz-inner anim-t" style={{
          background: 'var(--c-canvas)', border: '1px solid var(--c-line)',
          display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 'var(--sp-2xl)',
          alignItems: 'center', padding: 'var(--sp-2xl)',
        }}>
          {/* Left result */}
          <div>
            <div className="m-stripe" style={{ width: 36, marginBottom: 'var(--sp-md)' }} />
            <h2 className="t-d3 ink" style={{ marginBottom: 8 }}>Ước Tính Chi Phí Trong 30 Giây</h2>
            <p className="t-body muted" style={{ marginBottom: 'var(--sp-xl)' }}>
              Trả lời 3 câu hỏi đơn giản — AI tính toán ngân sách tối ưu và xuất cấu hình chi tiết.
            </p>
            <div style={{ padding: 'var(--sp-lg)', background: 'var(--c-soft)', border: '1px solid var(--c-line)', marginBottom: 'var(--sp-lg)' }}>
              <div className="t-micro muted" style={{ marginBottom: 6 }}>Ước tính ngân sách:</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--c-blue)', lineHeight: 1, marginBottom: 'var(--sp-md)' }}>
                {fmt(estimated)}
              </div>
              <div className="divider" style={{ marginBottom: 'var(--sp-md)' }} />
              <div className="t-body-s muted">
                {purpose === 'gaming' && 'Tối ưu cho game nặng — RTX 4070 Ti trở lên khuyến nghị.'}
                {purpose === 'workstation' && 'Workstation AI — cần VRAM lớn và nhiều luồng CPU.'}
                {purpose === 'esport' && 'FPS cao ưu tiên — Ryzen 7800X3D + RTX 4060 Ti.'}
                {purpose === 'office' && 'Cấu hình tối giản, ổn định, tiết kiệm điện.'}
              </div>
            </div>
            <button onClick={onOpenAiModal} className="btn btn-blue" style={{ width: '100%', justifyContent: 'center' }}>
              YÊU CẦU AI XUẤT CHI TIẾT <ChevronRight size={16} />
            </button>
          </div>

          {/* Right form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-xl)' }}>
            <div>
              <div className="t-micro muted" style={{ marginBottom: 10, letterSpacing: 1.5 }}>1. MỤC ĐÍCH SỬ DỤNG</div>
              <ChipGroup opts={PURPOSES} val={purpose} onChange={setPurpose} />
            </div>
            <div className="divider" />
            <div>
              <div className="t-micro muted" style={{ marginBottom: 10, letterSpacing: 1.5 }}>2. THƯƠNG HIỆU CPU</div>
              <ChipGroup opts={BRANDS} val={brand} onChange={setBrand} />
            </div>
            <div className="divider" />
            <div>
              <div className="t-micro muted" style={{ marginBottom: 10, letterSpacing: 1.5 }}>3. ĐỘ PHÂN GIẢI MÀN HÌNH</div>
              <ChipGroup opts={RESS} val={res} onChange={setRes} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
