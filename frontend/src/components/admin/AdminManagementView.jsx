import React, { useState } from 'react';
import { UserCheck, Plus, Shield, ShieldAlert, Key } from 'lucide-react';

export default function AdminManagementView({
  usersList = [],
  onToggleUserRole,
  onDeleteUser
}) {
  const staffMembers = [
    {
      id: 'staff_1',
      name: 'Ngô Anh Tú',
      email: 'anhtu@natcomputer.vn',
      role: 'Master Admin',
      department: 'Ban Giám Đốc',
      permissions: ['Toàn quyền hệ thống', 'Duyệt tài chính', 'Quản lý nhân sự'],
      status: 'Đang hoạt động'
    },
    {
      id: 'staff_2',
      name: 'Trần Văn Kho',
      email: 'kho@natcomputer.vn',
      role: 'Thủ Kho Phần Cứng',
      department: 'Bộ phận Kho & Vận chuyển',
      permissions: ['Xem đơn', 'Quản lý tồn kho', 'Nhập/Xuất linh kiện'],
      status: 'Đang hoạt động'
    },
    {
      id: 'staff_3',
      name: 'Lê Kỹ Thuật PC',
      email: 'technical@natcomputer.vn',
      role: 'Kỹ Thuật Viên Lắp Ráp & RMA',
      department: 'Bộ phận Kỹ thuật & Bảo hành',
      permissions: ['Tiếp nhận RMA', 'Kiểm tra Serial', 'Cấu hình PC Build'],
      status: 'Đang hoạt động'
    },
    {
      id: 'staff_4',
      name: 'Vũ Thị Sales',
      email: 'sales@natcomputer.vn',
      role: 'Tư Vấn Bán Hàng',
      department: 'Bộ phận Bán hàng Online',
      permissions: ['Xem đơn hàng', 'Tư vấn cấu hình', 'Xem đánh giá'],
      status: 'Đang hoạt động'
    }
  ];

  return (
    <div className="tail-content-panel" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserCheck size={20} color="#4f46e5" /> Quản Trị Viên & Phân Quyền Nhân Sự (Admin Roles)
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Quản lý tài khoản nội bộ và phân chia quyền hạn truy cập các phân hệ trong hệ thống
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Mở form thêm tài khoản nhân viên quản trị mới')}
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
          <Plus size={14} /> Thêm Quản Trị Viên
        </button>
      </div>

      <div className="tail-table-container" style={{ background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '12px' }}>NHÂN VIÊN</th>
              <th style={{ padding: '12px' }}>EMAIL NỘI BỘ</th>
              <th style={{ padding: '12px' }}>PHÒNG BAN</th>
              <th style={{ padding: '12px' }}>VAI TRÒ (ROLE)</th>
              <th style={{ padding: '12px' }}>QUYỀN HẠN PHÂN BỔ</th>
              <th style={{ padding: '12px' }}>TRẠNG THÁI</th>
              <th style={{ padding: '12px', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.map(staff => (
              <tr key={staff.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{staff.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>ID: {staff.id}</div>
                </td>
                <td style={{ padding: '12px', color: '#475569' }}>{staff.email}</td>
                <td style={{ padding: '12px', color: '#334155' }}>{staff.department}</td>
                <td style={{ padding: '12px' }}>
                  <span className="tail-role-badge role-admin" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Shield size={12} /> {staff.role}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                    {staff.permissions.map((p, idx) => (
                      <span key={idx} style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, color: '#334155' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <span className="tail-badge badge-success">{staff.status}</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={() => alert(`Chỉnh sửa quyền cho nhân viên: ${staff.name}`)}
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
                    <Key size={12} style={{ display: 'inline', marginRight: 2 }} /> Phân Quyền
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
