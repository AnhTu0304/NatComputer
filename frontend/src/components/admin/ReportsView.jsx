import React from 'react';
import { BarChart3, Download, TrendingUp, Calendar } from 'lucide-react';

export default function ReportsView({
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const reportRows = [
    { period: 'Tháng 09/2026', revenue: 495000000, profit: 99000000, orders: 162, aov: 3055000, margin: '20.0%' },
    { period: 'Tháng 08/2026', revenue: 420000000, profit: 88200000, orders: 135, aov: 3111000, margin: '21.0%' },
    { period: 'Tháng 07/2026', revenue: 310000000, profit: 62000000, orders: 105, aov: 2952000, margin: '20.0%' },
    { period: 'Tháng 06/2026', revenue: 380000000, profit: 79800000, orders: 120, aov: 3166000, margin: '21.0%' },
    { period: 'Tháng 05/2026', revenue: 240000000, profit: 48000000, orders: 78, aov: 3076000, margin: '20.0%' },
    { period: 'Tháng 04/2026', revenue: 290000000, profit: 58000000, orders: 94, aov: 3085000, margin: '20.0%' }
  ];

  return (
    <div className="tail-content-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={20} color="#4f46e5" /> Báo Cáo Doanh Số & Phân Tích Tài Chính Cửa Hàng
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Tổng hợp dữ liệu doanh thu, lợi nhuận gộp và giá trị đơn hàng trung bình (AOV)
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Xuất file báo cáo doanh số Excel/CSV thành công.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#10b981',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Download size={14} /> Xuất Báo Cáo (Excel)
        </button>
      </div>

      {/* Summary Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>TỔNG DOANH THU 6 THÁNG</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
            {currencyFormatter(2135000000)}
          </div>
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>↑ +26.5% so với cùng kỳ 2025</span>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>LỢI NHUẬN GỘP (ESTIMATED)</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#4f46e5', marginTop: 4 }}>
            {currencyFormatter(435000000)}
          </div>
          <span style={{ fontSize: 11, color: '#64748b' }}>Biên lợi nhuận gộp trung bình 20.4%</span>
        </div>

        <div style={{ background: '#fff', padding: '16px 20px', borderRadius: 12, border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>TỔNG SỐ ĐƠN THÀNH CÔNG</span>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>
            694 đơn
          </div>
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Tỷ lệ giao hàng thành công 98.2%</span>
        </div>
      </div>

      {/* Monthly Breakdown Table */}
      <div className="tail-table-container" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px' }}>KỲ BÁO CÁO</th>
              <th style={{ padding: '12px' }}>DOANH THU</th>
              <th style={{ padding: '12px' }}>LỢI NHUẬN GỘP</th>
              <th style={{ padding: '12px' }}>SỐ LƯỢNG ĐƠN</th>
              <th style={{ padding: '12px' }}>GIÁ TRỊ ĐƠN TB (AOV)</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>BIÊN LỢI NHUẬN</th>
            </tr>
          </thead>
          <tbody>
            {reportRows.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px', fontWeight: 600, color: '#0f172a' }}>{r.period}</td>
                <td style={{ padding: '12px', fontWeight: 700, color: '#4f46e5' }}>{currencyFormatter(r.revenue)}</td>
                <td style={{ padding: '12px', fontWeight: 600, color: '#10b981' }}>{currencyFormatter(r.profit)}</td>
                <td style={{ padding: '12px', color: '#334155' }}>{r.orders} đơn</td>
                <td style={{ padding: '12px', color: '#334155' }}>{currencyFormatter(r.aov)}</td>
                <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, color: '#0f172a' }}>{r.margin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
