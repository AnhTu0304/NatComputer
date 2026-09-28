import React, { useState, useEffect } from 'react';
import {
  X, PlusCircle, MinusCircle, RefreshCw, ArrowRightLeft,
  Warehouse, Check, AlertCircle, Package
} from 'lucide-react';

export default function InventoryAdjustmentModal({
  isOpen,
  onClose,
  products = [],
  selectedProduct = null,
  onApplyAdjustment,
  initialMode = 'add'
}) {
  const [mode, setMode] = useState(initialMode); // 'add', 'remove', 'adjust', 'transfer'
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [sourceWarehouse, setSourceWarehouse] = useState('Kho Tổng Hà Nội');
  const [targetWarehouse, setTargetWarehouse] = useState('Kho Hồ Chí Minh');
  const [reason, setReason] = useState('Nhập hàng mới từ NCC');
  const [note, setNote] = useState('');
  const [adminName, setAdminName] = useState('Admin Master');

  // Pre-fill or sync when selectedProduct changes
  useEffect(() => {
    if (selectedProduct) {
      setProductId(String(selectedProduct.id));
      setSourceWarehouse(selectedProduct.warehouse || 'Kho Tổng Hà Nội');
    } else if (products.length > 0 && !productId) {
      setProductId(String(products[0].id));
    }
  }, [selectedProduct, products]);

  useEffect(() => {
    setMode(initialMode || 'add');
    if (initialMode === 'add') setReason('Nhập hàng mới từ nhà phân phối chính hãng');
    else if (initialMode === 'remove') setReason('Linh kiện lỗi hỏng / xuất hủy');
    else if (initialMode === 'adjust') setReason('Kiểm kê cân bằng kho định kỳ');
    else if (initialMode === 'transfer') setReason('Điều chuyển nội bộ phục vụ đơn hàng');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const currentProd = products.find(p => String(p.id) === String(productId)) || selectedProduct;
  const currentStock = Number(currentProd?.stock || currentProd?.currentStock || 0);

  // Compute preview new stock
  let newStock = currentStock;
  const qtyNum = parseInt(quantity, 10) || 0;
  if (mode === 'add') newStock = currentStock + qtyNum;
  else if (mode === 'remove') newStock = Math.max(0, currentStock - qtyNum);
  else if (mode === 'adjust') newStock = qtyNum;
  else if (mode === 'transfer') newStock = Math.max(0, currentStock - qtyNum);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProd) {
      alert('Vui lòng chọn sản phẩm cần xử lý');
      return;
    }
    if (qtyNum <= 0 && mode !== 'adjust') {
      alert('Số lượng phải lớn hơn 0');
      return;
    }

    const adjustmentData = {
      productId: currentProd.id,
      productName: currentProd.name,
      sku: currentProd.sku || `SKU-NAT-${currentProd.id}`,
      mode,
      movementType: mode === 'add' ? 'Purchase' : (mode === 'remove' ? 'Damaged' : (mode === 'transfer' ? 'Transfer' : 'Manual Adjustment')),
      quantity: mode === 'remove' || mode === 'transfer' ? -qtyNum : (mode === 'adjust' ? qtyNum - currentStock : qtyNum),
      previousStock: currentStock,
      newStock: newStock,
      sourceWarehouse,
      targetWarehouse: mode === 'transfer' ? targetWarehouse : undefined,
      reason,
      note,
      admin: adminName,
      date: new Date().toISOString()
    };

    if (onApplyAdjustment) {
      onApplyAdjustment(adjustmentData);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1050,
      padding: '20px'
    }}>
      <div className="inventory-adjustment-modal" style={{
        background: '#ffffff',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '560px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
        overflow: 'hidden',
        animation: 'fadeIn 0.2s ease-out'
      }}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          borderBottom: '1px solid #e2e8f0',
          background: '#fafbfd'
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Warehouse size={18} color="#4f46e5" /> Nghiệp Vụ Kho Linh Kiện (Inventory Action)
            </h3>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
              Nhập, xuất hủy, điều chuyển hoặc cân đối tồn kho chính xác
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          {/* Action Mode Selector */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Loại thao tác nghiệp vụ:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { id: 'add', label: '+ Add Stock', color: '#16a34a', bg: '#f0fdf4' },
                { id: 'remove', label: '- Remove Stock', color: '#dc2626', bg: '#fef2f2' },
                { id: 'adjust', label: '⚖️ Adjust', color: '#2563eb', bg: '#eff6ff' },
                { id: 'transfer', label: '⇄ Transfer', color: '#7c3aed', bg: '#faf5ff' }
              ].map(m => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setMode(m.id);
                    if (m.id === 'add') setReason('Nhập hàng mới từ NCC');
                    else if (m.id === 'remove') setReason('Linh kiện lỗi hỏng / xuất hủy');
                    else if (m.id === 'adjust') setReason('Kiểm kê cân bằng kho');
                    else if (m.id === 'transfer') setReason('Điều chuyển nội bộ chi nhánh');
                  }}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '8px',
                    border: mode === m.id ? `2px solid ${m.color}` : '1px solid #cbd5e1',
                    background: mode === m.id ? m.bg : '#ffffff',
                    color: mode === m.id ? m.color : '#475569',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Select */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Linh kiện / Dàn PC:
            </label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              disabled={Boolean(selectedProduct)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                background: selectedProduct ? '#f8fafc' : '#ffffff'
              }}
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (Tồn: {p.stock !== undefined ? p.stock : (p.currentStock || 0)}) • SKU: {p.sku || p.id}
                </option>
              ))}
            </select>
          </div>

          {/* Warehouse Configuration */}
          <div style={{ display: 'grid', gridTemplateColumns: mode === 'transfer' ? '1fr 1fr' : '1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                {mode === 'transfer' ? 'Kho xuất đi (Source):' : 'Kho thực hiện:'}
              </label>
              <select
                value={sourceWarehouse}
                onChange={(e) => setSourceWarehouse(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
              >
                <option value="Kho Tổng Hà Nội">🏢 Kho Tổng Hà Nội (Trần Đại Nghĩa)</option>
                <option value="Kho Hồ Chí Minh">🏬 Kho Hồ Chí Minh (Quận 10)</option>
                <option value="Kho Đà Nẵng">🏪 Kho Đà Nẵng (Hải Châu)</option>
              </select>
            </div>

            {mode === 'transfer' && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                  Kho tiếp nhận (Destination):
                </label>
                <select
                  value={targetWarehouse}
                  onChange={(e) => setTargetWarehouse(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                >
                  <option value="Kho Hồ Chí Minh">🏬 Kho Hồ Chí Minh (Quận 10)</option>
                  <option value="Kho Tổng Hà Nội">🏢 Kho Tổng Hà Nội (Trần Đại Nghĩa)</option>
                  <option value="Kho Đà Nẵng">🏪 Kho Đà Nẵng (Hải Châu)</option>
                </select>
              </div>
            )}
          </div>

          {/* Quantity & Stock Preview */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '14px', marginBottom: '14px', alignItems: 'center' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                {mode === 'adjust' ? 'Số lượng tồn sau kiểm kê:' : 'Số lượng linh kiện:'}
              </label>
              <input
                type="number"
                min={mode === 'adjust' ? 0 : 1}
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', fontWeight: 700 }}
              />
            </div>

            {/* Live Calculation Preview Card */}
            <div style={{
              background: '#f8fafc',
              border: '1px dashed #cbd5e1',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Tồn hiện tại:</span>
                <span style={{ fontWeight: 600 }}>{currentStock}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Tồn dự kiến sau xử lý:</span>
                <span style={{ fontWeight: 700, color: newStock > 5 ? '#16a34a' : (newStock > 0 ? '#d97706' : '#dc2626') }}>
                  {newStock} ({mode === 'add' ? `+${qtyNum}` : (mode === 'adjust' ? (qtyNum - currentStock >= 0 ? `+${qtyNum - currentStock}` : `${qtyNum - currentStock}`) : `-${qtyNum}`)})
                </span>
              </div>
            </div>
          </div>

          {/* Reason & Notes */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Lý do biến động:
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="VD: Nhập lô hàng VGA mới từ ASUS Việt Nam..."
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Mã chứng từ / Ghi chú (Ref Code):
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Phiếu NK-2026-9812 / Biên bản kiểm kê K02"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px' }}
            />
          </div>

          {/* Footer Submit Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: '#4f46e5',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Check size={16} /> Xác Nhận Lưu Kho
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
