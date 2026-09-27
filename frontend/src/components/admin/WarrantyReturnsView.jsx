import React, { useState } from 'react';
import { ShieldCheck, Plus, CheckCircle2, Clock, AlertTriangle, Search } from 'lucide-react';

export default function WarrantyReturnsView() {
  const [searchTerm, setSearchTerm] = useState('');

  const [rmaTickets, setRmaTickets] = useState([
    {
      id: 'RMA-2026-081',
      customerName: 'Hoàng Minh Quân',
      customerPhone: '0912.345.678',
      serialNumber: 'SN-RTX5070TI-891024',
      productName: 'VGA ASUS ROG Strix GeForce RTX 5070 Ti 16GB',
      issue: 'Mất tín hiệu màn hình khi tải game nặng (Crash to Desktop)',
      receivedDate: '26/09/2026',
      status: 'Đang kiểm tra',
      technician: 'Nguyễn Kỹ Thuật'
    },
    {
      id: 'RMA-2026-080',
      customerName: 'Trần Văn Mạnh',
      customerPhone: '0988.777.666',
      serialNumber: 'SN-MAIN-B760M-552199',
      productName: 'Bo mạch chủ MSI MAG B760M MORTAR WIFI',
      issue: 'Không nhận khe RAM B2, đèn báo DRAM nhấp nháy đỏ',
      receivedDate: '24/09/2026',
      status: 'Chờ linh kiện đổi mới',
      technician: 'Lê Phần Cứng'
    },
    {
      id: 'RMA-2026-079',
      customerName: 'Lê Hoàng Nam',
      customerPhone: '0903.111.222',
      serialNumber: 'SN-PSU-RM850E-100452',
      productName: 'Nguồn máy tính Corsair RM850e 850W Gold',
      issue: 'Quạt tản nhiệt kêu rè khi tải cao',
      receivedDate: '20/09/2026',
      status: 'Đã hoàn tất đổi trả',
      technician: 'Nguyễn Kỹ Thuật'
    }
  ]);

  const filteredTickets = rmaTickets.filter(t =>
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đã hoàn tất đổi trả':
        return <span className="tail-badge badge-success"><CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} /> {status}</span>;
      case 'Chờ linh kiện đổi mới':
        return <span className="tail-badge badge-warning" style={{ background: '#fef3c7', color: '#b45309' }}><Clock size={12} style={{ display: 'inline', marginRight: 3 }} /> {status}</span>;
      case 'Đang kiểm tra':
        return <span className="tail-badge badge-info" style={{ background: '#e0f2fe', color: '#0369a1' }}><AlertTriangle size={12} style={{ display: 'inline', marginRight: 3 }} /> {status}</span>;
      default:
        return <span className="tail-badge badge-secondary">{status}</span>;
    }
  };

  return (
    <div className="tail-content-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={20} color="#4f46e5" /> Tiếp Nhận Bảo Hành & Đổi Trả Linh Kiện (RMA)
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Tra cứu theo Serial Number, theo dõi tiến độ sửa chữa và đổi trả linh kiện PC chính hãng
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Mở form tiếp nhận phiếu bảo hành mới')}
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
          <Plus size={14} /> Tiếp Nhận Phiếu Bảo Hành
        </button>
      </div>

      {/* Search Input */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
        <Search size={16} color="#94a3b8" />
        <input
          type="text"
          placeholder="Tra cứu theo mã phiếu (#RMA), Serial Number (SN-...), tên khách hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ border: 'none', outline: 'none', width: '100%', fontSize: 13 }}
        />
      </div>

      <div className="tail-table-container" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px' }}>MÃ PHIẾU</th>
              <th style={{ padding: '12px' }}>KHÁCH HÀNG</th>
              <th style={{ padding: '12px' }}>LINH KIỆN & SERIAL NUMBER</th>
              <th style={{ padding: '12px' }}>LỖI MÔ TẢ</th>
              <th style={{ padding: '12px' }}>NGÀY NHẬN</th>
              <th style={{ padding: '12px' }}>KỸ THUẬT VIÊN</th>
              <th style={{ padding: '12px' }}>TRẠNG THÁI</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontWeight: 600, color: '#4f46e5' }}>
                    {t.id}
                  </code>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{t.customerName}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{t.customerPhone}</div>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{t.productName}</div>
                  <code style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{t.serialNumber}</code>
                </td>
                <td style={{ padding: '12px', color: '#475569', maxWidth: 220, fontSize: 12 }}>
                  {t.issue}
                </td>
                <td style={{ padding: '12px', color: '#64748b', fontSize: 12 }}>{t.receivedDate}</td>
                <td style={{ padding: '12px', color: '#334155', fontWeight: 500 }}>{t.technician}</td>
                <td style={{ padding: '12px' }}>{getStatusBadge(t.status)}</td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => alert(`Cập nhật trạng thái phiếu: ${t.id}`)}
                    style={{
                      padding: '4px 8px',
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: 4,
                      fontSize: 11,
                      fontWeight: 600,
                      color: '#4f46e5',
                      cursor: 'pointer'
                    }}
                  >
                    Cập Nhật
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
