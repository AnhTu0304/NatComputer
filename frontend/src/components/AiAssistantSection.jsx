import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, CheckCircle2, Activity, RefreshCw } from 'lucide-react';
import { AI_PRESETS } from '../data/pcData';

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function AiAssistantSection({ onAddToCart }) {
  const rootRef = useRef(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [budget, setBudget] = useState(45000000);
  const [isLoading, setIsLoading] = useState(false);

  const preset = AI_PRESETS[selectedIdx];
  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  useGSAP(() => {
    gsap.from('.ai-head', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      y: 28, opacity: 0, duration: 0.7, ease: 'power2.out',
    });
    gsap.from('.ai-panel', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 72%' },
      y: 40, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power2.out',
    });
  }, { scope: rootRef });

  const handleSelect = (idx) => {
    setIsLoading(true);
    setSelectedIdx(idx);
    setBudget(AI_PRESETS[idx].budget);
    setTimeout(() => setIsLoading(false), 450);
  };

  return (
    <section id="ai-assistant" ref={rootRef} className="section-s">
      <div className="wrap">
        {/* Header */}
        <div className="ai-head section-head">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span className="t-label muted">— CÔNG NGHỆ CHẨN ĐOÁN</span>
          </div>
          <h2 className="t-d2 ink" style={{ marginBottom: 8 }}>TRỢ LÝ AI BUILD PC</h2>
          <p className="t-body muted" style={{ maxWidth: 560 }}>
            Không cần kiến thức kỹ thuật. Chọn nhu cầu — AI phân tích tức thì 100% tương thích linh kiện và ước tính FPS thực tế.
          </p>
        </div>

        {/* Two-panel layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'var(--sp-2xl)', alignItems: 'start' }}>
          {/* LEFT: Preset picker */}
          <div className="ai-panel anim-t">
            <div style={{ border: '1px solid var(--c-line)', background: 'var(--c-canvas)' }}>
              <div style={{ padding: 'var(--sp-md) var(--sp-lg)', borderBottom: '1px solid var(--c-line)' }}>
                <span className="t-label muted">1. CHỌN NHU CẦU SỬ DỤNG</span>
              </div>
              {AI_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    width: '100%', textAlign: 'left', background: 'none', cursor: 'pointer',
                    paddingTop: 'var(--sp-md)', paddingRight: 'var(--sp-lg)',
                    paddingBottom: 'var(--sp-md)',
                    paddingLeft: selectedIdx === idx ? 'calc(var(--sp-lg) - 3px)' : 'var(--sp-lg)',
                    borderTop: 'none', borderRight: 'none',
                    borderLeft: selectedIdx === idx ? '3px solid var(--c-blue)' : '3px solid transparent',
                    borderBottom: '1px solid var(--c-line)',
                    background: selectedIdx === idx ? 'var(--c-blue-light)' : 'transparent',
                    transition: 'background 0.15s',
                  }}
                >
                  <div className="t-title ink" style={{ fontSize: 14, marginBottom: 2 }}>{p.title}</div>
                  <div className="t-body-s muted" style={{ marginBottom: 6 }}>{p.usage}</div>
                  <div className="t-micro blue">{fmt(p.budget)}</div>
                </button>
              ))}

              {/* Budget slider */}
              <div style={{ padding: 'var(--sp-md) var(--sp-lg)', background: 'var(--c-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="t-micro muted">Ngân sách tùy chỉnh</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-blue)' }}>{fmt(budget)}</span>
                </div>
                <input type="range" min={15000000} max={100000000} step={2000000}
                  value={budget} onChange={e => setBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--c-blue)', cursor: 'pointer' }} />
              </div>
            </div>
          </div>

          {/* RIGHT: AI output */}
          <div className="ai-panel anim-t" style={{ border: '1px solid var(--c-line)', background: 'var(--c-canvas)' }}>
            {/* Dark header */}
            <div style={{
              background: 'var(--c-dark-hero)', padding: 'var(--sp-md) var(--sp-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div>
                <div className="t-label white" style={{ letterSpacing: 1 }}>AI PC ARCHITECT</div>
                <div className="t-micro" style={{ color: 'var(--c-on-dark-s)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <CheckCircle2 size={11} color="var(--c-green)" />
                  Zero Bottleneck · 100% Compatible
                </div>
              </div>
              {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <RefreshCw size={13} color="var(--c-blue)"
                    style={{ animation: 'spin 0.8s linear infinite' }} />
                  <span className="t-micro" style={{ color: 'var(--c-blue)' }}>Phân tích...</span>
                </div>
              )}
            </div>

            <div style={{ padding: 'var(--sp-lg)' }}>
              {/* 2×2 spec grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-sm)', marginBottom: 'var(--sp-lg)' }}>
                {[
                  { l: 'CPU', v: preset.cpu },
                  { l: 'GPU', v: preset.gpu },
                  { l: 'RAM', v: preset.ram },
                  { l: 'PSU', v: preset.psu },
                ].map(s => (
                  <div key={s.l} style={{ border: '1px solid var(--c-line)', padding: 'var(--sp-sm) var(--sp-md)' }}>
                    <div className="t-micro muted">{s.l}</div>
                    <div className="t-title ink" style={{ marginTop: 4, fontSize: 12 }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* FPS */}
              <div style={{ background: 'var(--c-soft)', border: '1px solid var(--c-line)', padding: 'var(--sp-md)', marginBottom: 'var(--sp-lg)' }}>
                <div className="t-micro muted" style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Activity size={11} /> HIỆU NĂNG ƯỚC TÍNH
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 'var(--sp-sm)' }}>
                  {[
                    { g: 'Wukong 4K',  fps: preset.fpsWukong, c: 'var(--c-green)' },
                    { g: 'Cyberpunk',  fps: preset.fpsCyberpunk, c: 'var(--c-blue)' },
                    { g: 'Valorant',   fps: preset.fpsValorant, c: 'var(--c-amber)' },
                  ].map(g => (
                    <div key={g.g} style={{ background: 'var(--c-canvas)', border: '1px solid var(--c-line)', padding: 'var(--sp-xs)', textAlign: 'center' }}>
                      <div className="t-micro muted">{g.g}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: g.c, lineHeight: 1, marginTop: 4 }}>{g.fps}</div>
                      <div className="t-micro muted">FPS</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-lg)', paddingBottom: 'var(--sp-md)', borderBottom: '1px solid var(--c-line)' }}>
                <span className="t-body-s muted">Công suất ước tính:</span>
                <span className="t-title ink">~{preset.estimatedWatt}W</span>
              </div>

              <button
                onClick={() => onAddToCart({
                  id: `ai-${Date.now()}`, name: `Cấu hình AI · ${preset.title}`,
                  price: budget,
                  specs: { cpu: preset.cpu, gpu: preset.gpu, ram: preset.ram },
                  image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
                })}
                className="btn btn-blue"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <ShoppingCart size={15} /> THÊM CẤU HÌNH VÀO GIỎ
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }`}</style>
    </section>
  );
}
