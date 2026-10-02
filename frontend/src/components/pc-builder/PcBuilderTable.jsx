import React, { useState, useMemo, useEffect } from 'react';
import { RotateCcw, ShoppingCart, Printer, Trash2, Edit3, AlertTriangle, CheckCircle2, Plus, Minus, Info, Sparkles } from 'lucide-react';
import { HARDWARE_CATEGORIES, HARDWARE_CATALOG, checkCompatibility } from '../../services/hardwareApi';
import PartSelectionModal from './PartSelectionModal';
import BuildPrintModal from './BuildPrintModal';
import './pc-builder.css';

export default function PcBuilderTable({ onAddToCart }) {
  // State for selected parts (stored by category id: cpu, mainboard, etc.)
  const [selectedParts, setSelectedParts] = useState(() => {
    try {
      const saved = localStorage.getItem('nat_pc_build_parts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // State for quantities (default 1 for each category)
  const [quantities, setQuantities] = useState(() => {
    try {
      const saved = localStorage.getItem('nat_pc_build_quantities');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Modal states
  const [activeModalCat, setActiveModalCat] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [addedSuccessMessage, setAddedSuccessMessage] = useState('');

  // Persist selections
  useEffect(() => {
    try {
      localStorage.setItem('nat_pc_build_parts', JSON.stringify(selectedParts));
      localStorage.setItem('nat_pc_build_quantities', JSON.stringify(quantities));
    } catch (e) {
      console.error('Lỗi lưu cấu hình:', e);
    }
  }, [selectedParts, quantities]);

  // Format currency helper
  const fmt = (v) => `${new Intl.NumberFormat('vi-VN').format(v || 0)} đ`;

  // Calculate total price
  const totalPrice = useMemo(() => {
    return HARDWARE_CATEGORIES.reduce((sum, cat) => {
      const part = selectedParts[cat.id];
      if (!part) return sum;
      const qty = quantities[cat.id] || 1;
      return sum + (part.price || 0) * qty;
    }, 0);
  }, [selectedParts, quantities]);

  // Compatibility engine calculation
  const compatibilityResult = useMemo(() => {
    return checkCompatibility(selectedParts);
  }, [selectedParts]);

  // Handlers
  const handleOpenSelectModal = (cat) => {
    setActiveModalCat(cat);
  };

  const handleSelectPart = (catId, product) => {
    setSelectedParts(prev => ({ ...prev, [catId]: product }));
    if (!quantities[catId]) {
      setQuantities(prev => ({ ...prev, [catId]: 1 }));
    }
    setActiveModalCat(null);
  };

  const handleRemovePart = (catId) => {
    setSelectedParts(prev => {
      const next = { ...prev };
      delete next[catId];
      return next;
    });
    setQuantities(prev => {
      const next = { ...prev };
      delete next[catId];
      return next;
    });
  };

  const handleUpdateQty = (catId, delta) => {
    setQuantities(prev => {
      const current = prev[catId] || 1;
      const nextVal = Math.max(1, Math.min(8, current + delta));
      return { ...prev, [catId]: nextVal };
    });
  };

  const handleResetAll = () => {
    if (Object.keys(selectedParts).length > 0) {
      if (!window.confirm('Bạn có chắc chắn muốn làm mới toàn bộ cấu hình PC này không?')) {
        return;
      }
    }
    setSelectedParts({});
    setQuantities({});
    try {
      localStorage.removeItem('nat_pc_build_parts');
      localStorage.removeItem('nat_pc_build_quantities');
    } catch {}
  };

  // Quick preset helper
  const handleLoadSampleBuild = () => {
    const sample = {};
    const sampleQty = {};
    HARDWARE_CATEGORIES.forEach(cat => {
      const items = HARDWARE_CATALOG[cat.id];
      if (items && items.length > 0) {
        sample[cat.id] = items[0];
        sampleQty[cat.id] = 1;
      }
    });
    setSelectedParts(sample);
    setQuantities(sampleQty);
  };

  const handleAddAllToCart = () => {
    const selectedList = Object.entries(selectedParts);
    if (selectedList.length === 0) {
      alert('Vui lòng chọn ít nhất 1 linh kiện trước khi thêm vào giỏ hàng!');
      return;
    }

    let addedCount = 0;
    selectedList.forEach(([catId, part]) => {
      const qty = quantities[catId] || 1;
      if (onAddToCart) {
        onAddToCart({
          ...part,
          quantity: qty,
          cartItemId: `build_${part.id}_${Date.now()}`
        });
        addedCount += qty;
      }
    });

    setAddedSuccessMessage(`Đã thêm thành công ${addedCount} linh kiện vào giỏ hàng!`);
    setTimeout(() => {
      setAddedSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="pc-builder-container">
      {/* ── Page Header matching user mockup ── */}
      <div className="pc-builder-header">
        <h1 className="pc-builder-title">
          CHỌN LINH KIỆN XÂY DỰNG CẤU HÌNH
        </h1>
      </div>

      {/* ── Top Action Bar ── */}
      <div className="pc-builder-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={handleResetAll}
            className="btn-reset-build"
            title="Xóa toàn bộ các linh kiện đang chọn"
          >
            <span>LÀM MỚI</span>
            <RotateCcw size={15} />
          </button>

          {Object.keys(selectedParts).length === 0 && (
            <button
              onClick={handleLoadSampleBuild}
              style={{
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                color: '#475569',
                fontSize: '12px',
                fontWeight: 600,
                padding: '7px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Điền sẵn cấu hình gợi ý để trải nghiệm nhanh"
            >
              <Sparkles size={14} color="#e22718" /> Gợi ý cấu hình mẫu
            </button>
          )}
        </div>

        <div className="estimated-cost-text">
          Chi phí dự tính: <span className="cost-amount-red">{fmt(totalPrice)}</span>
        </div>
      </div>

      {/* ── Compatibility Warnings (if any) ── */}
      {compatibilityResult.issues.length > 0 && (
        <div className="builder-alert-box builder-alert-danger">
          <AlertTriangle size={18} style={{ flexShrink: 0 }} />
          <div>
            {compatibilityResult.issues.map((err, i) => (
              <div key={i} style={{ fontWeight: 600 }}>{err}</div>
            ))}
          </div>
        </div>
      )}

      {compatibilityResult.warnings.length > 0 && (
        <div className="builder-alert-box builder-alert-warning">
          <Info size={18} style={{ flexShrink: 0 }} />
          <div>
            {compatibilityResult.warnings.map((warn, i) => (
              <div key={i}>{warn}</div>
            ))}
          </div>
        </div>
      )}

      {/* ── Added to cart success notice ── */}
      {addedSuccessMessage && (
        <div className="builder-alert-box builder-alert-success">
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span style={{ fontWeight: 700 }}>{addedSuccessMessage}</span>
        </div>
      )}

      {/* ── Main Component Rows (1 to 9) ── */}
      <div className="pc-builder-table">
        {HARDWARE_CATEGORIES.map((cat) => {
          const selectedPart = selectedParts[cat.id];
          const qty = quantities[cat.id] || 1;
          const lineTotal = (selectedPart?.price || 0) * qty;

          return (
            <div key={cat.id} className="pc-builder-row">
              {/* Left Column: Number & Category Title */}
              <div className="pc-builder-col-name">
                {cat.fullName}
              </div>

              {/* Right Column: Empty State or Selected Part */}
              <div className="pc-builder-col-action">
                {!selectedPart ? (
                  /* Empty state: Red button matching user image "+ Chọn [Tên]" */
                  <button
                    onClick={() => handleOpenSelectModal(cat)}
                    className="btn-choose-part"
                  >
                    {cat.btnText}
                  </button>
                ) : (
                  /* Selected Part State */
                  <div className="pc-builder-selected-part">
                    <div className="selected-part-info">
                      <img
                        src={selectedPart.image || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=150&q=80'}
                        alt={selectedPart.name}
                        className="selected-part-img"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                      <div className="selected-part-details">
                        <h4 className="selected-part-name" title={selectedPart.name}>
                          {selectedPart.name}
                        </h4>
                        <div className="selected-part-meta">
                          {selectedPart.specs?.socket && (
                            <span className="socket-pill">
                              Socket: {selectedPart.specs.socket}
                            </span>
                          )}
                          <span>
                            Bảo hành: {selectedPart.specs?.warranty || '36 Tháng'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="selected-part-ctrls">
                      {/* Quantity Selector for RAM/SSD */}
                      {cat.allowMulti ? (
                        <div className="qty-control-box">
                          <button
                            onClick={() => handleUpdateQty(cat.id, -1)}
                            className="btn-qty-step"
                            title="Giảm số lượng"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="qty-val-display">{qty}</span>
                          <button
                            onClick={() => handleUpdateQty(cat.id, 1)}
                            className="btn-qty-step"
                            title="Tăng số lượng"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                          SL: 1
                        </span>
                      )}

                      {/* Total for this line */}
                      <div className="selected-part-price">
                        <div className="price-main-red">
                          {fmt(lineTotal)}
                        </div>
                        {qty > 1 && (
                          <span className="price-unit-small">
                            ({fmt(selectedPart.price)}/cái)
                          </span>
                        )}
                      </div>

                      {/* Actions: Change & Remove */}
                      <div className="selected-part-actions">
                        <button
                          onClick={() => handleOpenSelectModal(cat)}
                          className="btn-change-part"
                          title="Chọn linh kiện khác"
                        >
                          <Edit3 size={13} /> Đổi
                        </button>
                        <button
                          onClick={() => handleRemovePart(cat.id)}
                          className="btn-remove-part"
                          title="Xóa linh kiện này"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Total & Call to Action Bar ── */}
      <div className="pc-builder-bottom-bar">
        <div className="bottom-action-buttons">
          <button
            onClick={() => setIsPrintModalOpen(true)}
            disabled={Object.keys(selectedParts).length === 0}
            className="btn-bottom-print"
          >
            <Printer size={16} />
            <span>In / Xuất Báo Giá</span>
          </button>

          <button
            onClick={handleAddAllToCart}
            disabled={Object.keys(selectedParts).length === 0}
            className="btn-bottom-cart"
          >
            <ShoppingCart size={16} />
            <span>Thêm Vào Giỏ Hàng</span>
          </button>
        </div>

        <div className="estimated-cost-text">
          Chi phí dự tính: <span className="cost-amount-red">{fmt(totalPrice)}</span>
        </div>
      </div>

      {/* ── Modal chọn linh kiện ── */}
      <PartSelectionModal
        isOpen={Boolean(activeModalCat)}
        category={activeModalCat}
        onClose={() => setActiveModalCat(null)}
        onSelectPart={handleSelectPart}
        currentSelectedId={activeModalCat ? selectedParts[activeModalCat.id]?.id : null}
      />

      {/* ── Modal in báo giá ── */}
      <BuildPrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        selectedParts={selectedParts}
        quantities={quantities}
        totalPrice={totalPrice}
      />
    </div>
  );
}
