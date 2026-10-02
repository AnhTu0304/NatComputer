import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, Check, Filter, Cpu, Layers, HardDrive, Tv, Box, Wind, Zap, Monitor, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { HARDWARE_CATALOG } from '../../services/hardwareApi';
import './pc-builder.css';

const CAT_ICONS = {
  cpu: Cpu,
  mainboard: Layers,
  ram: Cpu,
  vga: Tv,
  ssd: HardDrive,
  psu: Zap,
  cooler: Wind,
  case: Box,
  monitor: Monitor,
};

export default function PartSelectionModal({
  isOpen,
  onClose,
  category,
  onSelectPart,
  currentSelectedId,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [sortBy, setSortBy] = useState('price-asc');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch products for category whenever category changes and modal opens
  useEffect(() => {
    if (!isOpen || !category) return;
    setSearchTerm('');
    setSelectedBrand('ALL');
    setIsLoading(true);

    let isMounted = true;
    const catQuery = category.catKey || category.id;
    const localFallback = HARDWARE_CATALOG[category.id] || [];

    api.getProducts(catQuery, '')
      .then(res => {
        if (!isMounted) return;
        if (res && Array.isArray(res.products) && res.products.length > 0) {
          setProducts(res.products);
        } else {
          setProducts(localFallback);
        }
      })
      .catch(err => {
        console.warn('Fallback to local catalog:', err);
        if (isMounted) setProducts(localFallback);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, category]);

  // Extract available brands
  const brands = useMemo(() => {
    const set = new Set();
    products.forEach(p => {
      const b = p.specs?.brand || p.brand;
      if (b) set.add(b);
    });
    return ['ALL', ...Array.from(set)];
  }, [products]);

  // Filter & sort products
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(p => p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    // Brand filter
    if (selectedBrand !== 'ALL') {
      list = list.filter(p => (p.specs?.brand || p.brand) === selectedBrand);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

    return list;
  }, [products, searchTerm, selectedBrand, sortBy]);

  if (!isOpen || !category) return null;

  const IconComp = CAT_ICONS[category.id] || Cpu;
  const fmt = (v) => `${new Intl.NumberFormat('vi-VN').format(v || 0)} đ`;

  return (
    <div className="part-modal-overlay" onClick={onClose}>
      <div 
        className="part-modal-dialog"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="part-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: '#fef2f2',
              color: '#e22718',
              border: '1px solid #fee2e2'
            }}>
              <IconComp size={20} />
            </div>
            <div>
              <h2 className="part-modal-header-title">
                {category.fullName} - Chọn Linh Kiện
              </h2>
              <p className="part-modal-header-desc">
                Lựa chọn sản phẩm chính hãng bảo hành uy tín từ NAT Computer
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn-close-modal"
            title="Đóng (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="part-modal-toolbar">
          <div className="search-input-wrap">
            <Search className="search-icon-svg" size={16} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={`Tìm kiếm ${category.name} theo tên, thông số...`}
              className="part-search-input"
              autoFocus
            />
          </div>

          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="part-sort-select"
          >
            <option value="price-asc">Giá: Thấp đến cao</option>
            <option value="price-desc">Giá: Cao đến thấp</option>
            <option value="rating">Được đánh giá cao</option>
          </select>
        </div>

        {/* Brand Filter Pills */}
        {brands.length > 2 && (
          <div className="brand-chips-row">
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginRight: '6px' }}>
              <Filter size={12} /> Hãng:
            </span>
            {brands.map(b => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`brand-chip-btn ${selectedBrand === b ? 'active' : ''}`}
              >
                {b === 'ALL' ? 'Tất cả' : b}
              </button>
            ))}
          </div>
        )}

        {/* Product List */}
        <div className="part-modal-body">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
              <p style={{ fontSize: '14px', fontWeight: 600 }}>Đang tải danh sách linh kiện...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#64748b' }}>
              <Box size={44} style={{ margin: '0 auto 10px', strokeWidth: 1.5, color: '#cbd5e1' }} />
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>Không tìm thấy linh kiện nào</p>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Thử tìm kiếm với từ khóa khác hoặc bấm "Tất cả"</p>
            </div>
          ) : (
            filteredProducts.map(product => {
              const isCurrent = currentSelectedId === product.id;
              const brand = product.specs?.brand || product.brand;
              const warranty = product.specs?.warranty || '36 Tháng';
              const socket = product.specs?.socket;

              return (
                <div
                  key={product.id}
                  className={`part-card-item ${isCurrent ? 'selected' : ''}`}
                >
                  <div className="part-card-left">
                    <img
                      src={product.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=150&q=80'}
                      alt={product.name}
                      className="part-card-img"
                      onError={e => {
                        e.target.src = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=150&q=80';
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <h4 className="part-card-title">
                        {product.name}
                      </h4>
                      <div className="part-card-badges">
                        {brand && (
                          <span className="badge-tag" style={{ background: '#f1f5f9', color: '#334155' }}>
                            {brand}
                          </span>
                        )}
                        {socket && (
                          <span className="badge-tag" style={{ background: '#eff6ff', color: '#2563eb' }}>
                            Socket: {socket}
                          </span>
                        )}
                        {product.badge && (
                          <span className="badge-tag" style={{ background: '#fffbeb', color: '#b45309' }}>
                            ★ {product.badge}
                          </span>
                        )}
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>
                          Bảo hành: {warranty}
                        </span>
                        <span style={{ color: '#16a34a', fontSize: '11px', fontWeight: 600 }}>
                          • Sẵn hàng
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="part-card-right">
                    <div className="part-card-price">
                      <div className="part-price-val">
                        {fmt(product.price)}
                      </div>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <div style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through' }}>
                          {fmt(product.originalPrice)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onSelectPart(category.id, product);
                        onClose();
                      }}
                      className={`btn-select-action ${isCurrent ? 'selected' : ''}`}
                    >
                      {isCurrent ? (
                        <>
                          <Check size={14} /> Đang Chọn
                        </>
                      ) : (
                        '+ Chọn Mua'
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="part-modal-footer">
          <span>Tìm thấy {filteredProducts.length} linh kiện phù hợp</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontWeight: 600,
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
