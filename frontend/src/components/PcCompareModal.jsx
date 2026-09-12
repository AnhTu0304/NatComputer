import React, { useRef } from 'react';
import { X, Check, ShieldCheck, ShoppingCart, Zap, ArrowRightLeft } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function PcCompareModal({ compareItems = [], onClose, onRemoveItem, onAddToCart, onBuyNow }) {
  const modalRef = useRef(null);

  useGSAP(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.5)' }
      );
    }
  }, { scope: modalRef });

  if (!compareItems || compareItems.length === 0) return null;

  const fmt = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  return (
    <div className="compare-modal-overlay" onClick={onClose}>
      <div ref={modalRef} className="compare-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header Bar */}
        <div className="compare-modal-header">
          <div className="header-title-flex">
            <ArrowRightLeft size={22} color="#1c69d4" />
            <h2>SO SÁNH CẤU HÌNH CÁC DÒNG MÁY TÍNH PC ({compareItems.length}/3)</h2>
          </div>
          <button type="button" className="compare-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Comparison Content Table */}
        <div className="compare-table-wrapper">
          <table className="compare-table">
            <thead>
              <tr>
                <th className="feature-col">TIÊU CHÍ SO SÁNH</th>
                {compareItems.map((item) => (
                  <th key={item.id} className="product-col">
                    <button
                      type="button"
                      className="remove-compare-btn"
                      onClick={() => onRemoveItem(item.id)}
                      title="Xóa khỏi so sánh"
                    >
                      <X size={14} />
                    </button>
                    <img src={item.image} alt={item.name} className="compare-thumb" />
                    <h3 className="compare-item-name">{item.name}</h3>
                    <div className="compare-item-price">{fmt(item.price)}</div>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <div className="compare-item-old-price">{fmt(item.originalPrice)}</div>
                    )}
                    <div className="compare-card-actions">
                      <button
                        type="button"
                        className="btn btn-red btn-sm hover-btn-effect"
                        onClick={() => {
                          onBuyNow?.(item);
                          onClose();
                        }}
                      >
                        <Zap size={14} /> MUA NGAY
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-dark btn-sm"
                        onClick={() => onAddToCart?.(item)}
                      >
                        <ShoppingCart size={14} /> Thêm Giỏ
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Row 1: Category */}
              <tr>
                <td className="feature-col">Phân Loại PC</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="product-col">
                    <span className="compare-category-badge">{item.categoryName || 'PC Gaming'}</span>
                  </td>
                ))}
              </tr>

              {/* Row 2: CPU */}
              <tr>
                <td className="feature-col">Vi Xử Lý (CPU)</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="product-col feature-highlight">
                    {item.specs?.cpu || item.specifications?.[0] || 'Intel / AMD Gen mới'}
                  </td>
                ))}
              </tr>

              {/* Row 3: GPU / Card Màn Hình */}
              <tr>
                <td className="feature-col">Card Đồ Họa (GPU)</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="product-col feature-highlight">
                    {item.specs?.gpu || item.specifications?.[4] || 'NVIDIA GeForce RTX'}
                  </td>
                ))}
              </tr>

              {/* Row 4: RAM */}
              <tr>
                <td className="feature-col">Bộ Nhớ RAM</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="product-col">
                    {item.specs?.ram || item.specifications?.[2] || 'DDR4 / DDR5 High Speed'}
                  </td>
                ))}
              </tr>

              {/* Row 5: SSD Storage */}
              <tr>
                <td className="feature-col">Ổ Cứng SSD</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="product-col">
                    {item.specs?.ssd || item.specifications?.[3] || 'NVMe PCIe Gen4 SSD'}
                  </td>
                ))}
              </tr>

              {/* Row 6: Warranty */}
              <tr>
                <td className="feature-col">Bảo Hành Chính Hãng</td>
                {compareItems.map((item) => (
                  <td key={item.id} className="product-col text-green">
                    <ShieldCheck size={14} inline="true" color="#22c55e" /> 36 Tháng 1 đổi 1 tận nơi
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
