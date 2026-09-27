import React from 'react';
import { Package } from 'lucide-react';

export default function TopProductsTable({
  products = [],
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const defaultTopProducts = [
    {
      id: 'p1',
      name: 'PC Gaming NAT Ultra 9 - RTX 5080 16GB',
      sku: 'PC-NAT-U9-5080',
      category: 'PC Builds',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&q=80',
      unitsSold: 28,
      revenue: 251720000,
      stock: 6,
      status: 'In Stock'
    },
    {
      id: 'p2',
      name: 'VGA ASUS ROG Strix GeForce RTX 5070 Ti 16GB',
      sku: 'VGA-ROG-5070TI',
      category: 'VGA/GPU',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=120&q=80',
      unitsSold: 45,
      revenue: 139500000,
      stock: 2,
      status: 'Low Stock'
    },
    {
      id: 'p3',
      name: 'CPU Intel Core i7-14700K 20 Cores 28 Threads',
      sku: 'CPU-INTEL-14700K',
      category: 'CPU',
      image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=120&q=80',
      unitsSold: 62,
      revenue: 68200000,
      stock: 14,
      status: 'In Stock'
    },
    {
      id: 'p4',
      name: 'Màn hình ASUS ROG Swift 27 inch OLED 240Hz',
      sku: 'MON-ASUS-27-OLED',
      category: 'Monitors',
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=120&q=80',
      unitsSold: 19,
      revenue: 47500000,
      stock: 4,
      status: 'In Stock'
    },
    {
      id: 'p5',
      name: 'RAM Corsair Dominator Titanium 64GB DDR5 6400MHz',
      sku: 'RAM-DOM-64G-DDR5',
      category: 'RAM',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=120&q=80',
      unitsSold: 34,
      revenue: 28900000,
      stock: 0,
      status: 'Out of Stock'
    }
  ];

  const items = (products && products.length > 0)
    ? products.slice(0, 5).map((p, idx) => ({
        id: p.id || `p_${idx}`,
        name: p.name,
        sku: p.sku || `SKU-NAT-${p.id ? String(p.id).slice(-4).toUpperCase() : 1000 + idx}`,
        category: p.category || 'Linh Kiện PC',
        image: p.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=120&q=80',
        unitsSold: p.unitsSold || (25 - idx * 4),
        revenue: p.revenue || (p.price ? p.price * (25 - idx * 4) : 45000000),
        stock: p.stock !== undefined ? p.stock : (10 - idx * 2),
        status: p.stock === 0 ? 'Out of Stock' : (p.stock <= 3 ? 'Low Stock' : 'In Stock')
      }))
    : defaultTopProducts;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return <span className="tail-badge badge-success">In Stock</span>;
      case 'Low Stock':
        return <span className="tail-badge badge-warning">Low Stock</span>;
      case 'Out of Stock':
        return <span className="tail-badge badge-danger">Out of Stock</span>;
      default:
        return <span className="tail-badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Package size={16} color="#4f46e5" /> Top Sản Phẩm & Cấu Hình PC Bán Chạy
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Xếp hạng theo số lượng xuất kho và doanh thu mang lại
          </p>
        </div>
      </div>

      <div className="tail-table-container" style={{ overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '10px 12px' }}>SẢN PHẨM</th>
              <th style={{ padding: '10px 12px' }}>MÃ SKU</th>
              <th style={{ padding: '10px 12px' }}>DANH MỤC</th>
              <th style={{ padding: '10px 12px' }}>ĐÃ BÁN</th>
              <th style={{ padding: '10px 12px' }}>DOANH THU</th>
              <th style={{ padding: '10px 12px' }}>TỒN KHO</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            {items.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover', background: '#f8fafc', border: '1px solid #e2e8f0' }}
                    />
                    <div style={{ fontWeight: 600, color: '#0f172a', maxWidth: 260, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prod.name}
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>
                    {prod.sku}
                  </code>
                </td>
                <td style={{ padding: '12px', color: '#64748b', fontSize: 12 }}>
                  {prod.category}
                </td>
                <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>
                  {prod.unitsSold} bộ/chiếc
                </td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#4f46e5' }}>
                  {currencyFormatter(prod.revenue)}
                </td>
                <td style={{ padding: '12px', color: prod.stock <= 3 ? '#ef4444' : '#0f172a', fontWeight: 600 }}>
                  {prod.stock}
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  {getStatusBadge(prod.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
