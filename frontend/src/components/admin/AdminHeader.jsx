import React from 'react';
import {
  Menu,
  Search,
  Sparkles,
  Sun,
  Moon,
  Bell,
  ShoppingBag,
  Plus,
  Calendar
} from 'lucide-react';

export default function AdminHeader({
  sidebarOpen,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
  isDarkMode,
  onToggleDarkMode,
  isNotificationsOpen,
  onToggleNotifications,
  orderAlerts = [],
  onNotificationClick,
  onMarkAllNotisRead,
  onSimulateOrder,
  onQuickAction,
  user,
  selectedDateRange = '30d',
  onSelectDateRange
}) {
  const unreadCount = orderAlerts.filter(a => !a.isRead).length;

  return (
    <header className="tailadmin-topbar">
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Thu gọn thanh bên' : 'Mở rộng thanh bên'}
        >
          <Menu size={18} />
        </button>

        {/* Global Search Bar */}
        <div className="topbar-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm, SKU, đơn hàng (#NAT), khách hàng..."
            value={searchQuery || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <kbd className="cmd-badge">⌘K</kbd>
        </div>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Date Range Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#f8fafc', padding: '4px 10px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }}>
          <Calendar size={14} color="#4f46e5" />
          <select
            value={selectedDateRange}
            onChange={(e) => onSelectDateRange && onSelectDateRange(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: 12, fontWeight: 500, color: '#334155', cursor: 'pointer' }}
          >
            <option value="today">Hôm nay</option>
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="this_month">Tháng này</option>
            <option value="year">Toàn bộ năm 2026</option>
          </select>
        </div>

        {/* Quick Action Button */}
        {onQuickAction && (
          <button
            type="button"
            className="btn-quick-action"
            onClick={onQuickAction}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#4f46e5',
              color: '#ffffff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(79, 70, 229, 0.2)'
            }}
          >
            <Plus size={14} /> Thêm Sản Phẩm
          </button>
        )}

        {/* Live Audio Order Alert Test */}
        {onSimulateOrder && (
          <button
            type="button"
            className="btn-simulate-order"
            onClick={onSimulateOrder}
            title="Nhấp để mô phỏng phát chuông đơn hàng mới"
          >
            <Sparkles size={14} /> Thử Chuông Realtime
          </button>
        )}

        {/* Dark/Light Mode Toggle */}
        <button
          type="button"
          className="topbar-icon-btn"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Chế độ Sáng' : 'Chế độ Tối'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Popover */}
        <div className="topbar-notification-wrapper" style={{ position: 'relative' }}>
          <button
            type="button"
            className="topbar-icon-btn noti-btn"
            onClick={onToggleNotifications}
            title="Thông báo hệ thống"
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="noti-dot" />}
          </button>

          {isNotificationsOpen && (
            <div className="noti-dropdown-panel" style={{ right: 0, width: 340 }}>
              <div className="noti-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>Thông Báo Realtime</strong>
                  {unreadCount > 0 && (
                    <span className="noti-badge" style={{ marginLeft: 6 }}>{unreadCount} mới</span>
                  )}
                </div>
                {unreadCount > 0 && onMarkAllNotisRead && (
                  <button
                    type="button"
                    className="btn-mark-all-read"
                    style={{ fontSize: 11, background: 'none', border: 'none', color: '#4f46e5', cursor: 'pointer', fontWeight: 600 }}
                    onClick={onMarkAllNotisRead}
                  >
                    Đã đọc tất cả
                  </button>
                )}
              </div>
              <div className="noti-list" style={{ maxHeight: 320, overflowY: 'auto' }}>
                {(!orderAlerts || orderAlerts.length === 0) ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                    Không có thông báo mới nào
                  </div>
                ) : (
                  orderAlerts.map(alt => (
                    <div
                      key={alt.id}
                      className={`noti-item ${!alt.isRead ? 'unread' : ''}`}
                      style={{ cursor: 'pointer', background: !alt.isRead ? '#f8faff' : 'transparent' }}
                      onClick={() => onNotificationClick && onNotificationClick(alt)}
                    >
                      <div className="noti-icon"><ShoppingBag size={14} /></div>
                      <div className="noti-info">
                        <strong style={{ color: !alt.isRead ? '#1e293b' : '#64748b' }}>{alt.title}</strong>
                        <p>{alt.desc || alt.message}</p>
                        <span className="noti-time">{alt.time || 'Vừa xong'}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Admin Profile Pill */}
        <div className="topbar-user-profile" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8, borderLeft: '1px solid #e2e8f0' }}>
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt="Admin"
            className="user-avatar-round"
            style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div className="user-profile-meta" style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
              {user?.name || 'Admin Master'}
            </span>
            <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>
              {user?.role === 'admin' ? '⚡ STORE MANAGER' : 'STAFF'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
