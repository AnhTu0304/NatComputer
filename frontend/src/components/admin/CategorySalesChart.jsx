import React from 'react';
import { Layers } from 'lucide-react';

export default function CategorySalesChart({
  categoriesData = [],
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const defaultCategories = [
    { name: 'PC Gaming Nguyên Bộ', share: 42, revenue: 185000000, color: '#4f46e5' },
    { name: 'Card Đồ Họa (VGA/GPU)', share: 26, revenue: 114400000, color: '#3b82f6' },
    { name: 'CPU & Bo Mạch Chủ', share: 15, revenue: 66000000, color: '#06b6d4' },
    { name: 'Màn Hình Gaming', share: 9, revenue: 39600000, color: '#10b981' },
    { name: 'Gaming Gear & Phụ Kiện', share: 8, revenue: 35200000, color: '#f59e0b' }
  ];

  const data = (categoriesData && categoriesData.length > 0) ? categoriesData : defaultCategories;

  return (
    <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={16} color="#4f46e5" /> Doanh Số Theo Danh Mục
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Tỷ trọng các nhóm hàng phần cứng và linh kiện
          </p>
        </div>
      </div>

      {/* Segmented Bar Visualizer */}
      <div style={{ height: 12, borderRadius: 6, display: 'flex', overflow: 'hidden', marginBottom: 20, background: '#f1f5f9' }}>
        {data.map((item, idx) => (
          <div
            key={idx}
            style={{
              width: `${item.share}%`,
              background: item.color,
              transition: 'width 0.3s ease'
            }}
            title={`${item.name}: ${item.share}% (${currencyFormatter(item.revenue)})`}
          />
        ))}
      </div>

      {/* Category Breakdown Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, justifyContent: 'center' }}>
        {data.map((cat, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: cat.color,
                  display: 'inline-block'
                }}
              />
              <span style={{ fontWeight: 500, color: '#334155' }}>{cat.name}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{currencyFormatter(cat.revenue)}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, minWidth: 36, textAlign: 'right' }}>
                {cat.share}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
