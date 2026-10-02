import React from 'react';
import { X, Printer, CheckCircle2 } from 'lucide-react';
import { HARDWARE_CATEGORIES } from '../../services/hardwareApi';
import './pc-builder.css';

export default function BuildPrintModal({ isOpen, onClose, selectedParts, quantities, totalPrice }) {
  if (!isOpen) return null;

  const fmt = (v) => `${new Intl.NumberFormat('vi-VN').format(v || 0)} đ`;
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
  const buildCode = `PC-${Date.now().toString().slice(-6)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="part-modal-overlay" onClick={onClose}>
      <div 
        className="part-modal-dialog"
        style={{ maxWidth: '960px' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden when printing) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 24px',
          background: '#0f172a',
          color: '#ffffff'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Printer size={18} color="#e22718" />
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Bản Báo Giá Cấu Hình PC - NAT Computer</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                background: '#e22718',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <Printer size={14} /> In / Lưu PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px 40px', background: '#ffffff', color: '#1e293b' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '20px', borderBottom: '2px solid #e22718' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#e22718', margin: 0 }}>NAT COMPUTER</h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0' }}>Hệ Thống Máy Tính Gaming & Workstation Hàng Đầu</p>
              <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>📍 Địa chỉ: Cầu Giấy, Hà Nội | Hotline: 0886.97.6868</p>
              <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0' }}>🌐 Website: natcomputer.vn | Email: support@natcomputer.vn</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase' }}>BẢNG BÁO GIÁ CẤU HÌNH</h2>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0' }}>Mã: <strong style={{ color: '#0f172a' }}>{buildCode}</strong></p>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0' }}>Ngày lập: {dateStr}</p>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#475569' }}>
                <th style={{ padding: '10px 8px', textAlign: 'center', width: '40px' }}>STT</th>
                <th style={{ padding: '10px 8px', width: '140px' }}>Linh Kiện</th>
                <th style={{ padding: '10px 8px' }}>Tên Sản Phẩm / Thông Số</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', width: '90px' }}>Bảo Hành</th>
                <th style={{ padding: '10px 8px', textAlign: 'center', width: '50px' }}>SL</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', width: '110px' }}>Đơn Giá</th>
                <th style={{ padding: '10px 8px', textAlign: 'right', width: '120px' }}>Thành Tiền</th>
              </tr>
            </thead>
            <tbody>
              {HARDWARE_CATEGORIES.map((cat, idx) => {
                const item = selectedParts[cat.id];
                const qty = quantities[cat.id] || 1;
                const itemTotal = (item?.price || 0) * qty;

                return (
                  <tr key={cat.id} style={{ borderBottom: '1px solid #f1f5f9', background: idx % 2 === 0 ? '#fff' : '#fafbfd' }}>
                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>{cat.num}</td>
                    <td style={{ padding: '10px 8px', fontWeight: 700, color: '#0f172a' }}>{cat.name}</td>
                    <td style={{ padding: '10px 8px' }}>
                      {item ? (
                        <div>
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{item.name}</span>
                          {item.specs?.socket && (
                            <span style={{ fontSize: '11px', color: '#2563eb', display: 'block', marginTop: '2px' }}>Socket: {item.specs.socket}</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontStyle: 'italic', color: '#94a3b8' }}>Chưa chọn</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center', color: '#64748b' }}>
                      {item ? (item.specs?.warranty || '36 Tháng') : '-'}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'center', fontWeight: 700 }}>
                      {item ? qty : '-'}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', color: '#475569' }}>
                      {item ? fmt(item.price) : '-'}
                    </td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, color: '#e22718' }}>
                      {item ? fmt(itemTotal) : '0 đ'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Total & Commitments */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
            <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, maxWidth: '480px' }}>
              <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={15} color="#16a34a" /> Cam kết bán hàng tại NAT Computer:
              </p>
              <p>• 100% Linh kiện mới, chính hãng, nguyên seal theo nhà sản xuất.</p>
              <p>• Miễn phí công lắp ráp, đi dây chuyên nghiệp và cài đặt Windows + PM cơ bản.</p>
              <p>• Đổi mới 1:1 trong 30 ngày đầu tiên nếu lỗi phần cứng do nhà sản xuất.</p>
            </div>

            <div style={{ textAlign: 'right', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '12px 20px', minWidth: '240px' }}>
              <span style={{ fontSize: '13px', color: '#475569', textTransform: 'uppercase', fontWeight: 600 }}>Tổng Chi Phí:</span>
              <span style={{ fontSize: '22px', fontWeight: 900, color: '#e22718', display: 'block', marginTop: '2px' }}>
                {fmt(totalPrice)}
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>(Đã bao gồm VAT 10%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
