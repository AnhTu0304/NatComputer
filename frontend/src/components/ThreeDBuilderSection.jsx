import React, { useRef, useState, useMemo, lazy, Suspense } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Layers, Eye, ChevronRight, CheckCircle2, AlertTriangle, Zap, ShoppingCart, RefreshCw } from 'lucide-react';
import { HARDWARE_CATEGORIES, HARDWARE_CATALOG, checkCompatibility } from '../services/hardwareApi';
import LoadingFallback from './LoadingFallback';

const ThreeDCanvas = lazy(() => import('./ThreeDCanvas'));

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PERF_STATS = [
  { val: '4K 240FPS', sub: 'Gaming Ultra Settings', note: 'RTX 4090 / 5090 + i9 14900K' },
  { val: '< 25°C', sub: 'Nhiệt Độ Liquid Cooling', note: 'AIO 360mm Triple Fan RGB' },
  { val: '100%', sub: 'Tương Thích Linh Kiện', note: 'BuildCores API Verification' },
  { val: '3 NĂM', sub: 'Bảo Hành Tận Nơi 24/7', note: 'Đổi mới 1:1 trong 30 ngày' },
];

const RGB_COLORS = [
  { hex: '#1c69d4', name: 'BMW Blue' },
  { hex: '#0066b1', name: 'M Blue' },
  { hex: '#e22718', name: 'M Red' },
  { hex: '#10b981', name: 'Emerald' },
  { hex: '#f59e0b', name: 'Amber' },
];

