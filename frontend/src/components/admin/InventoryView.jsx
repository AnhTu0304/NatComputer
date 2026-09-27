import React, { useState } from 'react';
import { Warehouse, AlertTriangle, CheckCircle2, ArrowUpDown, Search, Filter } from 'lucide-react';

export default function InventoryView({
  products = [],
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'low', 'out', 'in'
  const [searchTerm, setSearchTerm] = useState('');

  // Normalize products with stock values
  const inventoryItems = products.map((p, idx) => {
    const currentStock = p.stock !== undefined ? p.stock : (idx % 7 === 0 ? 0 : (idx % 3 === 0 ? 2 : 12));
    const minStock = p.minStock || 5;
    let status = 'In Stock';
    if (currentStock === 0) status = 'Out of Stock';
    else if (currentStock <= minStock) status = 'Low Stock';

    return {
      id: p.id,
      name: p.name,
      sku: p.sku || `SKU-NAT-${p.id ? String(p.id).slice(-4).toUpperCase() : 1000 + idx}`,
      category: p.category || 'Linh Kiện',
      price: p.price || 0,
      currentStock,
      minStock,
      status,
      image: p.image
    };
  });

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filterStatus === 'low') return item.status === 'Low Stock';
    if (filterStatus === 'out') return item.status === 'Out of Stock';
    if (filterStatus === 'in') return item.status === 'In Stock';
    return true;
  });

  const countLow = inventoryItems.filter(i => i.status === 'Low Stock').length;
  const countOut = inventoryItems.filter(i => i.status === 'Out of Stock').length;
  const countIn = inventoryItems.filter(i => i.status === 'In Stock').length;

  return (
    <div className="tail-content-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Top Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Warehouse size={20} color="#4f46e5" /> Quản Lý Kho & Mức Tồn Linh Kiện (Inventory)
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Giám sát mức tồn kho an toàn, cảnh báo thiếu hụt linh kiện PC và phụ kiện
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #e2e8f0',
              background: filterStatus === 'all' ? '#4f46e5' : '#fff',
              color: filterStatus === 'all' ? '#fff' : '#475569',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Tất cả ({inventoryItems.length})
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'low' ? 'active' : ''}`}
            onClick={() => setFilterStatus('low')}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #fed7aa',
              background: filterStatus === 'low' ? '#f59e0b' : '#fff',
              color: filterStatus === 'low' ? '#fff' : '#b45309',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Sắp hết ({countLow})
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'out' ? 'active' : ''}`}
            onClick={() => setFilterStatus('out')}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #fecaca',
              background: filterStatus === 'out' ? '#ef4444' : '#fff',
              color: filterStatus === 'out' ? '#fff' : '#b91c1c',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Hết hàng ({countOut})
          </button>
          <button
            type="button"
            className={`pill-btn ${filterStatus === 'in' ? 'active' : ''}`}
            onClick={() => setFilterStatus('in')}
            style={{
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid #bbf7d0',
              background: filterStatus === 'in' ? '#10b981' : '#fff',
              color: filterStatus === 'in' ? '#fff' : '#15803d',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Đầy đủ ({countIn})
          </button>
        </div>
      </div>

      {/* Search Input for Inventory */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Search size={16} color="#94a3b8" />
        <input
          type="text"
          placeholder="Lọc linh kiện theo tên, mã SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: 13 }}
        />
      </div>

      {/* Inventory Data Table */}
      <div className="tail-table-container" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px' }}>SẢN PHẨM / LINH KIỆN</th>
              <th style={{ padding: '12px' }}>MÃ SKU</th>
              <th style={{ padding: '12px' }}>DANH MỤC</th>
              <th style={{ padding: '12px' }}>ĐƠN GIÁ</th>
              <th style={{ padding: '12px' }}>TỒN HIỆN TẠI</th>
              <th style={{ padding: '12px' }}>MIN STOCK</th>
              <th style={{ padding: '12px' }}>TRẠNG THÁI</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
                  Không tìm thấy linh kiện nào phù hợp với bộ lọc.
                </td>
              </tr>
            ) : (
              filteredItems.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=100&q=80'}
                        alt={item.name}
                        style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover', border: '1px solid #e2e8f0' }}
                      />
                      <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>
                      {item.sku}
                    </code>
                  </td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{item.category}</td>
                  <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{currencyFormatter(item.price)}</td>
                  <td style={{ padding: '12px', fontWeight: 700, color: item.currentStock === 0 ? '#ef4444' : (item.currentStock <= item.minStock ? '#f59e0b' : '#10b981') }}>
                    {item.currentStock} cái
                  </td>
                  <td style={{ padding: '12px', color: '#64748b' }}>{item.minStock} cái</td>
                  <td style={{ padding: '12px' }}>
                    {item.status === 'In Stock' && <span className="tail-badge badge-success">In Stock</span>}
                    {item.status === 'Low Stock' && <span className="tail-badge badge-warning">Low Stock</span>}
                    {item.status === 'Out of Stock' && <span className="tail-badge badge-danger">Out of Stock</span>}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => alert(`Điều chỉnh tồn kho cho: ${item.name}`)}
                      style={{
                        padding: '4px 8px',
                        background: '#eef2ff',
                        color: '#4f46e5',
                        border: '1px solid #c7d2fe',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <ArrowUpDown size={12} style={{ display: 'inline', marginRight: 2 }} /> Điều Chỉnh
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
