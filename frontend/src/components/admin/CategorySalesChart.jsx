import React from 'react';
import { Layers } from 'lucide-react';

export default function CategorySalesChart({
  categoriesData = [],
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const defaultNineCategories = [
    { name: 'GPU (Card Đồ Họa)', short: 'GPU', share: 28, revenue: 138600000, color: '#4f46e5' },
    { name: 'CPU (Bộ Vi Xử Lý)', short: 'CPU', share: 18, revenue: 89100000, color: '#2563eb' },
    { name: 'Motherboard (Bo Mạch Chủ)', short: 'Motherboard', share: 12, revenue: 59400000, color: '#0891b2' },
    { name: 'RAM (Bộ Nhớ Trong)', short: 'RAM', share: 10, revenue: 49500000, color: '#0d9488' },
    { name: 'SSD (Ổ Cứng)', short: 'SSD', share: 9, revenue: 44550000, color: '#10b981' },
    { name: 'Monitor (Màn Hình)', short: 'Monitor', share: 8, revenue: 39600000, color: '#f59e0b' },
    { name: 'PSU (Nguồn Máy Tính)', short: 'PSU', share: 6, revenue: 29700000, color: '#ea580c' },
    { name: 'Peripherals (Gaming Gear)', short: 'Peripherals', share: 5, revenue: 24750000, color: '#8b5cf6' },
    { name: 'Case (Vỏ Máy Tính)', short: 'Case', share: 4, revenue: 19800000, color: '#64748b' }
  ];

  const data = (categoriesData && categoriesData.length > 0) ? categoriesData : defaultNineCategories;

  return (
    <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={16} color="#4f46e5" /> Doanh Số Theo Danh Mục (Sales by Category)
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Phân bổ 9 nhóm linh kiện phần cứng PC và thiết bị ngoại vi
          </p>
        </div>
      </div>

      {/* Segmented Bar Visualizer */}
      <div style={{ height: 10, borderRadius: 5, display: 'flex', overflow: 'hidden', marginBottom: 16, background: '#f1f5f9' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${item.share}%`,
              background: item.color,
              transition: 'width 0.3s ease'
            }}
            title={`${item.name || item.short}: ${item.share}% (${currencyFormatter(item.revenue)})`}
          />
        ))}
      </div>

      {/* Category Breakdown 9-Item Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px 16px',
          maxHeight: 280,
          overflowY: 'auto'
        }}
      >
        {data.map((cat, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: 12,
              padding: '6px 8px',
              borderRadius: 6,
              background: '#f8fafc',
              border: '1px solid #f1f5f9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0, flex: 1 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: cat.color,
                  flexShrink: 0
                }}
              />
              <span style={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cat.short || cat.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 11 }}>
                {currencyFormatter(cat.revenue)}
              </span>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '1px 5px', borderRadius: 4 }}>
                {cat.share}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
