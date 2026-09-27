import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Cpu,
  Package,
  Layers,
  Users,
  Star,
  Ticket,
  ShieldCheck,
  BarChart3,
  Bell,
  UserCheck,
  Settings,
  ExternalLink,
  LogOut,
  ChevronDown,
  ChevronRight,
  PlusCircle,
  FolderTree,
  Tag,
  Warehouse
} from 'lucide-react';

export default function AdminSidebar({
  activeMenu,
  onSelectMenu,
  sidebarOpen,
  onCloseMobileSidebar,
  counts = {},
  onNavigateHome,
  onLogout
}) {
  // Submenu toggle states
  const [productsOpen, setProductsOpen] = useState(true);
  const [inventoryOpen, setInventoryOpen] = useState(true);

  const isProductsActive = ['products', 'add-product', 'categories', 'brands', 'pc-builds'].includes(activeMenu);
  const isInventoryActive = ['inventory', 'low-stock', 'stock-adjustments'].includes(activeMenu);

  return (
    <aside className={`tailadmin-sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-logo-badge">
          <Cpu size={20} color="#ffffff" />
        </div>
        <div className="brand-text-col">
          <span className="brand-title">TailAdmin</span>
          <span style={{ fontSize: 10, color: '#64748b', display: 'block', fontWeight: 600, letterSpacing: '0.05em' }}>
            NAT PC HARDWARE SAAS
          </span>
        </div>
      </div>

      {/* Menu Navigation Scrollable */}
      <div className="sidebar-menu-scroll">
        {/* GROUP 1: CORE */}
        <div className="menu-group-label">HỆ THỐNG CỐT LÕI</div>
        <ul className="sidebar-nav-list">
          <li className={`nav-item ${activeMenu === 'dashboard' || activeMenu === 'ecommerce' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('dashboard'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'orders' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('orders'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <ShoppingBag size={18} />
              <span>Orders (Đơn Hàng)</span>
              {counts.orders > 0 && (
                <span className="badge-count-live" style={{ background: '#4f46e5' }}>
                  {counts.orders}
                </span>
              )}
            </button>
          </li>
        </ul>

        {/* GROUP 2: CATALOG & BUILDS */}
        <div className="menu-group-label" style={{ marginTop: 20 }}>SẢN PHẨM & KHO VẬN</div>
        <ul className="sidebar-nav-list">
          {/* Products Accordion */}
          <li className={`nav-item nav-item-has-submenu ${isProductsActive ? 'open' : ''}`}>
            <button
              type="button"
              className={`nav-btn ${isProductsActive ? 'active-parent' : ''}`}
              onClick={() => setProductsOpen(prev => !prev)}
            >
              <Package size={18} />
              <span style={{ flex: 1, textAlign: 'left' }}>Sản Phẩm (Products)</span>
              {productsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {productsOpen && (
              <ul className="sidebar-submenu-list" style={{ listStyle: 'none', paddingLeft: 28, margin: '4px 0' }}>
                <li className={`submenu-item ${activeMenu === 'products' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="submenu-btn"
                    onClick={() => { onSelectMenu('products'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
                  >
                    Tất cả sản phẩm ({counts.products || 0})
                  </button>
                </li>
                <li className={`submenu-item ${activeMenu === 'add-product' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="submenu-btn"
                    onClick={() => { onSelectMenu('add-product'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
                  >
                    <PlusCircle size={13} style={{ display: 'inline', marginRight: 4 }} /> Thêm sản phẩm mới
                  </button>
                </li>
                <li className={`submenu-item ${activeMenu === 'categories' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="submenu-btn"
                    onClick={() => { onSelectMenu('categories'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
                  >
                    <FolderTree size={13} style={{ display: 'inline', marginRight: 4 }} /> Danh mục ({counts.categories || 0})
                  </button>
                </li>
                <li className={`submenu-item ${activeMenu === 'pc-builds' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="submenu-btn"
                    onClick={() => { onSelectMenu('pc-builds'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
                  >
                    <Cpu size={13} style={{ display: 'inline', marginRight: 4 }} /> Cấu hình PC Builds
                  </button>
                </li>
              </ul>
            )}
          </li>

          {/* Inventory Accordion */}
          <li className={`nav-item nav-item-has-submenu ${isInventoryActive ? 'open' : ''}`}>
            <button
              type="button"
              className={`nav-btn ${isInventoryActive ? 'active-parent' : ''}`}
              onClick={() => setInventoryOpen(prev => !prev)}
            >
              <Warehouse size={18} />
              <span style={{ flex: 1, textAlign: 'left' }}>Quản Lý Kho (Inventory)</span>
              {counts.lowStock > 0 && (
                <span className="badge-count-live" style={{ background: '#f59e0b', marginRight: 6 }}>
                  {counts.lowStock}
                </span>
              )}
              {inventoryOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
            {inventoryOpen && (
              <ul className="sidebar-submenu-list" style={{ listStyle: 'none', paddingLeft: 28, margin: '4px 0' }}>
                <li className={`submenu-item ${activeMenu === 'inventory' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="submenu-btn"
                    onClick={() => { onSelectMenu('inventory'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
                  >
                    Tổng quan kho hàng
                  </button>
                </li>
                <li className={`submenu-item ${activeMenu === 'low-stock' ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="submenu-btn"
                    onClick={() => { onSelectMenu('low-stock'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
                  >
                    Cảnh báo sắp hết ({counts.lowStock || 5})
                  </button>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* GROUP 3: CUSTOMERS & MARKETING */}
        <div className="menu-group-label" style={{ marginTop: 20 }}>KHÁCH HÀNG & TIẾP THỊ</div>
        <ul className="sidebar-nav-list">
          <li className={`nav-item ${activeMenu === 'customers' || activeMenu === 'users' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('customers'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <Users size={18} />
              <span>Khách Hàng (Customers)</span>
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'reviews' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('reviews'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <Star size={18} />
              <span>Đánh Giá (Reviews)</span>
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'promotions' || activeMenu === 'coupons' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('promotions'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <Ticket size={18} />
              <span>Khuyến Mãi & Voucher</span>
              {counts.coupons > 0 && (
                <span className="badge-count-live" style={{ background: '#3b82f6' }}>
                  {counts.coupons}
                </span>
              )}
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'warranties' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('warranties'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <ShieldCheck size={18} />
              <span>Bảo Hành & Đổi Trả</span>
            </button>
          </li>
        </ul>

        {/* GROUP 4: INSIGHTS & SYSTEM */}
        <div className="menu-group-label" style={{ marginTop: 20 }}>BÁO CÁO & QUẢN TRỊ</div>
        <ul className="sidebar-nav-list">
          <li className={`nav-item ${activeMenu === 'reports' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('reports'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <BarChart3 size={18} />
              <span>Báo Cáo Doanh Thu</span>
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'notifications' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('notifications'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <Bell size={18} />
              <span>Thông Báo Realtime</span>
              {counts.unreadNotis > 0 && (
                <span className="badge-count-live" style={{ background: '#ef4444' }}>
                  {counts.unreadNotis}
                </span>
              )}
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'admin-management' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('admin-management'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <UserCheck size={18} />
              <span>Quản Trị Viên & Phân Quyền</span>
            </button>
          </li>

          <li className={`nav-item ${activeMenu === 'settings' ? 'active' : ''}`}>
            <button
              type="button"
              className="nav-btn"
              onClick={() => { onSelectMenu('settings'); if (onCloseMobileSidebar) onCloseMobileSidebar(); }}
            >
              <Settings size={18} />
              <span>Cài Đặt VietQR & Store</span>
            </button>
          </li>
        </ul>

        {/* GROUP 5: SUPPORT & STOREFRONT */}
        <div className="menu-group-label" style={{ marginTop: 24 }}>CỬA HÀNG & ĐĂNG XUẤT</div>
        <ul className="sidebar-nav-list">
          <li className="nav-item">
            <button
              type="button"
              className="nav-btn"
              onClick={() => onNavigateHome && onNavigateHome()}
            >
              <ExternalLink size={18} />
              <span>Xem Giao Diện Khách</span>
            </button>
          </li>
          <li className="nav-item">
            <button
              type="button"
              className="nav-btn text-danger"
              onClick={() => onLogout && onLogout()}
            >
              <LogOut size={18} />
              <span>Đăng Xuất</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
