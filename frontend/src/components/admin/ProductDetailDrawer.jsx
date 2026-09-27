import React, { useEffect } from 'react';
import {
  X,
  Edit,
  ExternalLink,
  Package,
  Layers,
  Star,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react';

export default function ProductDetailDrawer({
  isOpen,
  product,
  onClose,
  onEdit,
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const getStockIndicator = (stock) => {
    const count = stock !== undefined ? stock : 10;
    if (count === 0) {
      return (
        <span className="stock-pill stock-out" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fee2e2', color: '#b91c1c', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} /> Hết hàng (0 cái)
        </span>
      );
    }
    if (count <= 5) {
      return (
        <span className="stock-pill stock-low" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#fef3c7', color: '#b45309', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} /> Sắp hết ({count} cái)
        </span>
      );
    }
    return (
      <span className="stock-pill stock-healthy" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: '#dcfce7', color: '#15803d', padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> Tồn kho tốt ({count} cái)
      </span>
    );
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Published':
        return <span className="tail-badge badge-success"><CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} /> Published</span>;
      case 'Draft':
        return <span className="tail-badge badge-secondary"><Clock size={12} style={{ display: 'inline', marginRight: 3 }} /> Draft</span>;
      case 'Out of Stock':
        return <span className="tail-badge badge-danger"><AlertTriangle size={12} style={{ display: 'inline', marginRight: 3 }} /> Out of Stock</span>;
      case 'Archived':
        return <span className="tail-badge badge-warning">Archived</span>;
      default:
        return <span className="tail-badge badge-success">Published</span>;
    }
  };

  // Parse specs
  const specsRows = Array.isArray(product.specs)
    ? product.specs
    : (product.specs && typeof product.specs === 'object')
      ? Object.entries(product.specs).map(([item, desc]) => ({ item, desc: String(desc) }))
      : [];

  return (
    <>
      {/* Backdrop */}
      <div
        className="drawer-backdrop"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Slide-in Panel */}
      <div
        className="product-detail-drawer"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          width: '100%',
          maxWidth: '440px',
          height: '100vh',
          background: '#ffffff',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '18px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chi Tiết Sản Phẩm
            </span>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#0f172a', marginTop: 2 }}>
              Mã: <code style={{ color: '#4f46e5' }}>{product.sku || product.id}</code>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: '1px solid #e2e8f0',
              borderRadius: 6,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569'
            }}
            title="Đóng panel (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {/* Main Image */}
          <div
            style={{
              width: '100%',
              height: '220px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <img
              src={product.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80'}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>

          {/* Title & Brand */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: 4 }}>
                {product.brand || 'CHÍNH HÃNG'}
              </span>
              {getStatusBadge(product.status || 'Published')}
            </div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
              {product.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 12, color: '#64748b' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Layers size={13} color="#4f46e5" /> {product.category}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#f59e0b', fontWeight: 600 }}>
                <Star size={13} fill="#f59e0b" /> {product.rating || '5.0'} ({product.reviewsCount || 24} đánh giá)
              </span>
            </div>
          </div>

          {/* Price & Stock Stats Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 12,
              marginBottom: 20
            }}
          >
            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>ĐƠN GIÁ BÁN</span>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#4f46e5', marginTop: 4 }}>
                {currencyFormatter(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div style={{ fontSize: 11, color: '#94a3b8', textDecoration: 'line-through', marginTop: 2 }}>
                  {currencyFormatter(product.originalPrice)}
                </div>
              )}
            </div>

            <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>TỒN KHO HIỆN TẠI</span>
              <div style={{ marginTop: 6 }}>
                {getStockIndicator(product.stock)}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6 }}>
                Đã bán: <strong>{product.sold || 32} cái</strong>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 6 }}>
                Mô Tả Sản Phẩm
              </span>
              <p style={{ margin: 0, fontSize: 13, color: '#475569', lineHeight: 1.5, background: '#f8fafc', padding: 10, borderRadius: 6, border: '1px solid #f1f5f9' }}>
                {product.description}
              </p>
            </div>
          )}

          {/* Hardware Specs Breakdown */}
          <div>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#334155', display: 'block', marginBottom: 8 }}>
              Thông Số Kỹ Thuật Chi Tiết (Hardware Specs)
            </span>
            {specsRows.length === 0 ? (
              <div style={{ fontSize: 12, color: '#94a3b8', fontStyle: 'italic', padding: 10, background: '#f8fafc', borderRadius: 6 }}>
                Sản phẩm chưa được cấu hình thông số kỹ thuật.
              </div>
            ) : (
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 8, overflow: 'hidden' }}>
                {specsRows.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      fontSize: 12,
                      background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderBottom: idx < specsRows.length - 1 ? '1px solid #f1f5f9' : 'none'
                    }}
                  >
                    <span style={{ fontWeight: 600, color: '#475569' }}>{s.item || s.label}</span>
                    <span style={{ color: '#0f172a', fontWeight: 500, textAlign: 'right' }}>{s.desc || s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #e2e8f0',
            background: '#ffffff',
            display: 'flex',
            gap: 10
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (onEdit) onEdit(product);
              onClose();
            }}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '10px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
            }}
          >
            <Edit size={14} /> Chỉnh Sửa Chi Tiết
          </button>

          <a
            href={`/product/${product.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #e2e8f0',
              padding: '10px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <ExternalLink size={14} /> Xem Trên Web
          </a>
        </div>
      </div>
    </>
  );
}
