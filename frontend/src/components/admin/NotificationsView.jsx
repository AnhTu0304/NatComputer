import React, { useState, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingBag,
  CreditCard,
  Warehouse,
  ShieldAlert,
  Info,
  Clock,
  CheckCheck,
  Trash2,
  Search,
  SlidersHorizontal,
  Volume2,
  PlusCircle,
  ExternalLink,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function NotificationsView({
  notifications = [],
  onMarkRead,
  onMarkAllRead,
  onDeleteNotification,
  onNavigateTab,
  onSimulateOrder,
  onPlayChime
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'READ'
  const [alertBanner, setAlertBanner] = useState('');

  const showAlert = (msg) => {
    setAlertBanner(msg);
    setTimeout(() => setAlertBanner(''), 3000);
  };

  // KPI calculations
  const kpis = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.isRead && n.isNew !== false).length;
    const orderAlerts = notifications.filter(n => n.type === 'order' || (n.title && n.title.includes('Đơn'))).length;
    const techAlerts = notifications.filter(n => n.type === 'inventory' || n.type === 'warranty' || (n.title && (n.title.includes('Kho') || n.title.includes('Bảo hành')))).length;

    return { total, unread, orderAlerts, techAlerts };
  }, [notifications]);

  // Filtered Notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(item => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title && item.title.toLowerCase().includes(q);
        const matchDesc = item.desc && item.desc.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc) return false;
      }

      // Status
      const isUnread = !item.isRead && item.isNew !== false;
      if (statusFilter === 'UNREAD' && !isUnread) return false;
      if (statusFilter === 'READ' && isUnread) return false;

      // Type
      if (typeFilter !== 'ALL') {
        if (item.type && item.type !== typeFilter) return false;
        if (!item.type) {
          if (typeFilter === 'order' && !item.title.includes('Đơn')) return false;
          if (typeFilter === 'inventory' && !item.title.includes('Kho')) return false;
          if (typeFilter === 'warranty' && !item.title.includes('Bảo hành')) return false;
        }
      }

      return true;
    });
  }, [notifications, searchQuery, typeFilter, statusFilter]);

  // Helper for notification icons & colors
  const getNotificationIconMeta = (item) => {
    const title = (item.title || '').toLowerCase();
    const type = item.type;

    if (type === 'order' || title.includes('đơn đặt hàng') || title.includes('đơn hàng')) {
      return {
        icon: <ShoppingBag size={18} />,
        bg: '#eff6ff',
        color: '#2563eb',
        tag: 'ĐƠN HÀNG',
        targetTab: 'orders'
      };
    }
    if (type === 'payment' || title.includes('thanh toán') || title.includes('vietqr')) {
      return {
        icon: <CreditCard size={18} />,
        bg: '#ecfdf5',
        color: '#10b981',
        tag: 'THANH TOÁN',
        targetTab: 'payments'
      };
    }
    if (type === 'inventory' || title.includes('kho') || title.includes('sắp hết')) {
      return {
        icon: <Warehouse size={18} />,
        bg: '#fffbeb',
        color: '#d97706',
        tag: 'TỒN KHO',
        targetTab: 'inventory'
      };
    }
    if (type === 'warranty' || title.includes('bảo hành') || title.includes('rma')) {
      return {
        icon: <ShieldAlert size={18} />,
        bg: '#fdf2f8',
        color: '#db2777',
        tag: 'BẢO HÀNH RMA',
        targetTab: 'warranties'
      };
    }
    return {
      icon: <Info size={18} />,
      bg: '#f1f5f9',
      color: '#475569',
      tag: 'HỆ THỐNG',
      targetTab: 'dashboard'
    };
  };

  const handleTriggerSimulateOrder = () => {
    if (onSimulateOrder) {
      onSimulateOrder();
      showAlert('Đã tạo đơn hàng giả lập và phát tín hiệu chuông Realtime!');
    }
  };

  const handleMarkAll = () => {
    if (onMarkAllRead) {
      onMarkAllRead();
      showAlert('Đã đánh dấu tất cả thông báo là đã đọc!');
    }
  };

  return (
    <div className="notifications-view-wrapper">
      {/* Top Header */}
      <div className="panel-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Trung Tâm Thông Báo Realtime (Notification Hub)
            </h3>
            {kpis.unread > 0 && (
              <span className="badge-count-live" style={{ background: '#ef4444', fontSize: 12, padding: '3px 8px' }}>
                {kpis.unread} Mới
              </span>
            )}
          </div>
          <p className="panel-sub" style={{ margin: '4px 0 0' }}>
            Theo dõi tức thì đơn hàng mới, biến động thanh toán VietQR, cảnh báo hết linh kiện và phiếu bảo hành RMA
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-tail-secondary"
            onClick={() => onPlayChime && onPlayChime()}
            title="Thử tiếng chuông leng keng Web Audio"
          >
            <Volume2 size={15} color="#4f46e5" /> Thử Chuông Báo
          </button>

          <button
            type="button"
            className="btn-tail-secondary"
            onClick={handleMarkAll}
            title="Đánh dấu tất cả thông báo là đã đọc"
          >
            <CheckCheck size={15} /> Đánh Dấu Tất Cả Đã Đọc
          </button>

          <button
            type="button"
            className="btn-tail-primary"
            onClick={handleTriggerSimulateOrder}
            title="Bắn 1 đơn hàng test để kiểm tra hiệu ứng âm thanh và toast"
          >
            <Sparkles size={15} /> + Giả Lập Đơn Hàng Mới
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertBanner && (
        <div className="customer-alert-banner success">
          <CheckCircle2 size={16} />
          <span>{alertBanner}</span>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div className="customer-kpi-grid">
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">TỔNG SỐ THÔNG BÁO</span>
            <div className="c-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Bell size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpis.total}</div>
          <div className="c-kpi-foot neutral">
            <span>Toàn bộ nhật ký hệ thống</span>
          </div>
        </div>

        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">CHƯA ĐỌC (UNREAD)</span>
            <div className="c-kpi-icon" style={{ background: '#fef2f2', color: '#ef4444' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="c-kpi-num" style={{ color: kpis.unread > 0 ? '#ef4444' : '#10b981' }}>
            {kpis.unread}
          </div>
          <div className="c-kpi-foot negative">
            <span>Cần ban quản trị xử lý</span>
          </div>
        </div>

        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">ĐƠN HÀNG MỚI (ORDERS)</span>
            <div className="c-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpis.orderAlerts}</div>
          <div className="c-kpi-foot positive">
            <span>Đơn chờ đóng gói & xuất kho</span>
          </div>
        </div>

        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">CẢNH BÁO KHO & RMA</span>
            <div className="c-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpis.techAlerts}</div>
          <div className="c-kpi-foot neutral">
            <span>Linh kiện thấp & phiếu bảo hành</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="customer-filters-bar" style={{ marginTop: 14 }}>
        <div className="c-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tìm thông báo theo tiêu đề, mã đơn, khách hàng hoặc linh kiện..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="c-filters-group">
          <div className="c-filter-item">
            <label>Phân Loại:</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="ALL">Tất cả phân loại</option>
              <option value="order">Đơn hàng mới</option>
              <option value="payment">Thanh toán VietQR</option>
              <option value="inventory">Tồn kho linh kiện</option>
              <option value="warranty">Bảo hành RMA</option>
              <option value="system">Hệ thống</option>
            </select>
          </div>

          <div className="c-filter-item">
            <label>Trạng Thái:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="ALL">Tất cả trạng thái</option>
              <option value="UNREAD">Chỉ tin chưa đọc</option>
              <option value="READ">Tin đã đọc</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List Container */}
      <div className="tail-form-card" style={{ marginTop: 14, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
            Hiển thị {filteredNotifications.length} thông báo
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>
            Tự động làm mới bằng Web Audio & WebSocket
          </span>
        </div>

        <div className="notis-stream-list">
          {filteredNotifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
              <Bell size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.3 }} />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
                Không tìm thấy thông báo nào phù hợp với bộ lọc hiện tại.
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const meta = getNotificationIconMeta(item);
              const isUnread = !item.isRead && item.isNew !== false;

              return (
                <div
                  key={item.id}
                  className={`noti-stream-item ${isUnread ? 'item-unread' : 'item-read'}`}
                >
                  {/* Left Icon Badge */}
                  <div
                    className="noti-avatar-box"
                    style={{ background: meta.bg, color: meta.color }}
                  >
                    {meta.icon}
                  </div>

                  {/* Center Content */}
                  <div className="noti-body-col">
                    <div className="noti-title-row">
                      <span className="noti-tag" style={{ color: meta.color, background: meta.bg }}>
                        {meta.tag}
                      </span>
                      <strong className="noti-title-text">{item.title}</strong>
                      {isUnread && <span className="noti-unread-pulse" />}
                    </div>

                    <p className="noti-desc-text">{item.desc}</p>

                    <div className="noti-meta-foot">
                      <span className="noti-time-stamp">
                        <Clock size={12} /> {item.time || 'Vừa xong'}
                      </span>
                      {item.orderId && (
                        <span className="noti-order-code">
                          Mã đơn: #{item.orderId}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="noti-actions-col">
                    {onNavigateTab && (
                      <button
                        type="button"
                        className="btn-tail-secondary"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        onClick={() => {
                          if (onMarkRead && isUnread) onMarkRead(item.id);
                          onNavigateTab(meta.targetTab);
                        }}
                        title={`Xem chi tiết tại mục ${meta.tag}`}
                      >
                        <ExternalLink size={13} /> Xem Ngay
                      </button>
                    )}

                    {onMarkRead && (
                      <button
                        type="button"
                        className="btn-tail-action-icon"
                        onClick={() => onMarkRead(item.id)}
                        title={isUnread ? 'Đánh dấu đã đọc' : 'Đánh dấu chưa đọc'}
                      >
                        <CheckCircle2 size={16} color={isUnread ? '#3b82f6' : '#94a3b8'} />
                      </button>
                    )}

                    {onDeleteNotification && (
                      <button
                        type="button"
                        className="btn-tail-delete-icon"
                        onClick={() => onDeleteNotification(item.id)}
                        title="Xóa thông báo này"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