export default function ThreeDBuilderSection({ onAddToCart }) {
  const rootRef = useRef(null);
  const statRowRef = useRef(null);

  // Selected parts state (1 part per category)
  const [selectedParts, setSelectedParts] = useState({
    cpu: HARDWARE_CATALOG.cpu[0],
    mainboard: HARDWARE_CATALOG.mainboard[0],
    vga: HARDWARE_CATALOG.vga[0],
    ram: HARDWARE_CATALOG.ram[0],
    ssd: HARDWARE_CATALOG.ssd[0],
    cooler: HARDWARE_CATALOG.cooler[0],
    psu: HARDWARE_CATALOG.psu[0],
    case: HARDWARE_CATALOG.case[0],
  });

  const [activeCategory, setActiveCategory] = useState('cpu');
  const [isExploded, setIsExploded] = useState(false);
  const [rgb, setRgb] = useState('#1c69d4');

  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Compute Total Price
  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, item) => sum + (item?.price || 0), 0);
  }, [selectedParts]);

  // Run Compatibility Check via Hardware API
  const compatibilityResult = useMemo(() => {
    return checkCompatibility(selectedParts);
  }, [selectedParts]);

  const handleSelectPart = (catId, part) => {
    setSelectedParts(prev => ({ ...prev, [catId]: part }));
  };

  const handleResetBuild = () => {
    setSelectedParts({
      cpu: HARDWARE_CATALOG.cpu[0],
      mainboard: HARDWARE_CATALOG.mainboard[0],
      vga: HARDWARE_CATALOG.vga[0],
      ram: HARDWARE_CATALOG.ram[0],
      ssd: HARDWARE_CATALOG.ssd[0],
      cooler: HARDWARE_CATALOG.cooler[0],
      psu: HARDWARE_CATALOG.psu[0],
      case: HARDWARE_CATALOG.case[0],
    });
  };

  useGSAP(() => {
    gsap.from('.bd-head', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 82%' },
      y: 30, opacity: 0, duration: 0.7, ease: 'power2.out',
    });

    gsap.from('.canvas-frame', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 70%' },
      scale: 0.97, opacity: 0, duration: 0.9, ease: 'power2.out',
    });
  }, { scope: rootRef });

  return (
    <section id="3d-builder" ref={rootRef}>
      {/* ── TOP: Dark Hero Header Section ── */}
      <div style={{ background: 'var(--c-dark-hero)', padding: '40px 0 32px' }}>
        <div className="wrap">
          <div className="bd-head" style={{ marginBottom: 28 }}>
            <div className="section-eyebrow">
              <div className="eyebrow-line" />
              <span className="t-label white-s">— BUILDCORES 3D CONFIGURATOR</span>
            </div>
            <h1 className="t-d1 white" style={{ marginBottom: 12, maxWidth: 680 }}>
              XÂY DỰNG CẤU HÌNH PC GAMING 3D
            </h1>
            <p className="t-body white-s" style={{ maxWidth: 600 }}>
              Tự do tùy chọn linh kiện chuẩn API BuildCores, kiểm tra độ tương thích socket & công suất nguồn realtime, xoay 360° góc nhìn 3D sống động.
            </p>
          </div>

          {/* Builder 2-Column Grid */}
          <div className="builder-grid">
            {/* LEFT: 3D Canvas & Power Gauge */}
            <div className="canvas-frame anim-t">
              <div className="canvas-topbar">
                <span className="t-micro white-s">NAT · BUILDCORES 3D ENGINE</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => setIsExploded(v => !v)}
                    className="btn btn-blue btn-sm"
                    style={{ height: 32, padding: '0 14px', fontSize: 11 }}
                  >
                    <Layers size={13} />
                    {isExploded ? 'THU GỌN' : 'EXPLODED VIEW'}
                  </button>
                  <span className="t-micro" style={{ color: 'var(--c-blue)', fontWeight: 700 }}>
                    {isExploded ? 'EXPLODED' : 'ASSEMBLED'} · 60FPS
                  </span>
                </div>
              </div>

              {/* 3D Canvas Container */}
              <div style={{ height: 460, background: '#0f1318', position: 'relative' }}>
                <Suspense fallback={<LoadingFallback message="Đang nạp mô hình 3D..." />}>
                  <ThreeDCanvas currentRgb={rgb} isExploded={isExploded} />
                </Suspense>

                {/* Compatibility Status Overlay Badge */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  background: compatibilityResult.isCompatible ? 'rgba(22, 163, 74, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                  backdropFilter: 'blur(8px)',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}>
                  {compatibilityResult.isCompatible ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>CẤU HÌNH TƯƠNG THÍCH 100%</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={16} />
                      <span>PHÁT HIỆN CẢNH BÁO TƯƠNG THÍCH</span>
                    </>
                  )}
                </div>
              </div>

              {/* ARGB Control & Wattage Indicator */}
              <div style={{
                background: 'var(--c-dark-el)',
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--c-line-dark)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="t-micro white-s">ARGB RGB:</span>
                  {RGB_COLORS.map(c => (
                    <button
                      key={c.hex}
                      title={c.name}
                      onClick={() => setRgb(c.hex)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: c.hex,
                        border: 'none',
                        cursor: 'pointer',
                        outline: rgb === c.hex ? '2px solid #fff' : '2px solid transparent',
                        outlineOffset: 2,
                        transition: 'transform 0.15s',
                        transform: rgb === c.hex ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
                  <Zap size={14} color="#eab308" />
                  <span>Ước tính tiêu thụ: <strong style={{ color: '#fff' }}>{compatibilityResult.totalTdp}W</strong></span>
                </div>
              </div>
            </div>

            {/* RIGHT: Component Picker Accordion & Build Summary */}
            <div className="builder-picker-sidebar">
              {/* Category Selector Tabs */}
              <div className="cat-selector-list">
                {HARDWARE_CATEGORIES.map(cat => {
                  const currentItem = selectedParts[cat.id];
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      className={`cat-select-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat.id)}
                    >
                      <div className="cat-btn-left">
                        <span className="cat-btn-name">{cat.name}</span>
                        <span className="cat-btn-selected">{currentItem ? currentItem.name : 'Chưa chọn'}</span>
                      </div>
                      <span className="cat-btn-price">{currentItem ? fmt(currentItem.price) : '0đ'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Parts Selection Cards for Active Category */}
              <div className="parts-options-box">
                <h3 className="options-title">Chọn {HARDWARE_CATEGORIES.find(c => c.id === activeCategory)?.name}:</h3>
                <div className="parts-options-list">
                  {(HARDWARE_CATALOG[activeCategory] || []).map(part => {
                    const isSelected = selectedParts[activeCategory]?.id === part.id;
                    return (
                      <div
                        key={part.id}
                        className={`part-option-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectPart(activeCategory, part)}
                      >
                        <img src={part.image} alt={part.name} className="part-img" />
                        <div className="part-info">
                          <h4 className="part-name">{part.name}</h4>
                          <div className="part-specs-row">
                            {part.socket && <span className="spec-tag">Socket: {part.socket}</span>}
                            {part.tdp && <span className="spec-tag">TDP: {part.tdp}W</span>}
                            {part.wattage && <span className="spec-tag">Công suất: {part.wattage}W</span>}
                          </div>
                        </div>
                        <div className="part-price-action">
                          <span className="part-price">{fmt(part.price)}</span>
                          <button className={`btn-choose ${isSelected ? 'active' : ''}`}>
                            {isSelected ? 'ĐÃ CHỌN' : 'CHỌN'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total & Action Bar */}
              <div className="build-summary-footer">
                <div className="total-price-area">
                  <span className="total-label">Tổng chi phí bộ PC:</span>
                  <span className="total-val">{fmt(totalPrice)}</span>
                </div>

                <div className="summary-btn-group">
                  <button className="btn btn-outline-dark" onClick={handleResetBuild} title="Làm mới bộ PC">
                    <RefreshCw size={16} />
                  </button>
                  <button
                    className="btn btn-red btn-add-all"
                    onClick={() => {
                      // Add representative build bundle to cart
                      onAddToCart?.({
                        id: `custom-pc-build-${Date.now()}`,
                        name: `BỘ PC BUILD TỰ CHỌN (${selectedParts.cpu?.name || 'PC Custom'})`,
                        price: totalPrice,
                        image: selectedParts.case?.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
                      });
                    }}
                  >
                    <ShoppingCart size={16} />
                    <span>THÊM TOÀN BỘ VÀO GIỎ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM: Performance Stats on Canvas ── */}
      <div style={{ background: 'var(--c-canvas)', borderTop: '1px solid var(--c-line)' }}>
        <div className="wrap">
          <div ref={statRowRef} className="stat-row">
            {PERF_STATS.map((s, i) => (
              <div key={i} className="stat-cell anim-t">
                <div className="stat-val">{s.val}</div>
                <div className="stat-sub">{s.sub}</div>
                <div className="stat-note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
