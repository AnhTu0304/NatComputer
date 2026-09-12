import React from 'react';
import { X, ShoppingCart, CheckCircle2 } from 'lucide-react';
import ThreeDCanvas from './ThreeDCanvas';

export default function QuickViewModal({ product, onClose, onAddToCart }) {
  if (!product) return null;
  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 250, background: 'rgba(17,22,25,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{
        width: '100%', maxWidth: 860, background: 'var(--c-canvas)',
        border: '1px solid var(--c-line)', position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        maxHeight: '90vh', overflow: 'hidden',
      }}>
        {/* Close */}
        <button onClick={onClose} style={{
          position: 'absolute', top: 12, right: 12, zIndex: 10,
          background: 'var(--c-canvas)', border: '1px solid var(--c-line)',
          width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <X size={15} />
        </button>

        {/* Left: 3D Canvas */}
        <div style={{ background: 'var(--c-soft)', overflow: 'hidden' }}>
          <div style={{ background: 'var(--c-ink)', padding: '10px 16px', display: 'flex', justifyContent: 'space-between' }}>
            <span className="t-micro white-s">MÔ HÌNH 3D LIVE</span>
            <span className="t-micro" style={{ color: 'var(--c-blue)', fontWeight: 700 }}>60FPS</span>
          </div>
          <div style={{ height: 380 }}>
            <ThreeDCanvas currentRgb={product.model3d?.fanRgb || '#1c69d4'} />
          </div>
        </div>

        {/* Right: Details */}
        <div style={{ padding: 'var(--sp-2xl)', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="t-micro muted" style={{ marginBottom: 8 }}>{product.categoryName || 'Dàn PC'}</div>
            <h2 className="t-d3 ink" style={{ marginBottom: 'var(--sp-md)' }}>{product.name}</h2>
            <div style={{ marginBottom: 'var(--sp-xl)' }}>
              <span className="t-price blue">{fmt(product.price)}</span>
              {product.originalPrice && (
                <span className="t-body-s muted" style={{ textDecoration: 'line-through', marginLeft: 12 }}>
                  {fmt(product.originalPrice)}
                </span>
              )}
            </div>
            <div className="divider" style={{ marginBottom: 'var(--sp-lg)' }} />
            {[{ l: 'CPU', v: product.specs?.cpu }, { l: 'GPU', v: product.specs?.gpu }, { l: 'RAM', v: product.specs?.ram }].map(s => (
              <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--c-line)' }}>
                <span className="t-micro muted">{s.l}</span>
                <span className="t-title ink" style={{ fontSize: 13 }}>{s.v || '—'}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 'var(--sp-sm) var(--sp-md)', background: '#f0fff7', border: '1px solid #bbf7d0', marginTop: 'var(--sp-lg)', marginBottom: 'var(--sp-xl)' }}>
              <CheckCircle2 size={14} color="var(--c-green)" />
              <span className="t-body-s" style={{ color: 'var(--c-green)', fontWeight: 700 }}>Bảo hành 36 tháng · 1 đổi 1 tận nơi</span>
            </div>
          </div>
          <button onClick={() => { onAddToCart(product); onClose(); }} className="btn btn-blue" style={{ width: '100%', justifyContent: 'center' }}>
            <ShoppingCart size={15} /> THÊM VÀO GIỎ HÀNG
          </button>
        </div>
      </div>
    </div>
  );
}
