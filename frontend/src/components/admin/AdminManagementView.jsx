import React, { useState, useMemo } from 'react';
import {
  UserCheck, Shield, ShieldAlert, Key, Plus, Search,
  Lock, Unlock, RefreshCw, AlertTriangle, CheckCircle2,
  Trash2, Edit3, SlidersHorizontal, Eye, Copy, Check,
  X, FileText, Users, Download, Ban, Info, Hash,
  ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';

// 5 Default Roles Definition with scope descriptions
const DEFAULT_ROLES = [
  {
    key: 'super_admin',
    name: 'Super Admin',
    desc: 'Toàn quyền truy cập và kiểm soát cao nhất toàn bộ hệ thống',
    badgeClass: 'role-super-admin',
    modules: ['Products', 'Orders', 'Inventory', 'Customers', 'Promotions', 'Reports', 'Reviews', 'Warranty', 'Settings', 'Admin Management']
  },
  {
    key: 'store_manager',
    name: 'Store Manager',
    desc: 'Quản lý vận hành bán hàng: Đơn hàng, Sản phẩm, Tồn kho, Khách hàng, Khuyến mãi & Báo cáo',
    badgeClass: 'role-manager',
    modules: ['Orders', 'Products', 'Inventory', 'Customers', 'Promotions', 'Reports']
  },
  {
    key: 'order_staff',
    name: 'Order Staff',
    desc: 'Xử lý đơn hàng, điều phối giao vận, chăm sóc khách hàng và tiếp nhận đổi trả',
    badgeClass: 'role-order',
    modules: ['Orders', 'Customers', 'Warranty']
  },
  {
    key: 'inventory_staff',
    name: 'Inventory Staff',
    desc: 'Kiểm kê kho bãi, cập nhật danh mục linh kiện, nhập/xuất kho và luân chuyển hàng',
    badgeClass: 'role-inventory',
    modules: ['Products', 'Inventory']
  },
  {
    key: 'support_staff',
    name: 'Support Staff',
    desc: 'Hỗ trợ kỹ thuật phần cứng, tư vấn khách hàng, giải đáp đánh giá và bảo hành RMA',
    badgeClass: 'role-support',
    modules: ['Customers', 'Orders', 'Reviews', 'Warranty']
  }
];

// 10 Modules required for Permission Matrix
const SYSTEM_MODULES = [
  { id: 'products', name: 'Products', label: 'Sản Phẩm & Linh Kiện PC', desc: 'Quản lý CPU, VGA, Main, RAM, SSD, cấu hình PC' },
  { id: 'orders', name: 'Orders', label: 'Đơn Hàng & Vận Chuyển', desc: 'Xử lý đơn, duyệt thanh toán, in hóa đơn' },
  { id: 'inventory', name: 'Inventory', label: 'Kho Hàng & Thẻ Kho', desc: 'Tồn kho, cảnh báo sắp hết, kiểm kê điều chuyển' },
  { id: 'customers', name: 'Customers', label: 'Khách Hàng & Hội Viên', desc: 'Hồ sơ người dùng, hạng VIP, lịch sử mua hàng' },
  { id: 'promotions', name: 'Promotions', label: 'Khuyến Mãi & Voucher', desc: 'Mã giảm giá %, coupon, quà tặng combo PC' },
  { id: 'reports', name: 'Reports', label: 'Báo Cáo & Doanh Thu', desc: 'Thống kê tài chính, biên lợi nhuận, biểu đồ GMV' },
  { id: 'reviews', name: 'Reviews', label: 'Đánh Giá & Phản Hồi', desc: 'Kiểm duyệt cảm nhận khách hàng về dàn máy' },
  { id: 'warranty', name: 'Warranty', label: 'Bảo Hành & Đổi Trả (RMA)', desc: 'Tra cứu Serial Number, đo kiểm tra linh kiện' },
  { id: 'settings', name: 'Settings', label: 'Cài Đặt Hệ Thống', desc: 'Cổng thanh toán MoMo/VietQR, cấu hình email, SEO' },
  { id: 'admin_management', name: 'Admin Management', label: 'Quản Trị Nhân Sự & RBAC', desc: 'Phân quyền tài khoản nội bộ và bảo mật' }
];

// Base permission matrix template for 5 default roles
const INITIAL_ROLE_PERMISSIONS = {
  super_admin: {
    products: { view: true, create: true, edit: true, delete: true, export: true },
    orders: { view: true, create: true, edit: true, delete: true, export: true },
    inventory: { view: true, create: true, edit: true, delete: true, export: true },
    customers: { view: true, create: true, edit: true, delete: true, export: true },
    promotions: { view: true, create: true, edit: true, delete: true, export: true },
    reports: { view: true, create: true, edit: true, delete: true, export: true },
    reviews: { view: true, create: true, edit: true, delete: true, export: true },
    warranty: { view: true, create: true, edit: true, delete: true, export: true },
    settings: { view: true, create: true, edit: true, delete: true, export: true },
    admin_management: { view: true, create: true, edit: true, delete: true, export: true }
  },
  store_manager: {
    products: { view: true, create: true, edit: true, delete: false, export: true },
    orders: { view: true, create: true, edit: true, delete: false, export: true },
    inventory: { view: true, create: true, edit: true, delete: false, export: true },
    customers: { view: true, create: true, edit: true, delete: false, export: true },
    promotions: { view: true, create: true, edit: true, delete: false, export: true },
    reports: { view: true, create: false, edit: false, delete: false, export: true },
    reviews: { view: true, create: false, edit: true, delete: false, export: true },
    warranty: { view: true, create: true, edit: true, delete: false, export: true },
    settings: { view: false, create: false, edit: false, delete: false, export: false },
    admin_management: { view: false, create: false, edit: false, delete: false, export: false }
  },
  order_staff: {
    products: { view: true, create: false, edit: false, delete: false, export: false },
    orders: { view: true, create: true, edit: true, delete: false, export: true },
    inventory: { view: true, create: false, edit: false, delete: false, export: false },
    customers: { view: true, create: true, edit: true, delete: false, export: false },
    promotions: { view: true, create: false, edit: false, delete: false, export: false },
    reports: { view: false, create: false, edit: false, delete: false, export: false },
    reviews: { view: true, create: false, edit: false, delete: false, export: false },
    warranty: { view: true, create: true, edit: true, delete: false, export: false },
    settings: { view: false, create: false, edit: false, delete: false, export: false },
    admin_management: { view: false, create: false, edit: false, delete: false, export: false }
  },
  inventory_staff: {
    products: { view: true, create: true, edit: true, delete: false, export: true },
    orders: { view: true, create: false, edit: false, delete: false, export: false },
    inventory: { view: true, create: true, edit: true, delete: true, export: true },
    customers: { view: false, create: false, edit: false, delete: false, export: false },
    promotions: { view: false, create: false, edit: false, delete: false, export: false },
    reports: { view: true, create: false, edit: false, delete: false, export: true },
    reviews: { view: false, create: false, edit: false, delete: false, export: false },
    warranty: { view: true, create: false, edit: true, delete: false, export: false },
    settings: { view: false, create: false, edit: false, delete: false, export: false },
    admin_management: { view: false, create: false, edit: false, delete: false, export: false }
  },
  support_staff: {
    products: { view: true, create: false, edit: false, delete: false, export: false },
    orders: { view: true, create: false, edit: false, delete: false, export: false },
    inventory: { view: true, create: false, edit: false, delete: false, export: false },
    customers: { view: true, create: true, edit: true, delete: false, export: false },
    promotions: { view: true, create: false, edit: false, delete: false, export: false },
    reports: { view: false, create: false, edit: false, delete: false, export: false },
    reviews: { view: true, create: true, edit: true, delete: false, export: false },
    warranty: { view: true, create: true, edit: true, delete: false, export: true },
    settings: { view: false, create: false, edit: false, delete: false, export: false },
    admin_management: { view: false, create: false, edit: false, delete: false, export: false }
  }
};

const INITIAL_ADMINS = [
  {
    id: 'ADM-001',
    name: 'Ngô Anh Tú',
    email: 'anhtu@natcomputer.vn',
    role: 'Super Admin',
    roleKey: 'super_admin',
    department: 'Ban Giám Đốc',
    status: 'Active',
    lastLogin: '10 phút trước (IP: 113.190.24.88)',
    createdDate: '2025-01-10',
    isMaster: true
  },
  {
    id: 'ADM-002',
    name: 'Trần Văn Kho',
    email: 'kho.tran@natcomputer.vn',
    role: 'Inventory Staff',
    roleKey: 'inventory_staff',
    department: 'Bộ Phận Kho Vận & Phân Phối',
    status: 'Active',
    lastLogin: 'Hôm nay, 08:30 (IP: 113.190.24.90)',
    createdDate: '2025-04-12',
    isMaster: false
  },
  {
    id: 'ADM-003',
    name: 'Lê Hoàng Nam',
    email: 'nam.le@natcomputer.vn',
    role: 'Support Staff',
    roleKey: 'support_staff',
    department: 'Bộ Phận Kỹ Thuật Lab & RMA',
    status: 'Active',
    lastLogin: 'Hôm nay, 11:15 (IP: 14.161.35.12)',
    createdDate: '2025-06-20',
    isMaster: false
  },
  {
    id: 'ADM-004',
    name: 'Vũ Thị Sales',
    email: 'sales.vu@natcomputer.vn',
    role: 'Store Manager',
    roleKey: 'store_manager',
    department: 'Bộ Phận Bán Hàng & CSKH',
    status: 'Active',
    lastLogin: 'Hôm qua, 17:40 (IP: 118.70.180.55)',
    createdDate: '2025-09-01',
    isMaster: false
  },
  {
    id: 'ADM-005',
    name: 'Đặng Thanh Phong',
    email: 'phong.dt@natcomputer.vn',
    role: 'Order Staff',
    roleKey: 'order_staff',
    department: 'Bộ Phận Điều Phối Đơn Hàng',
    status: 'Active',
    lastLogin: '2 ngày trước (IP: 27.72.60.104)',
    createdDate: '2026-02-15',
    isMaster: false
  },
  {
    id: 'ADM-006',
    name: 'Nguyễn Văn Tạm Khóa',
    email: 'cu.nv@natcomputer.vn',
    role: 'Order Staff',
    roleKey: 'order_staff',
    department: 'Nhân Sự Cũ',
    status: 'Disabled',
    lastLogin: '30 ngày trước (IP: 14.161.12.99)',
    createdDate: '2025-03-01',
    isMaster: false
  }
];

export default function AdminManagementView() {
  const [activeTab, setActiveTab] = useState('admins'); // admins | matrix
  const [admins, setAdmins] = useState(INITIAL_ADMINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Matrix State
  const [selectedRoleKey, setSelectedRoleKey] = useState('super_admin');
  const [rolePermissions, setRolePermissions] = useState(INITIAL_ROLE_PERMISSIONS);

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [resetAccessAdmin, setResetAccessAdmin] = useState(null);
  const [tempPassword, setTempPassword] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ text: '', type: 'success' });

  // Add Form State
  const [newAdminForm, setNewAdminForm] = useState({
    name: '',
    email: '',
    roleKey: 'store_manager',
    department: 'Bộ Phận Bán Hàng & CSKH'
  });

  // Calculate 4 Security KPI Stats
  const kpiStats = useMemo(() => {
    const total = admins.length;
    const active = admins.filter(a => a.status === 'Active').length;
    const superCount = admins.filter(a => a.roleKey === 'super_admin').length;
    const rolesCount = DEFAULT_ROLES.length;

    return { total, active, superCount, rolesCount };
  }, [admins]);

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    return admins.filter(a => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (a.name || '').toLowerCase().includes(q);
        const matchesEmail = (a.email || '').toLowerCase().includes(q);
        const matchesRole = (a.role || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesRole) return false;
      }
      if (roleFilter !== 'ALL' && a.roleKey !== roleFilter) return false;
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      return true;
    });
  }, [admins, searchQuery, roleFilter, statusFilter]);

  // Show Alert Banner
  const showAlert = (text, type = 'success') => {
    setAlertMessage({ text, type });
    setTimeout(() => setAlertMessage({ text: '', type: 'success' }), 3500);
  };

  // Toggle Account Active / Disabled with Super Admin Guard
  const handleToggleStatus = (admin) => {
    if (admin.isMaster) {
      showAlert('Không thể khóa tài khoản Super Admin Master để tránh nguy cơ cô lập hệ thống!', 'error');
      return;
    }

    const newStatus = admin.status === 'Active' ? 'Disabled' : 'Active';
    setAdmins(prev => prev.map(a => a.id === admin.id ? { ...a, status: newStatus } : a));
    showAlert(`Đã ${newStatus === 'Active' ? 'mở khóa' : 'tạm ngưng'} tài khoản ${admin.name}!`);
  };

  // Create New Admin
  const handleCreateAdmin = (e) => {
    e.preventDefault();
    if (!newAdminForm.name.trim() || !newAdminForm.email.trim()) return;

    const matchedRole = DEFAULT_ROLES.find(r => r.key === newAdminForm.roleKey) || DEFAULT_ROLES[1];

    const newAdmin = {
      id: `ADM-00${Math.floor(7 + Math.random() * 90)}`,
      name: newAdminForm.name.trim(),
      email: newAdminForm.email.trim(),
      role: matchedRole.name,
      roleKey: matchedRole.key,
      department: newAdminForm.department.trim() || 'Vận Hành Store',
      status: 'Active',
      lastLogin: 'Chưa đăng nhập lần đầu',
      createdDate: new Date().toISOString().slice(0, 10),
      isMaster: false
    };

    setAdmins([newAdmin, ...admins]);
    setIsAddModalOpen(false);
    setNewAdminForm({
      name: '',
      email: '',
      roleKey: 'store_manager',
      department: 'Bộ Phận Bán Hàng & CSKH'
    });
    showAlert(`Đã thêm tài khoản quản trị mới cho ${newAdmin.name}!`);
  };

  // Update Role
  const handleSaveRole = (e) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (editingAdmin.isMaster && editingAdmin.roleKey !== 'super_admin') {
      showAlert('Tài khoản Super Admin Master không được phép hạ cấp vai trò!', 'error');
      return;
    }

    const matchedRole = DEFAULT_ROLES.find(r => r.key === editingAdmin.roleKey) || DEFAULT_ROLES[1];

    setAdmins(prev => prev.map(a => {
      if (a.id === editingAdmin.id) {
        return {
          ...a,
          role: matchedRole.name,
          roleKey: matchedRole.key,
          department: editingAdmin.department
        };
      }
      return a;
    }));

    setEditingAdmin(null);
    showAlert('Cập nhật phân quyền vai trò cho nhân sự thành công!');
  };

  // Reset Access (Generate new temp credentials)
  const handleTriggerResetAccess = (admin) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let pwd = 'NAT@Admin#';
    for (let i = 0; i < 5; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setTempPassword(pwd);
    setIsCopied(false);
    setResetAccessAdmin(admin);
  };

  const handleCopyPassword = () => {
    if (!tempPassword) return;
    navigator.clipboard?.writeText(tempPassword);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Toggle Granular Permission in Matrix
  const handleTogglePermission = (roleKey, moduleId, permKey) => {
    if (roleKey === 'super_admin') {
      showAlert('Vai trò Super Admin luôn giữ toàn quyền hệ thống để đảm bảo vận hành.', 'error');
      return;
    }

    setRolePermissions(prev => {
      const currentRolePerms = prev[roleKey] || {};
      const currentModulePerms = currentRolePerms[moduleId] || { view: false, create: false, edit: false, delete: false, export: false };

      return {
        ...prev,
        [roleKey]: {
          ...currentRolePerms,
          [moduleId]: {
            ...currentModulePerms,
            [permKey]: !currentModulePerms[permKey]
          }
        }
      };
    });
  };

  // Render role badge with distinct styles
  const renderRoleBadge = (roleName) => {
    switch (roleName) {
      case 'Super Admin':
        return <span className="tail-role-badge role-super-admin"><Shield size={12} /> Super Admin</span>;
      case 'Store Manager':
        return <span className="tail-role-badge role-manager"><ShieldCheck size={12} /> Store Manager</span>;
      case 'Order Staff':
        return <span className="tail-role-badge role-order"><FileText size={12} /> Order Staff</span>;
      case 'Inventory Staff':
        return <span className="tail-role-badge role-inventory"><SlidersHorizontal size={12} /> Inventory Staff</span>;
      case 'Support Staff':
        return <span className="tail-role-badge role-support"><Users size={12} /> Support Staff</span>;
      default:
        return <span className="tail-role-badge role-admin">{roleName}</span>;
    }
  };

  return (
    <div className="admin-rbac-view-wrapper">
      {/* Top Header */}
      <div className="panel-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Quản Trị Viên & Phân Quyền Vai Trò (Admin Management & RBAC)
            </h3>
            <span className="badge-active-tag badge-healthy" style={{ fontSize: 12 }}>
              {admins.length} Quản Trị Viên
            </span>
          </div>
          <p className="panel-sub" style={{ margin: '4px 0 0' }}>
            Hệ thống phân quyền truy cập theo vai trò (Role-Based Access Control) bảo mật cao cho nền tảng linh kiện máy tính
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            type="button"
            className={`btn-tail-secondary ${activeTab === 'matrix' ? 'btn-active-tab' : ''}`}
            onClick={() => setActiveTab('matrix')}
          >
            <SlidersHorizontal size={15} /> Ma Trận Phân Quyền (Permission Matrix)
          </button>
          <button
            type="button"
            className="btn-tail-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={15} /> + Thêm Quản Trị Viên (Add Admin)
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alertMessage.text && (
        <div className={`customer-alert-banner ${alertMessage.type === 'error' ? 'warning' : 'success'}`}>
          {alertMessage.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{alertMessage.text}</span>
        </div>
      )}

      {/* 4 Security KPI Stats Cards */}
      <div className="customer-kpi-grid">
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">TOTAL ADMINS</span>
            <div className="c-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpiStats.total}</div>
          <div className="c-kpi-foot positive">
            <span>Tài khoản nhân sự quản trị</span>
          </div>
        </div>

        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">ACTIVE SESSIONS</span>
            <div className="c-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpiStats.active}</div>
          <div className="c-kpi-foot positive">
            <span>Đang hoạt động bình thường</span>
          </div>
        </div>

        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">SUPER ADMINS</span>
            <div className="c-kpi-icon" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Shield size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpiStats.superCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Có cờ chống tự khóa</span>
          </div>
        </div>

        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">DEFAULT ROLES</span>
            <div className="c-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <SlidersHorizontal size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{kpiStats.rolesCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Vai trò chuyên môn hoá</span>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="customer-tabs-bar" style={{ margin: '10px 0 0' }}>
        <button
          type="button"
          className={`c-tab-btn ${activeTab === 'admins' ? 'active' : ''}`}
          onClick={() => setActiveTab('admins')}
        >
          <UserCheck size={15} /> Danh Sách Quản Trị Viên ({admins.length})
        </button>
        <button
          type="button"
          className={`c-tab-btn ${activeTab === 'matrix' ? 'active' : ''}`}
          onClick={() => setActiveTab('matrix')}
        >
          <SlidersHorizontal size={15} /> Ma Trận Phân Quyền (Permission Matrix)
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: ADMIN TABLE                                                  */}
      {/* =================================================================== */}
      {activeTab === 'admins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Filters Bar */}
          <div className="customer-filters-bar">
            <div className="c-search-box">
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder="Tìm quản trị viên theo tên, email nội bộ hoặc vai trò..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="c-filters-group">
              <div className="c-filter-item">
                <label>Vai Trò:</label>
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="store_manager">Store Manager</option>
                  <option value="order_staff">Order Staff</option>
                  <option value="inventory_staff">Inventory Staff</option>
                  <option value="support_staff">Support Staff</option>
                </select>
              </div>

              <div className="c-filter-item">
                <label>Trạng Thái:</label>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="ALL">Mọi trạng thái</option>
                  <option value="Active">Đang hoạt động (Active)</option>
                  <option value="Disabled">Đã tạm khóa (Disabled)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Admin Table */}
          <div className="tail-table-container">
            <table className="tail-data-table">
              <thead>
                <tr>
                  <th>QUẢN TRỊ VIÊN (ADMIN)</th>
                  <th>EMAIL NỘI BỘ</th>
                  <th>VAI TRÒ (ROLE)</th>
                  <th>TRẠNG THÁI</th>
                  <th>LẦN ĐĂNG NHẬP CUỐI</th>
                  <th>NGÀY TẠO</th>
                  <th style={{ textAlign: 'center' }}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredAdmins.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                      <UserCheck size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                      Không tìm thấy quản trị viên nào khớp với điều kiện tìm kiếm.
                    </td>
                  </tr>
                ) : (
                  filteredAdmins.map((admin) => {
                    const isDisabled = admin.status === 'Disabled';

                    return (
                      <tr key={admin.id} className={isDisabled ? 'row-disabled' : ''}>
                        {/* Admin Name & Avatar */}
                        <td>
                          <div className="c-cell-user">
                            <div className="c-avatar-mini" style={{ background: admin.isMaster ? 'linear-gradient(135deg, #7c3aed, #4f46e5)' : undefined }}>
                              {admin.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong className="c-user-name" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {admin.name}
                                {admin.isMaster && (
                                  <span className="master-admin-shield" title="Tài khoản Master không thể bị xóa">
                                    👑 Master
                                  </span>
                                )}
                              </strong>
                              <span style={{ fontSize: 11, color: '#64748b' }}>
                                ID: <code>{admin.id}</code> • {admin.department}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td>
                          <code style={{ fontSize: 12, color: '#334155' }}>{admin.email}</code>
                        </td>

                        {/* Role */}
                        <td>
                          {renderRoleBadge(admin.role)}
                        </td>

                        {/* Status */}
                        <td>
                          <span className={`badge-active-tag ${isDisabled ? 'badge-suspended' : 'badge-healthy'}`}>
                            {admin.status}
                          </span>
                        </td>

                        {/* Last Login */}
                        <td style={{ fontSize: 12, color: '#64748b' }}>
                          {admin.lastLogin}
                        </td>

                        {/* Created Date */}
                        <td style={{ fontSize: 12, color: '#64748b' }}>
                          {admin.createdDate}
                        </td>

                        {/* Actions */}
                        <td style={{ textAlign: 'center' }}>
                          <div style={{ display: 'inline-flex', gap: 6 }}>
                            {/* Edit Role */}
                            <button
                              type="button"
                              className="btn-tail-edit"
                              onClick={() => setEditingAdmin(admin)}
                              title="Chỉnh sửa vai trò & quyền hạn"
                            >
                              <Edit3 size={13} /> Sửa Role
                            </button>

                            {/* Reset Access */}
                            <button
                              type="button"
                              className="btn-tail-secondary"
                              style={{ padding: '5px 8px', fontSize: 11 }}
                              onClick={() => handleTriggerResetAccess(admin)}
                              title="Cấp lại mật khẩu bảo mật & thu hồi phiên đăng nhập"
                            >
                              <Key size={13} /> Đặt lại truy cập
                            </button>

                            {/* Disable / Enable Button */}
                            {!admin.isMaster ? (
                              <button
                                type="button"
                                className={isDisabled ? 'btn-tail-primary' : 'btn-tail-delete'}
                                style={{ padding: '5px 8px', fontSize: 11 }}
                                onClick={() => handleToggleStatus(admin)}
                                title={isDisabled ? 'Kích hoạt lại tài khoản' : 'Khóa tài khoản quản trị'}
                              >
                                {isDisabled ? <Unlock size={13} /> : <Ban size={13} />}
                              </button>
                            ) : (
                              <span style={{ fontSize: 11, color: '#94a3b8', fontStyle: 'italic', padding: '0 4px' }}>
                                (Được bảo vệ)
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: PERMISSION MATRIX                                            */}
      {/* =================================================================== */}
      {activeTab === 'matrix' && (
        <div className="permission-matrix-section">
          <div className="matrix-top-banner">
            <div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
                <SlidersHorizontal size={16} color="#4f46e5" />
                Ma Trận Phân Quyền Theo 5 Vai Trò Mặc Định
              </h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
                Cấu hình chi tiết quyền hạn Thao tác (View, Create, Edit, Delete, Export) trên từng phân hệ
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="matrix-role-pills">
              {DEFAULT_ROLES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  className={`matrix-role-btn ${selectedRoleKey === r.key ? 'active' : ''}`}
                  onClick={() => setSelectedRoleKey(r.key)}
                >
                  <Shield size={13} /> {r.name}
                </button>
              ))}
            </div>
          </div>

          {/* Current selected role card description */}
          <div className="matrix-role-info-strip">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {renderRoleBadge(DEFAULT_ROLES.find(r => r.key === selectedRoleKey)?.name)}
              <span style={{ fontSize: 13, color: '#334155' }}>
                {DEFAULT_ROLES.find(r => r.key === selectedRoleKey)?.desc}
              </span>
            </div>
            {selectedRoleKey === 'super_admin' ? (
              <span className="badge-active-tag badge-healthy">⚡ Toàn Quyền 100%</span>
            ) : (
              <span className="badge-active-tag" style={{ background: '#eff6ff', color: '#2563eb' }}>
                Tùy chỉnh quyền hạn được phép
              </span>
            )}
          </div>

          {/* The Structured Permission Matrix Table */}
          <div className="tail-table-container" style={{ marginTop: 12 }}>
            <table className="tail-data-table matrix-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>PHÂN HỆ (MODULE)</th>
                  <th style={{ textAlign: 'center', width: '14%' }}>VIEW (XEM)</th>
                  <th style={{ textAlign: 'center', width: '14%' }}>CREATE (THÊM)</th>
                  <th style={{ textAlign: 'center', width: '14%' }}>EDIT (SỬA)</th>
                  <th style={{ textAlign: 'center', width: '14%' }}>DELETE (XÓA)</th>
                  <th style={{ textAlign: 'center', width: '16%' }}>EXPORT (XUẤT FILE)</th>
                </tr>
              </thead>
              <tbody>
                {SYSTEM_MODULES.map((mod) => {
                  const rolePerm = (rolePermissions[selectedRoleKey] && rolePermissions[selectedRoleKey][mod.id]) || {
                    view: false, create: false, edit: false, delete: false, export: false
                  };

                  return (
                    <tr key={mod.id}>
                      {/* Module info */}
                      <td>
                        <strong style={{ fontSize: 13, color: '#0f172a', display: 'block' }}>
                          {mod.name}
                        </strong>
                        <span style={{ fontSize: 11, color: '#64748b' }}>
                          {mod.label} • {mod.desc}
                        </span>
                      </td>

                      {/* View */}
                      <td style={{ textAlign: 'center' }}>
                        <label className="perm-toggle-box">
                          <input
                            type="checkbox"
                            checked={rolePerm.view}
                            disabled={selectedRoleKey === 'super_admin'}
                            onChange={() => handleTogglePermission(selectedRoleKey, mod.id, 'view')}
                          />
                          <span className={`perm-indicator ${rolePerm.view ? 'perm-on' : 'perm-off'}`}>
                            {rolePerm.view ? 'CÓ' : '—'}
                          </span>
                        </label>
                      </td>

                      {/* Create */}
                      <td style={{ textAlign: 'center' }}>
                        <label className="perm-toggle-box">
                          <input
                            type="checkbox"
                            checked={rolePerm.create}
                            disabled={selectedRoleKey === 'super_admin'}
                            onChange={() => handleTogglePermission(selectedRoleKey, mod.id, 'create')}
                          />
                          <span className={`perm-indicator ${rolePerm.create ? 'perm-on' : 'perm-off'}`}>
                            {rolePerm.create ? 'CÓ' : '—'}
                          </span>
                        </label>
                      </td>

                      {/* Edit */}
                      <td style={{ textAlign: 'center' }}>
                        <label className="perm-toggle-box">
                          <input
                            type="checkbox"
                            checked={rolePerm.edit}
                            disabled={selectedRoleKey === 'super_admin'}
                            onChange={() => handleTogglePermission(selectedRoleKey, mod.id, 'edit')}
                          />
                          <span className={`perm-indicator ${rolePerm.edit ? 'perm-on' : 'perm-off'}`}>
                            {rolePerm.edit ? 'CÓ' : '—'}
                          </span>
                        </label>
                      </td>

                      {/* Delete (Dangerous - Red) */}
                      <td style={{ textAlign: 'center' }}>
                        <label className="perm-toggle-box">
                          <input
                            type="checkbox"
                            checked={rolePerm.delete}
                            disabled={selectedRoleKey === 'super_admin'}
                            onChange={() => handleTogglePermission(selectedRoleKey, mod.id, 'delete')}
                          />
                          <span className={`perm-indicator ${rolePerm.delete ? 'perm-danger' : 'perm-off'}`}>
                            {rolePerm.delete ? 'XÓA' : '—'}
                          </span>
                        </label>
                      </td>

                      {/* Export */}
                      <td style={{ textAlign: 'center' }}>
                        <label className="perm-toggle-box">
                          <input
                            type="checkbox"
                            checked={rolePerm.export}
                            disabled={selectedRoleKey === 'super_admin'}
                            onChange={() => handleTogglePermission(selectedRoleKey, mod.id, 'export')}
                          />
                          <span className={`perm-indicator ${rolePerm.export ? 'perm-on' : 'perm-off'}`}>
                            {rolePerm.export ? 'CÓ' : '—'}
                          </span>
                        </label>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 1: ADD ADMIN                                                  */}
      {/* =================================================================== */}
      {isAddModalOpen && (
        <div className="order-detail-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="tail-form-card" style={{ maxWidth: 520, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-header-row" style={{ marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  <UserCheck size={18} color="#4f46e5" /> Thêm Quản Trị Viên Nội Bộ (Add Admin)
                </h3>
                <p className="panel-sub" style={{ margin: '4px 0 0' }}>
                  Cấp quyền truy cập hệ thống theo một trong 5 vai trò phân định
                </p>
              </div>
              <button type="button" className="btn-drawer-close" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="tail-crud-form">
              <div className="form-input-box">
                <label>Họ và Tên Nhân Sự *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trần Văn Kho"
                  value={newAdminForm.name}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, name: e.target.value })}
                />
              </div>

              <div className="form-input-box">
                <label>Email Nội Bộ Doanh Nghiệp *</label>
                <input
                  type="email"
                  required
                  placeholder="kho.tran@natcomputer.vn"
                  value={newAdminForm.email}
                  onChange={(e) => setNewAdminForm({ ...newAdminForm, email: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Vai Trò Mặc Định (Role) *</label>
                  <select
                    value={newAdminForm.roleKey}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, roleKey: e.target.value })}
                  >
                    <option value="store_manager">Store Manager (Quản lý cửa hàng)</option>
                    <option value="order_staff">Order Staff (Xử lý đơn hàng)</option>
                    <option value="inventory_staff">Inventory Staff (Thủ kho phần cứng)</option>
                    <option value="support_staff">Support Staff (Kỹ thuật & CSKH)</option>
                    <option value="super_admin">Super Admin (Quản trị viên tối cao)</option>
                  </select>
                </div>

                <div className="form-input-box">
                  <label>Phòng Ban / Bộ Phận</label>
                  <input
                    type="text"
                    placeholder="VD: Bộ Phận Kho Vận"
                    value={newAdminForm.department}
                    onChange={(e) => setNewAdminForm({ ...newAdminForm, department: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn-tail-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-tail-primary">
                  <Check size={15} /> Tạo Tài Khoản Quản Trị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 2: EDIT ROLE                                                  */}
      {/* =================================================================== */}
      {editingAdmin && (
        <div className="order-detail-backdrop" onClick={() => setEditingAdmin(null)}>
          <div className="tail-form-card" style={{ maxWidth: 500, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-header-row" style={{ marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>
                  <Edit3 size={18} color="#4f46e5" /> Điều Chỉnh Vai Trò: {editingAdmin.name}
                </h3>
                <p className="panel-sub" style={{ margin: '4px 0 0' }}>
                  Email: <code>{editingAdmin.email}</code>
                </p>
              </div>
              <button type="button" className="btn-drawer-close" onClick={() => setEditingAdmin(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="tail-crud-form">
              <div className="form-input-box">
                <label>Vai Trò Phân Bổ (Role)</label>
                <select
                  value={editingAdmin.roleKey}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, roleKey: e.target.value })}
                >
                  <option value="super_admin">Super Admin (Toàn quyền hệ thống)</option>
                  <option value="store_manager">Store Manager (Quản lý cửa hàng)</option>
                  <option value="order_staff">Order Staff (Xử lý đơn hàng)</option>
                  <option value="inventory_staff">Inventory Staff (Thủ kho phần cứng)</option>
                  <option value="support_staff">Support Staff (Kỹ thuật & CSKH)</option>
                </select>
              </div>

              <div className="form-input-box">
                <label>Phòng Ban / Vị Trí Công Tác</label>
                <input
                  type="text"
                  value={editingAdmin.department}
                  onChange={(e) => setEditingAdmin({ ...editingAdmin, department: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn-tail-secondary"
                  onClick={() => setEditingAdmin(null)}
                >
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-tail-primary">
                  <Check size={15} /> Lưu Cập Nhật Vai Trò
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL 3: RESET ACCESS (SECURITY CREDENTIALS)                         */}
      {/* =================================================================== */}
      {resetAccessAdmin && (
        <div className="order-detail-backdrop" onClick={() => setResetAccessAdmin(null)}>
          <div className="tail-form-card" style={{ maxWidth: 480, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-header-row" style={{ marginBottom: 14 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#dc2626' }}>
                  <Key size={18} /> Đặt Lại Quyền Truy Cập (Reset Access)
                </h3>
                <p className="panel-sub" style={{ margin: '4px 0 0' }}>
                  Tài khoản: <strong>{resetAccessAdmin.name}</strong> ({resetAccessAdmin.email})
                </p>
              </div>
              <button type="button" className="btn-drawer-close" onClick={() => setResetAccessAdmin(null)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.5, margin: '0 0 14px' }}>
              Thao tác này sẽ tự động <strong>thu hồi toàn bộ phiên đăng nhập hiện tại</strong> trên mọi thiết bị và tạo mật khẩu tạm thời một lần mới.
            </p>

            <div className="temp-pwd-box" style={{ background: '#f8fafc', padding: 12, borderRadius: 8 }}>
              <span className="temp-pwd-label">Mật khẩu tạm thời:</span>
              <code className="temp-pwd-code" style={{ fontSize: 15 }}>{tempPassword}</code>
              <button
                type="button"
                className="btn-copy-pwd"
                onClick={handleCopyPassword}
              >
                {isCopied ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                <span>{isCopied ? 'Đã copy' : 'Sao chép'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 18 }}>
              <button
                type="button"
                className="btn-tail-primary"
                onClick={() => {
                  setResetAccessAdmin(null);
                  showAlert(`Đã cấp lại quyền truy cập cho ${resetAccessAdmin.name}!`);
                }}
              >
                Hoàn Tất & Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
