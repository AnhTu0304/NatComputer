import React from 'react';
import { AlertTriangle, PlusCircle } from 'lucide-react';

export default function LowStockWidget({
  lowStockItems = [],
  onRestockClick,
  onViewAllInventory
}) {
  const defaultItems = [
    { id: 'p_gpu_5070', name: 'NVIDIA GeForce RTX 5070 Ti 16GB', sku: 'VGA-RTX5070TI-16G', currentStock: 2, minStock: 5, status: 'Low Stock' },
    { id: 'p_cpu_14700k', name: 'Intel Core i7-14700K 20 Cores', sku: 'CPU-INTEL-14700K', currentStock: 0, minStock: 8, status: 'Out of Stock' },
    { id: 'p_ram_32g', name: 'Corsair Vengeance 32GB RGB DDR5 6000MHz', sku: 'RAM-DDR5-32G-6000', currentStock: 3, minStock: 10, status: 'Low Stock' },
    { id: 'p_psu_850w', name: 'Corsair RM850e 850W Gold ATX 3.0', sku: 'PSU-RM850E-GOLD', currentStock: 1, minStock: 6, status: 'Low Stock' },
    { id: 'p_ssd_2tb', name: 'Samsung 990 Pro 2TB NVMe Gen4', sku: 'SSD-SAM-990PRO-2TB', currentStock: 0, minStock: 5, status: 'Backorder' }
  ];

  const items = (lowStockItems && lowStockItems.length > 0) ? lowStockItems : defaultItems;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return <span className="tail-badge badge-success">In Stock</span>;
      case 'Low Stock':
        return <span className="tail-badge badge-warning" style={{ background: '#fef3c7', color: '#b45309' }}>Low Stock</span>;
      case 'Out of Stock':
        return <span className="tail-badge badge-danger" style={{ background: '#fee2e2', color: '#b91c1c' }}>Out of Stock</span>;
      case 'Backorder':
        return <span className="tail-badge badge-info" style={{ background: '#e0f2fe', color: '#0369a1' }}>Backorder</span>;
      default:
        return <span className="tail-badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <AlertTriangle size={16} color="#f59e0b" /> Cảnh Báo Tồn Kho (Low Stock)
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Linh kiện máy tính cần nhập bổ sung kho ngay
          </p>
        </div>
        {onViewAllInventory && (
          <button
            type="button"
            className="tail-btn-subtle"
            onClick={onViewAllInventory}
            style={{ fontSize: 12, fontWeight: 600, color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Kho linh kiện →
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {items.slice(0, 5).map((item) => (
          <div
            key={item.id || item.sku}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: 8,
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              gap: 12
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{item.sku}</span>
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Tồn: <strong style={{ color: item.currentStock === 0 ? '#ef4444' : '#f59e0b' }}>{item.currentStock}</strong> / Min: {item.minStock}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {getStatusBadge(item.status)}
              <button
                type="button"
                onClick={() => onRestockClick && onRestockClick(item)}
                title="Tạo phiếu nhập hàng linh kiện này"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#4f46e5',
                  background: '#eef2ff',
                  border: '1px solid #c7d2fe',
                  padding: '4px 8px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                <PlusCircle size={12} /> Nhập
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
