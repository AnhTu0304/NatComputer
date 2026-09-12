import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ChevronRight } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem, onClearCart }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((s, i) => s + i.price * (i.quantity || 1), 0);
  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  const handleCheckout = () => {
    alert('Đặt hàng thành công! NAT Computer sẽ liên hệ trong 15 phút.');
    onClearCart();
    onClose();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(17,22,25,0.6)', display: 'flex', justifyContent: 'flex-end' }}>
      <div style={{ flex: 1 }} onClick={onClose} />
      <div style={{
        width: '100%', maxWidth: 440, height: '100%',
        background: 'var(--c-canvas)', display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid var(--c-line)',
      }}>
        {/* Header */}
        <div style={{ padding: 'var(--sp-lg)', borderBottom: '1px solid var(--c-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ShoppingBag size={20} strokeWidth={1.5} color="var(--c-ink)" />
            <span className="t-title ink">Giỏ Hàng ({cartItems.length})</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--c-muted)' }}>
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--sp-lg)' }}>
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 80 }}>
              <ShoppingBag size={48} strokeWidth={1} style={{ margin: '0 auto 16px', opacity: 0.2, display: 'block' }} />
              <p className="t-body muted">Giỏ hàng trống.</p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={item.id} style={{
                display: 'flex', gap: 'var(--sp-md)', paddingBottom: 'var(--sp-md)',
                marginBottom: 'var(--sp-md)',
                borderBottom: idx < cartItems.length - 1 ? '1px solid var(--c-line)' : 'none',
              }}>
                <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: 'cover', background: 'var(--c-soft)', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="t-title ink" style={{ fontSize: 13, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-blue)', marginBottom: 8 }}>{fmt(item.price)}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--c-line)' }}>
                      <button onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                        style={{ border: 'none', background: 'none', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Minus size={12} />
                      </button>
                      <span style={{ padding: '0 10px', fontSize: 13, fontWeight: 700 }}>{item.quantity || 1}</span>
                      <button onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                        style={{ border: 'none', background: 'none', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={12} />
                      </button>
                    </div>
                    <button onClick={() => onRemoveItem(item.id)}
                      style={{ border: 'none', background: 'none', color: 'var(--c-red)', cursor: 'pointer', padding: 4 }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div style={{ padding: 'var(--sp-lg)', borderTop: '1px solid var(--c-line)', background: 'var(--c-soft)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--sp-lg)' }}>
              <span className="t-micro muted">TỔNG THANH TOÁN</span>
              <span className="t-d3 ink" style={{ fontSize: 24 }}>{fmt(total)}</span>
            </div>
            <button onClick={handleCheckout} className="btn btn-blue" style={{ width: '100%', justifyContent: 'center' }}>
              THANH TOÁN NGAY <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
