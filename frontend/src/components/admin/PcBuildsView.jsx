import React from 'react';
import { Cpu, Plus, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PcBuildsView({
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const pcBuildsList = [
    {
      id: 'pc_build_1',
      title: 'NAT PC GAMING CYBERPUNK ULTRA 9',
      category: 'Gaming PC',
      cpu: 'Intel Core i9-14900K 24 Cores',
      gpu: 'NVIDIA GeForce RTX 5080 16GB GDDR7',
      ram: '64GB DDR5 6400MHz RGB',
      ssd: '2TB NVMe Gen4 7400MB/s',
      psu: '1000W 80 Plus Gold ATX 3.0',
      price: 89900000,
      cost: 76000000,
      stock: 4,
      status: 'Sẵn Hàng'
    },
    {
      id: 'pc_build_2',
      title: 'NAT WORKSTATION DEEP LEARNING AI',
      category: 'AI Workstation',
      cpu: 'AMD Ryzen 9 9950X 16 Cores 32 Threads',
      gpu: 'Dual NVIDIA RTX 4090 24GB NVLink',
      ram: '128GB ECC DDR5 5600MHz',
      ssd: '4TB NVMe Gen5 Raid 0',
      psu: '1600W Titanium High-End',
      price: 185000000,
      cost: 160000000,
      stock: 2,
      status: 'Sẵn Hàng'
    },
    {
      id: 'pc_build_3',
      title: 'NAT PC GAMING ESPORTS PRO',
      category: 'Gaming PC',
      cpu: 'AMD Ryzen 7 7800X3D 3D V-Cache',
      gpu: 'NVIDIA GeForce RTX 4070 SUPER 12GB',
      ram: '32GB DDR5 6000MHz CL30',
      ssd: '1TB NVMe PCIe 4.0',
      psu: '750W 80 Plus Gold',
      price: 36500000,
      cost: 30500000,
      stock: 7,
      status: 'Sẵn Hàng'
    },
    {
      id: 'pc_build_4',
      title: 'NAT CREATOR STUDIO 4K',
      category: 'Creator & Editing',
      cpu: 'Intel Core i7-14700K',
      gpu: 'NVIDIA GeForce RTX 4070 Ti SUPER 16GB',
      ram: '64GB DDR5 5600MHz',
      ssd: '2TB Gen4 + 4TB HDD Lưu trữ',
      psu: '850W Gold',
      price: 54900000,
      cost: 46800000,
      stock: 3,
      status: 'Sẵn Hàng'
    }
  ];

  return (
    <div className="tail-content-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cpu size={20} color="#4f46e5" /> Quản Lý Dàn PC Builds & Cấu Hình Lắp Sẵn
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Thiết lập danh mục PC Gaming, Máy trạm AI & Đồ họa cấu hình chuẩn cho khách hàng
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Mở trình cấu hình PC Build mới')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#4f46e5',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          <Plus size={14} /> Tạo Dàn PC Mới
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 20 }}>
        {pcBuildsList.map(pc => {
          const margin = pc.price - pc.cost;
          const marginPercent = Math.round((margin / pc.price) * 100);

          return (
            <div
              key={pc.id}
              style={{
                background: '#fff',
                borderRadius: 12,
                border: '1px solid #e2e8f0',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 14
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '2px 8px', borderRadius: 4 }}>
                    {pc.category}
                  </span>
                  <h4 style={{ margin: '6px 0 0', fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                    {pc.title}
                  </h4>
                </div>
                <span className="tail-badge badge-success">
                  <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} /> {pc.status} ({pc.stock})
                </span>
              </div>

              {/* Specs Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: '#334155', background: '#f8fafc', padding: 12, borderRadius: 8 }}>
                <div><strong>CPU:</strong> {pc.cpu}</div>
                <div><strong>VGA:</strong> {pc.gpu}</div>
                <div><strong>RAM:</strong> {pc.ram}</div>
                <div><strong>Ổ CỨNG:</strong> {pc.ssd}</div>
                <div><strong>NGUỒN:</strong> {pc.psu}</div>
              </div>

              {/* Pricing & Margin */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Giá niêm yết:</div>
                  <strong style={{ fontSize: 16, color: '#4f46e5' }}>{currencyFormatter(pc.price)}</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>Biên lợi nhuận:</div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#10b981' }}>
                    +{currencyFormatter(margin)} ({marginPercent}%)
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  onClick={() => alert(`Chỉnh sửa linh kiện dàn: ${pc.title}`)}
                  style={{
                    flex: 1,
                    padding: '6px 0',
                    background: '#f1f5f9',
                    border: '1px solid #e2e8f0',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Sửa Linh Kiện
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Nhân bản cấu hình: ${pc.title}`)}
                  style={{
                    padding: '6px 12px',
                    background: '#eef2ff',
                    border: '1px solid #c7d2fe',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#4f46e5',
                    cursor: 'pointer'
                  }}
                >
                  <Sparkles size={12} style={{ display: 'inline', marginRight: 2 }} /> Nhân Bản
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
