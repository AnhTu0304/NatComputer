import React, { useState } from 'react';
import {
  X, User, Mail, Phone, Calendar, ShieldCheck, ShieldAlert,
  ShoppingBag, Clock, Eye, EyeOff, KeyRound, Ban, CheckCircle,
  FileText, MessageSquare, AlertTriangle, ExternalLink, Award,
  MapPin, Edit3, Send, RefreshCw, Copy, Check
} from 'lucide-react';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

// Mask sensitive info like email and phone
const maskPhone = (phone) => {
  if (!phone) return '—';
  const clean = String(phone).replace(/\s+/g, '');
  if (clean.length < 7) return clean;
  return clean.slice(0, 3) + '••••' + clean.slice(-3);
};

const maskEmail = (email) => {
  if (!email || !email.includes('@')) return email || '—';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name.charAt(0)}*@${domain}`;
  return `${name.slice(0, 2)}••••${name.slice(-1)}@${domain}`;
};

export default function CustomerDetailDrawer({
  customer,
  isOpen,
  onClose,
  onUpdateCustomer,
  onViewOrder,
  currencyFormatter = fmt
}) {
  const [activeTab, setActiveTab] = useState('orders'); // orders | activity | notes | actions
  const [maskSensitive, setMaskSensitive] = useState(true);
  const [internalNotes, setInternalNotes] = useState(customer?.notes || [
    {
      id: 'nt-1',
      author: 'KTV Hoàng Nam',
      role: 'Kỹ Thuật Viên PC',
      date: '2026-09-20 14:30',
      text: 'Khách chuyên làm đồ họa kiến trúc & Render 3D Lumion. Đang cân nhắc nâng cấp thêm 64GB RAM DDR5.'
    },
    {
      id: 'nt-2',
      author: 'Admin Master',
      role: 'Quản Trị Viên',
      date: '2026-08-15 09:15',
      text: 'Khách hàng VIP thân thiết, đã lắp 3 dàn PC doanh nghiệp. Ưu tiên bảo hành tận nơi trong 2h.'
    }
  ]);
  const [newNoteText, setNewNoteText] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: customer?.name || '',
    email: customer?.email || '',
    phone: customer?.phone || '',
    address: customer?.address || 'Hà Nội, Việt Nam',
    tier: customer?.tier || 'Gold VIP'
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isOpen || !customer) return null;

  const orders = customer.orderHistory || [
    {
      id: 'PC-000845',
      date: '2026-09-25 15:40',
      itemsCount: 4,
      itemsDesc: 'Dàn PC Gaming Ultra i9-14900K / RTX 4090 / 64GB RAM',
      totalAmount: 98500000,
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED'
    },
    {
      id: 'PC-000720',
      date: '2026-08-12 11:15',
      itemsCount: 2,
      itemsDesc: 'Màn hình ASUS ROG Swift OLED PG27AQDM 240Hz',
      totalAmount: 22900000,
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED'
    },
    {
      id: 'PC-000512',
      date: '2026-06-05 18:20',
      itemsCount: 1,
      itemsDesc: 'Bàn phím cơ Custom IQUNIX + Chuột Logitech G Pro X Superlight 2',
      totalAmount: 6490000,
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED'
    }
  ];

  const activities = customer.activityLog || [
    {
      type: 'login',
      title: 'Đăng nhập hệ thống storefront',
      desc: 'Đăng nhập thành công từ Chrome / Windows (IP: 113.190.24.88)',
      time: 'Hôm nay, 10:15'
    },
    {
      type: 'order',
      title: 'Đặt hàng đơn #PC-000845',
      desc: 'Thanh toán trực tuyến VietQR thành công trị giá 98.500.000 ₫',
      time: '25/09/2026 15:40'
    },
    {
      type: 'review',
      title: 'Đánh giá 5 sao sản phẩm',
      desc: 'Đánh giá "VGA Asus ROG Strix RTX 4090 chạy cực êm mát, nhiệt chỉ 62 độ full tải"',
      time: '22/09/2026 09:30'
    },
    {
      type: 'support',
      title: 'Tư vấn kỹ thuật linh kiện',
      desc: 'Chat hỏi KTV về tương thích bo mạch ASUS Z790 và tản nước NZXT Kraken 360',
      time: '18/09/2026 14:00'
    },
    {
      type: 'refund',
      title: 'Yêu cầu đổi trả bảo hành',
      desc: 'Yêu cầu đổi cáp nguồn PCIe Gen5 mới do thùng máy trước thiếu chiều dài',
      time: '10/08/2026 16:45'
    }
  ];

  // Handle Add Internal Note
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    const newNote = {
      id: `nt-${Date.now()}`,
      author: 'Admin Master',
      role: 'Quản Trị Viên',
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      text: newNoteText.trim()
    };
    setInternalNotes([newNote, ...internalNotes]);
    setNewNoteText('');
  };

  // Generate Temporary Password
  const handleResetPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'NAT@';
    for (let i = 0; i < 6; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pwd);
    setIsCopied(false);
  };

  const handleCopyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard?.writeText(tempPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Toggle Account Active / Suspended
  const handleToggleAccountStatus = () => {
    const newStatus = customer.status === 'Suspended' ? 'Active' : 'Suspended';
    if (onUpdateCustomer) {
      onUpdateCustomer(customer.id, { status: newStatus });
    }
    setSaveSuccessMsg(`Tài khoản đã chuyển sang trạng thái: ${newStatus}`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Save Edit Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (onUpdateCustomer) {
      onUpdateCustomer(customer.id, {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        tier: editForm.tier
      });
    }
    setIsEditing(false);
    setSaveSuccessMsg('Cập nhật hồ sơ khách hàng thành công!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const isSuspended = customer.status === 'Suspended';

  return (
    <div className="order-detail-backdrop" onClick={onClose}>
      <div className="order-detail-drawer customer-detail-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header-strip">
          <div className="drawer-title-group">
            <div className="order-number-title">
              <User size={20} color="#3b82f6" />
              <span>Hồ Sơ Khách Hàng: <strong>{customer.name}</strong></span>
              <span className={`badge-active-tag ${isSuspended ? 'badge-suspended' : 'badge-healthy'}`} style={{ marginLeft: 8 }}>
                {customer.status || 'Active'}
              </span>
              <span className="customer-tier-badge" style={{ marginLeft: 6 }}>
                <Award size={12} style={{ display: 'inline', marginRight: 4 }} />
                {customer.tier || 'Gold VIP'}
              </span>
            </div>
            <div className="order-meta-sub">
              <span>Mã định danh: <code>{customer.id || 'CUST-001'}</code></span>
              <span>•</span>
              <span>Ngày gia nhập: {customer.registeredDate || '01/01/2026'}</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Privacy toggle */}
            <button
              type="button"
              className="btn-privacy-toggle"
              onClick={() => setMaskSensitive(!maskSensitive)}
              title={maskSensitive ? 'Nhấp để hiện thông tin cá nhân đầy đủ' : 'Nhấp để che thông tin bảo mật'}
            >
              {maskSensitive ? <Eye size={15} /> : <EyeOff size={15} />}
              <span>{maskSensitive ? 'Hiện thông tin đầy đủ' : 'Bật che thông tin (Privacy)'}</span>
            </button>
            <button type="button" className="btn-drawer-close" onClick={onClose} aria-label="Đóng">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {saveSuccessMsg && (
          <div className="customer-alert-banner success">
            <CheckCircle size={16} />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* Warning if Suspended */}
        {isSuspended && (
          <div className="customer-alert-banner warning">
            <AlertTriangle size={16} />
            <span>Tài khoản khách hàng này hiện đang bị <strong>TẠM KHÓA</strong>. Khách không thể đăng nhập hoặc đặt hàng.</span>
          </div>
        )}

        {/* 4 Stats Cards */}
        <div className="customer-stats-grid">
          <div className="c-stat-box">
            <div className="c-stat-label">Tổng Số Đơn Hàng</div>
            <div className="c-stat-value">{customer.ordersCount ?? orders.length} đơn</div>
            <div className="c-stat-sub">100% hoàn thành</div>
          </div>
          <div className="c-stat-box">
            <div className="c-stat-label">Tổng Chi Tiêu (CLV)</div>
            <div className="c-stat-value highlight">{currencyFormatter(customer.totalSpent || 127890000)}</div>
            <div className="c-stat-sub">Top 5% chi tiêu cao nhất</div>
          </div>
          <div className="c-stat-box">
            <div className="c-stat-label">Giá Trị Đơn Trung Bình (AOV)</div>
            <div className="c-stat-value">{currencyFormatter(customer.aov || 42630000)}</div>
            <div className="c-stat-sub">Phân khúc cao cấp</div>
          </div>
          <div className="c-stat-box">
            <div className="c-stat-label">Đơn Hàng Gần Nhất</div>
            <div className="c-stat-value" style={{ fontSize: 15, marginTop: 4 }}>
              {customer.lastOrderDate || '25/09/2026'}
            </div>
            <div className="c-stat-sub">Mã: #{customer.lastOrderId || 'PC-000845'}</div>
          </div>
        </div>

        {/* Customer Profile Card */}
        <div className="customer-profile-card">
          <div className="c-profile-avatar-col">
            <div className="c-avatar-large">
              {customer.avatar ? (
                <img src={customer.avatar} alt={customer.name} />
              ) : (
                customer.name ? customer.name.charAt(0).toUpperCase() : 'C'
              )}
            </div>
          </div>
          <div className="c-profile-info-col">
            <div className="c-info-grid">
              <div>
                <span className="c-info-lbl"><User size={13} /> Họ và Tên:</span>
                <strong className="c-info-val">{customer.name}</strong>
              </div>
              <div>
                <span className="c-info-lbl"><Mail size={13} /> Email liên hệ:</span>
                <span className="c-info-val">
                  {maskSensitive ? maskEmail(customer.email) : customer.email}
                </span>
              </div>
              <div>
                <span className="c-info-lbl"><Phone size={13} /> Số điện thoại:</span>
                <span className="c-info-val">
                  {maskSensitive ? maskPhone(customer.phone) : customer.phone || '0988 888 999'}
                </span>
              </div>
              <div>
                <span className="c-info-lbl"><MapPin size={13} /> Địa chỉ giao hàng:</span>
                <span className="c-info-val">{customer.address || 'Quận Cầu Giấy, Hà Nội'}</span>
              </div>
            </div>
          </div>
          <div className="c-profile-action-col">
            <button
              type="button"
              className="btn-tail-secondary"
              onClick={() => {
                setIsEditing(!isEditing);
                setActiveTab('actions');
              }}
            >
              <Edit3 size={14} /> Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="customer-tabs-bar">
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={15} /> Lịch Sử Đơn Hàng ({orders.length})
          </button>
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <Clock size={15} /> Dòng Hoạt Động (Activity Timeline)
          </button>
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
            onClick={() => setActiveTab('notes')}
          >
            <MessageSquare size={15} /> Ghi Chú Kỹ Thuật / CSKH ({internalNotes.length})
          </button>
          <button
            type="button"
            className={`c-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
            onClick={() => setActiveTab('actions')}
          >
            <KeyRound size={15} /> Quản Trị & Bảo Mật
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="customer-tab-content">
            <div className="tail-table-container">
              <table className="tail-data-table">
                <thead>
                  <tr>
                    <th>MÃ ĐƠN HÀNG</th>
                    <th>NGÀY ĐẶT</th>
                    <th>CHI TIẾT MÁY / LINH KIỆN</th>
                    <th>TỔNG TIỀN</th>
                    <th>THANH TOÁN</th>
                    <th>TRẠNG THÁI</th>
                    <th>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id}>
                      <td><strong style={{ color: '#2563eb' }}>#{ord.id}</strong></td>
                      <td style={{ fontSize: 12, color: '#64748b' }}>{ord.date}</td>
                      <td>
                        <div style={{ maxWidth: 260, fontSize: 13, fontWeight: 500, color: '#1e293b' }}>
                          {ord.itemsDesc}
                        </div>
                      </td>
                      <td><strong style={{ color: '#059669' }}>{currencyFormatter(ord.totalAmount)}</strong></td>
                      <td>
                        <span className={`badge-active-tag ${ord.paymentStatus === 'PAID' ? 'badge-healthy' : 'badge-low'}`}>
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className="badge-active-tag badge-healthy">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-tail-edit"
                          onClick={() => {
                            if (onViewOrder) onViewOrder(ord);
                          }}
                          title="Xem chi tiết đơn hàng này"
                        >
                          <ExternalLink size={13} /> Xem đơn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Activity Timeline */}
        {activeTab === 'activity' && (
          <div className="customer-tab-content">
            <div className="c-activity-timeline">
              {activities.map((act, idx) => (
                <div key={idx} className="c-timeline-item">
                  <div className={`c-timeline-marker marker-${act.type}`}>
                    {act.type === 'login' && <ShieldCheck size={14} />}
                    {act.type === 'order' && <ShoppingBag size={14} />}
                    {act.type === 'review' && <Award size={14} />}
                    {act.type === 'support' && <MessageSquare size={14} />}
                    {act.type === 'refund' && <AlertTriangle size={14} />}
                  </div>
                  <div className="c-timeline-body">
                    <div className="c-timeline-header">
                      <strong>{act.title}</strong>
                      <span className="c-timeline-time">{act.time}</span>
                    </div>
                    <p className="c-timeline-desc">{act.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Internal Staff Notes */}
        {activeTab === 'notes' && (
          <div className="customer-tab-content">
            {/* New note input box */}
            <form onSubmit={handleAddNote} className="c-note-composer">
              <div className="c-note-composer-header">
                <span><FileText size={14} /> Thêm Ghi Chú Khách Hàng (Chỉ Nhân Viên & KTV Thấy Được)</span>
              </div>
              <textarea
                rows={3}
                placeholder="Ví dụ: Khách hẹn cuối tháng nhận dàn PC RTX 5080, yêu cầu cài đặt sẵn Windows 11 Pro và driver CUDA..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
              />
              <div className="c-note-composer-footer">
                <span className="c-note-hint">Ghi chú nội bộ bảo mật, tuyệt đối không gửi tới khách hàng.</span>
                <button type="submit" className="btn-tail-primary" disabled={!newNoteText.trim()}>
                  <Send size={13} /> Lưu Ghi Chú
                </button>
              </div>
            </form>

            {/* Existing notes list */}
            <div className="c-notes-list">
              {internalNotes.map((nt) => (
                <div key={nt.id} className="c-note-card">
                  <div className="c-note-header">
                    <div>
                      <strong className="c-note-author">{nt.author}</strong>
                      <span className="c-note-role">({nt.role})</span>
                    </div>
                    <span className="c-note-date"><Clock size={12} /> {nt.date}</span>
                  </div>
                  <p className="c-note-text">{nt.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Admin Management & Security Actions */}
        {activeTab === 'actions' && (
          <div className="customer-tab-content">
            <div className="c-admin-actions-grid">
              {/* Box 1: Edit Profile */}
              <div className="c-action-card">
                <h4><Edit3 size={16} /> Cập Nhật Thông Tin Cá Nhân</h4>
                <form onSubmit={handleSaveProfile} className="tail-crud-form" style={{ marginTop: 12 }}>
                  <div className="form-input-box">
                    <label>Họ và Tên Khách Hàng</label>
                    <input
                      type="text"
                      required
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-grid-2">
                    <div className="form-input-box">
                      <label>Email</label>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Số Điện Thoại</label>
                      <input
                        type="text"
                        required
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-grid-2">
                    <div className="form-input-box">
                      <label>Địa Chỉ Giao Hàng</label>
                      <input
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Hạng Khách Hàng (Tier)</label>
                      <select
                        value={editForm.tier}
                        onChange={(e) => setEditForm({ ...editForm, tier: e.target.value })}
                      >
                        <option value="Diamond VIP">💎 Diamond VIP (&gt;100Tr)</option>
                        <option value="Gold VIP">🥇 Gold VIP (&gt;50Tr)</option>
                        <option value="Silver Member">🥈 Silver Member (&gt;15Tr)</option>
                        <option value="Standard Member">👤 Standard Member</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="btn-tail-primary" style={{ marginTop: 10 }}>
                    Lưu Thay Đổi Hồ Sơ
                  </button>
                </form>
              </div>

              {/* Box 2: Reset Password */}
              <div className="c-action-card">
                <h4><KeyRound size={16} /> Đặt Lại Mật Khẩu (Reset Password)</h4>
                <p className="c-action-desc">
                  Tạo mật khẩu tạm thời bảo mật một lần cho khách hàng. Hệ thống sẽ tự động yêu cầu khách đổi mật khẩu trong lần đăng nhập tiếp theo.
                </p>
                <div style={{ marginTop: 14 }}>
                  <button type="button" className="btn-tail-secondary" onClick={handleResetPassword}>
                    <RefreshCw size={14} /> Tạo Mật Khẩu Tạm Thời Mới
                  </button>
                </div>

                {tempPassword && (
                  <div className="temp-pwd-box">
                    <span className="temp-pwd-label">Mật khẩu tạm thời:</span>
                    <code className="temp-pwd-code">{tempPassword}</code>
                    <button
                      type="button"
                      className="btn-copy-pwd"
                      onClick={handleCopyPassword}
                      title="Sao chép mật khẩu"
                    >
                      {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      <span>{isCopied ? 'Đã sao chép' : 'Sao chép'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Box 3: Disable / Enable Account */}
              <div className="c-action-card danger-zone">
                <h4 style={{ color: isSuspended ? '#10b981' : '#ef4444' }}>
                  {isSuspended ? <CheckCircle size={16} /> : <Ban size={16} />}
                  {isSuspended ? 'Mở Khóa Tài Khoản Khách Hàng' : 'Tạm Khóa Tài Khoản (Disable Account)'}
                </h4>
                <p className="c-action-desc">
                  {isSuspended
                    ? 'Khách hàng hiện đang bị khóa. Bạn có thể mở khóa để cho phép khách hàng đăng nhập và đặt hàng lại.'
                    : 'Khi tạm khóa tài khoản, khách hàng sẽ bị đăng xuất khỏi tất cả phiên làm việc và không thể đặt thêm linh kiện mới.'}
                </p>
                <div style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    className={isSuspended ? 'btn-tail-primary' : 'btn-tail-delete'}
                    style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600 }}
                    onClick={handleToggleAccountStatus}
                  >
                    {isSuspended ? 'Kích Hoạt Mở Khóa Tài Khoản' : 'Xác Nhận Tạm Khóa Tài Khoản'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
