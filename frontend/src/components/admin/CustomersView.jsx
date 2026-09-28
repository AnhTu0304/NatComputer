import React, { useState, useMemo } from 'react';
import {
  Users, UserPlus, Download, RefreshCw, Search, Filter,
  Eye, EyeOff, ShieldCheck, ShieldAlert, Award, ShoppingBag,
  TrendingUp, CreditCard, ChevronLeft, ChevronRight, MoreVertical,
  CheckCircle, Ban, Edit, ExternalLink, MessageSquare, AlertCircle,
  X, Check
} from 'lucide-react';
import CustomerDetailDrawer from './CustomerDetailDrawer';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

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

// Initial Realistic PC Hardware Customers Dataset
const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-00821',
    name: 'Nguyễn Tuấn Dũng',
    email: 'tuandung.architect@gmail.com',
    phone: '0988 123 456',
    address: 'KĐT Ciputra, Tây Hồ, Hà Nội',
    registeredDate: '2026-01-15',
    ordersCount: 8,
    totalSpent: 184500000,
    aov: 23062500,
    lastOrderDate: '2026-09-25',
    lastOrderId: 'PC-000845',
    status: 'Active',
    tier: 'Diamond VIP',
    notes: [
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
    ],
    orderHistory: [
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
      }
    ]
  },
  {
    id: 'CUST-00754',
    name: 'Trần Minh Quang',
    email: 'quangtm.streamer@outlook.com',
    phone: '0977 456 789',
    address: 'Vinhomes Central Park, Bình Thạnh, TP.HCM',
    registeredDate: '2026-03-20',
    ordersCount: 5,
    totalSpent: 86200000,
    aov: 17240000,
    lastOrderDate: '2026-09-22',
    lastOrderId: 'PC-000810',
    status: 'Active',
    tier: 'Gold VIP',
    notes: [
      {
        id: 'nt-3',
        author: 'CSKH Thảo Ly',
        role: 'Tư Vấn Bán Hàng',
        date: '2026-09-21 16:00',
        text: 'Streamer game Đột Kích & Valorant. Yêu cầu setup tản nước custom ống cứng màu tím neon.'
      }
    ],
    orderHistory: [
      {
        id: 'PC-000810',
        date: '2026-09-22 10:30',
        itemsCount: 3,
        itemsDesc: 'Card màn hình Gigabyte GeForce RTX 4080 SUPER 16GB Gaming OC',
        totalAmount: 32500000,
        paymentStatus: 'PAID',
        orderStatus: 'SHIPPING'
      }
    ]
  },
  {
    id: 'CUST-00690',
    name: 'Lê Hoàng Yến',
    email: 'hoangyen.studio@yahoo.com',
    phone: '0912 334 556',
    address: 'Đường Nguyễn Văn Cừ, Quận 5, TP.HCM',
    registeredDate: '2026-08-28',
    ordersCount: 2,
    totalSpent: 41800000,
    aov: 20900000,
    lastOrderDate: '2026-09-18',
    lastOrderId: 'PC-000788',
    status: 'Active',
    tier: 'Silver Member',
    notes: [],
    orderHistory: [
      {
        id: 'PC-000788',
        date: '2026-09-18 14:00',
        itemsCount: 1,
        itemsDesc: 'CPU AMD Ryzen 9 7950X3D + Mainboard ASUS ROG Crosshair X670E Hero',
        totalAmount: 26800000,
        paymentStatus: 'PAID',
        orderStatus: 'DELIVERED'
      }
    ]
  },
  {
    id: 'CUST-00512',
    name: 'Phạm Đức Long',
    email: 'long.pham@cybergamevn.com',
    phone: '0903 889 900',
    address: 'Quận Cầu Giấy, Hà Nội',
    registeredDate: '2025-11-10',
    ordersCount: 12,
    totalSpent: 420000000,
    aov: 35000000,
    lastOrderDate: '2026-09-10',
    lastOrderId: 'PC-000755',
    status: 'Active',
    tier: 'Diamond VIP',
    notes: [
      {
        id: 'nt-4',
        author: 'Admin Master',
        role: 'Quản Trị Viên',
        date: '2026-09-08 11:00',
        text: 'Chủ chuỗi phòng máy Cyber Game Long Gaming. Chiết khấu linh kiện số lượng lớn 8%.'
      }
    ],
    orderHistory: [
      {
        id: 'PC-000755',
        date: '2026-09-10 09:20',
        itemsCount: 10,
        itemsDesc: 'Lô 10 VGA MSI GeForce RTX 4060 Ti 8GB Ventus 2X Black OC',
        totalAmount: 115000000,
        paymentStatus: 'PAID',
        orderStatus: 'DELIVERED'
      }
    ]
  },
  {
    id: 'CUST-00430',
    name: 'Vũ Quốc Khánh',
    email: 'khanh.vq.design@techcorp.vn',
    phone: '0934 567 890',
    address: 'Phường Đa Kao, Quận 1, TP.HCM',
    registeredDate: '2026-09-01',
    ordersCount: 1,
    totalSpent: 28900000,
    aov: 28900000,
    lastOrderDate: '2026-09-05',
    lastOrderId: 'PC-000712',
    status: 'Active',
    tier: 'Silver Member',
    notes: [],
    orderHistory: [
      {
        id: 'PC-000712',
        date: '2026-09-05 16:30',
        itemsCount: 2,
        itemsDesc: 'Màn hình Dell UltraSharp U2724D + Bàn phím Filco Majestouch 2',
        totalAmount: 28900000,
        paymentStatus: 'PAID',
        orderStatus: 'DELIVERED'
      }
    ]
  },
  {
    id: 'CUST-00388',
    name: 'Đặng Mai Phương',
    email: 'phuong.dang@freelance.io',
    phone: '0966 778 899',
    address: 'Quận Đống Đa, Hà Nội',
    registeredDate: '2026-04-12',
    ordersCount: 0,
    totalSpent: 0,
    aov: 0,
    lastOrderDate: '—',
    lastOrderId: null,
    status: 'Inactive',
    tier: 'Standard Member',
    notes: [
      {
        id: 'nt-5',
        author: 'CSKH Thảo Ly',
        role: 'Tư Vấn Bán Hàng',
        date: '2026-04-15 10:20',
        text: 'Khách tạo tài khoản nhận voucher 500K nhưng chưa chốt đơn dàn máy ITX.'
      }
    ],
    orderHistory: []
  },
  {
    id: 'CUST-00219',
    name: 'Hoàng Bá Huy',
    email: 'huyhb.mining@crypto.vn',
    phone: '0945 667 889',
    address: 'Quận Hải Châu, Đà Nẵng',
    registeredDate: '2025-08-19',
    ordersCount: 4,
    totalSpent: 110000000,
    aov: 27500000,
    lastOrderDate: '2026-05-14',
    lastOrderId: 'PC-000420',
    status: 'Suspended',
    tier: 'Gold VIP',
    notes: [
      {
        id: 'nt-6',
        author: 'Admin Master',
        role: 'Quản Trị Viên',
        date: '2026-06-01 14:10',
        text: 'Tài khoản có dấu hiệu gian lận voucher khuyến mãi qua nhiều thẻ tín dụng ảo. Tạm khóa bảo vệ hệ thống.'
      }
    ],
    orderHistory: [
      {
        id: 'PC-000420',
        date: '2026-05-14 11:00',
        itemsCount: 2,
        itemsDesc: '2x Nguồn Antec Signature 1000W Titanium High End',
        totalAmount: 18500000,
        paymentStatus: 'REFUNDED',
        orderStatus: 'CANCELLED'
      }
    ]
  }
];

export default function CustomersView({
  currencyFormatter = fmt,
  onViewOrder
}) {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // ALL | Active | Inactive | Suspended
  const [ordersFilter, setOrdersFilter] = useState('ALL'); // ALL | 0 | 1-3 | 4+
  const [spendingFilter, setSpendingFilter] = useState('ALL'); // ALL | low (<10M) | mid (10M-50M) | high (>50M)
  const [regDateFilter, setRegDateFilter] = useState('ALL'); // ALL | month | 90days | year
  const [globalPrivacyMask, setGlobalPrivacyMask] = useState(true);

  // Selection & Detail Drawer State
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedRows, setSelectedRows] = useState(new Set());

  // Add Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustForm, setNewCustForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    tier: 'Standard Member'
  });

  // Calculate Overview Metrics dynamically
  const metrics = useMemo(() => {
    const total = customers.length;
    const newCount = customers.filter(c => {
      if (!c.registeredDate) return false;
      const regDate = new Date(c.registeredDate);
      const daysDiff = (new Date() - regDate) / (1000 * 60 * 60 * 24);
      return daysDiff <= 60; // 60 days
    }).length;

    const returningCount = customers.filter(c => c.ordersCount > 1).length;
    const activeCount = customers.filter(c => c.status === 'Active').length;
    const totalRevenue = customers.reduce((sum, c) => sum + (c.totalSpent || 0), 0);
    const avgCLV = total > 0 ? Math.round(totalRevenue / total) : 0;

    return {
      total,
      newCount,
      returningCount,
      returningRate: total > 0 ? Math.round((returningCount / total) * 100) : 0,
      activeCount,
      activeRate: total > 0 ? Math.round((activeCount / total) * 100) : 0,
      avgCLV,
      totalRevenue
    };
  }, [customers]);

  // Filtered Customers
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (c.name || '').toLowerCase().includes(q);
        const matchesEmail = (c.email || '').toLowerCase().includes(q);
        const matchesPhone = (c.phone || '').replace(/\s+/g, '').includes(q.replace(/\s+/g, ''));
        const matchesId = (c.id || '').toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesPhone && !matchesId) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

      // Order Count
      if (ordersFilter === '0' && c.ordersCount > 0) return false;
      if (ordersFilter === '1-3' && (c.ordersCount < 1 || c.ordersCount > 3)) return false;
      if (ordersFilter === '4+' && c.ordersCount < 4) return false;

      // Total Spending
      if (spendingFilter === 'low' && c.totalSpent >= 10000000) return false;
      if (spendingFilter === 'mid' && (c.totalSpent < 10000000 || c.totalSpent > 50000000)) return false;
      if (spendingFilter === 'high' && c.totalSpent <= 50000000) return false;

      return true;
    });
  }, [customers, searchQuery, statusFilter, ordersFilter, spendingFilter]);

  // Select all or individual row
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(new Set(filteredCustomers.map(c => c.id)));
    } else {
      setSelectedRows(new Set());
    }
  };

  const handleToggleSelectRow = (id) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Open Drawer
  const handleOpenDetail = (customer) => {
    setSelectedCustomer(customer);
    setSelectedCustomerId(customer.id);
  };

  // Update Customer from Drawer or Table
  const handleUpdateCustomer = (id, updates) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (selectedCustomer && selectedCustomer.id === id) {
          setSelectedCustomer(updated);
        }
        return updated;
      }
      return c;
    }));
  };

  // Quick Toggle Status
  const handleQuickToggleStatus = (c, e) => {
    e.stopPropagation();
    const newStatus = c.status === 'Suspended' ? 'Active' : 'Suspended';
    handleUpdateCustomer(c.id, { status: newStatus });
  };

  // Add Customer Submit
  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCustForm.name.trim() || !newCustForm.email.trim()) return;

    const newCust = {
      id: `CUST-00${Math.floor(100 + Math.random() * 900)}`,
      name: newCustForm.name.trim(),
      email: newCustForm.email.trim(),
      phone: newCustForm.phone.trim() || '0988 000 111',
      address: newCustForm.address.trim() || 'Hà Nội, Việt Nam',
      registeredDate: new Date().toISOString().slice(0, 10),
      ordersCount: 0,
      totalSpent: 0,
      aov: 0,
      lastOrderDate: '—',
      lastOrderId: null,
      status: 'Active',
      tier: newCustForm.tier,
      notes: [],
      orderHistory: []
    };

    setCustomers([newCust, ...customers]);
    setIsAddModalOpen(false);
    setNewCustForm({
      name: '',
      email: '',
      phone: '',
      address: '',
      tier: 'Standard Member'
    });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã KH', 'Họ Tên', 'Email', 'Điện Thoại', 'Hạng', 'Số Đơn', 'Tổng Chi Tiêu', 'Giá Trị TB (AOV)', 'Đơn Cuối', 'Trạng Thái'];
    const rows = filteredCustomers.map(c => [
      c.id,
      `"${c.name}"`,
      c.email,
      c.phone,
      c.tier,
      c.ordersCount,
      c.totalSpent,
      c.aov,
      c.lastOrderDate,
      c.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="customers-view-wrapper">
      {/* Page Header */}
      <div className="panel-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Khách Hàng (Customer Management)
            </h3>
            <span className="badge-active-tag badge-healthy" style={{ fontSize: 12 }}>
              {customers.length} Tài Khoản
            </span>
          </div>
          <p className="panel-sub" style={{ margin: '4px 0 0' }}>
            Hồ sơ khách hàng, phân hạng VIP, lịch sử mua PC và quản lý quyền truy cập bảo mật
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {/* Privacy Toggle */}
          <button
            type="button"
            className="btn-tail-secondary"
            onClick={() => setGlobalPrivacyMask(!globalPrivacyMask)}
            title="Ẩn hoặc hiện thông tin nhạy cảm (SĐT, Email) theo chuẩn Privacy"
          >
            {globalPrivacyMask ? <Eye size={15} /> : <EyeOff size={15} />}
            <span>{globalPrivacyMask ? 'Hiện SĐT/Email' : 'Che Bảo Mật (Privacy)'}</span>
          </button>

          {/* Export CSV */}
          <button type="button" className="btn-tail-secondary" onClick={handleExportCSV}>
            <Download size={15} /> Xuất CSV
          </button>

          {/* Add Customer Button */}
          <button
            type="button"
            className="btn-tail-primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            <UserPlus size={15} /> + Thêm Khách Hàng
          </button>
        </div>
      </div>

      {/* 5 KPI Overview Cards */}
      <div className="customer-kpi-grid">
        {/* Card 1: Total Customers */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">TOTAL CUSTOMERS</span>
            <div className="c-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Users size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{metrics.total}</div>
          <div className="c-kpi-foot positive">
            <TrendingUp size={13} />
            <span>+14.2% so với tháng trước</span>
          </div>
        </div>

        {/* Card 2: New Customers */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">NEW CUSTOMERS (30D)</span>
            <div className="c-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <UserPlus size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{metrics.newCount}</div>
          <div className="c-kpi-foot positive">
            <TrendingUp size={13} />
            <span>+8 tài khoản mới tuần này</span>
          </div>
        </div>

        {/* Card 3: Returning Customers */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">RETURNING CUSTOMERS</span>
            <div className="c-kpi-icon" style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{metrics.returningCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Tỷ lệ quay lại: <strong>{metrics.returningRate}%</strong></span>
          </div>
        </div>

        {/* Card 4: Active Customers */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">ACTIVE CUSTOMERS</span>
            <div className="c-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <ShieldCheck size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{metrics.activeCount}</div>
          <div className="c-kpi-foot positive">
            <span>{metrics.activeRate}% tài khoản đang hoạt động tốt</span>
          </div>
        </div>

        {/* Card 5: Customer Lifetime Value */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">CUSTOMER LIFETIME VALUE (CLV)</span>
            <div className="c-kpi-icon" style={{ background: '#ecfeff', color: '#06b6d4' }}>
              <CreditCard size={18} />
            </div>
          </div>
          <div className="c-kpi-num" style={{ fontSize: 20 }}>
            {currencyFormatter(metrics.avgCLV)}
          </div>
          <div className="c-kpi-foot positive">
            <span>Tổng GMV: {currencyFormatter(metrics.totalRevenue)}</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="customer-filters-bar">
        {/* Search */}
        <div className="c-search-box">
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Tìm theo tên khách, email, SĐT, hoặc mã CUST..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="c-search-clear"
              onClick={() => setSearchQuery('')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Controls */}
        <div className="c-filters-group">
          {/* Status */}
          <div className="c-filter-item">
            <label>Trạng Thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Tất cả ({customers.length})</option>
              <option value="Active">Đang hoạt động (Active)</option>
              <option value="Inactive">Chưa mua (Inactive)</option>
              <option value="Suspended">Đang khóa (Suspended)</option>
            </select>
          </div>

          {/* Orders count */}
          <div className="c-filter-item">
            <label>Số Đơn Hàng:</label>
            <select
              value={ordersFilter}
              onChange={(e) => setOrdersFilter(e.target.value)}
            >
              <option value="ALL">Tất cả đơn</option>
              <option value="0">Chưa có đơn (0)</option>
              <option value="1-3">Từ 1 - 3 đơn</option>
              <option value="4+">Khách quen (≥ 4 đơn)</option>
            </select>
          </div>

          {/* Spending */}
          <div className="c-filter-item">
            <label>Tổng Chi Tiêu:</label>
            <select
              value={spendingFilter}
              onChange={(e) => setSpendingFilter(e.target.value)}
            >
              <option value="ALL">Mọi mức chi</option>
              <option value="low">&lt; 10 Triệu</option>
              <option value="mid">10 Tr - 50 Triệu</option>
              <option value="high">&gt; 50 Triệu (VIP)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Action Bar (when rows are selected) */}
      {selectedRows.size > 0 && (
        <div className="c-bulk-bar">
          <span>Đã chọn <strong>{selectedRows.size}</strong> khách hàng</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="btn-tail-secondary"
              onClick={() => {
                alert(`Gửi thông báo mã ưu đãi VIP cho ${selectedRows.size} khách hàng đã chọn!`);
              }}
            >
              Gửi Voucher Ưu Đãi
            </button>
            <button
              type="button"
              className="btn-tail-secondary"
              onClick={() => setSelectedRows(new Set())}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* Customer Data Table */}
      <div className="tail-table-container">
        <table className="tail-data-table">
          <thead>
            <tr>
              <th style={{ width: 36, textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={filteredCustomers.length > 0 && selectedRows.size === filteredCustomers.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>KHÁCH HÀNG</th>
              <th>EMAIL</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th style={{ textAlign: 'center' }}>SỐ ĐƠN</th>
              <th>TỔNG CHI TIÊU</th>
              <th>AOV (TRUNG BÌNH)</th>
              <th>ĐƠN GẦN NHẤT</th>
              <th>TRẠNG THÁI</th>
              <th style={{ textAlign: 'center' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  <Users size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  Không tìm thấy khách hàng nào khớp với điều kiện tìm kiếm.
                </td>
              </tr>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = selectedRows.has(cust.id);
                const isSuspended = cust.status === 'Suspended';

                return (
                  <tr
                    key={cust.id}
                    className={isSelected ? 'row-selected' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleOpenDetail(cust)}
                  >
                    {/* Checkbox */}
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectRow(cust.id)}
                      />
                    </td>

                    {/* Customer Info (Avatar + Name + Tier) */}
                    <td>
                      <div className="c-cell-user">
                        <div className="c-avatar-mini">
                          {cust.name ? cust.name.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <strong className="c-user-name">{cust.name}</strong>
                          <div className="c-user-sub">
                            <code>{cust.id}</code>
                            <span className="c-tier-pill">{cust.tier}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <span className="c-privacy-text" title={cust.email}>
                        {globalPrivacyMask ? maskEmail(cust.email) : cust.email}
                      </span>
                    </td>

                    {/* Phone */}
                    <td>
                      <span className="c-privacy-text">
                        {globalPrivacyMask ? maskPhone(cust.phone) : cust.phone}
                      </span>
                    </td>

                    {/* Orders Count */}
                    <td style={{ textAlign: 'center' }}>
                      <span className="badge-count-pill">
                        {cust.ordersCount} đơn
                      </span>
                    </td>

                    {/* Total Spent */}
                    <td>
                      <strong style={{ color: '#059669', fontSize: 14 }}>
                        {currencyFormatter(cust.totalSpent)}
                      </strong>
                    </td>

                    {/* AOV */}
                    <td style={{ fontSize: 13, color: '#475569' }}>
                      {currencyFormatter(cust.aov)}
                    </td>

                    {/* Last Order */}
                    <td>
                      {cust.lastOrderId ? (
                        <div>
                          <strong style={{ color: '#2563eb', fontSize: 13 }}>#{cust.lastOrderId}</strong>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{cust.lastOrderDate}</div>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1', fontSize: 12 }}>Chưa có đơn</span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td>
                      <span className={`badge-active-tag ${
                        isSuspended ? 'badge-suspended' : (cust.status === 'Active' ? 'badge-healthy' : 'badge-low')
                      }`}>
                        {cust.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className="btn-tail-edit"
                          onClick={() => handleOpenDetail(cust)}
                          title="Xem chi tiết & lịch sử"
                        >
                          <ExternalLink size={13} /> Chi tiết
                        </button>
                        <button
                          type="button"
                          className={isSuspended ? 'btn-tail-edit' : 'btn-tail-delete'}
                          onClick={(e) => handleQuickToggleStatus(cust, e)}
                          title={isSuspended ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
                        >
                          {isSuspended ? <CheckCircle size={13} /> : <Ban size={13} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="tail-pagination-bar" style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: '#64748b' }}>
          Hiển thị <strong>{filteredCustomers.length}</strong> trên tổng số <strong>{customers.length}</strong> khách hàng
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" className="btn-tail-secondary" disabled style={{ padding: '6px 12px' }}>
            <ChevronLeft size={14} /> Trang trước
          </button>
          <button type="button" className="btn-tail-primary" style={{ padding: '6px 14px', minWidth: 36 }}>
            1
          </button>
          <button type="button" className="btn-tail-secondary" disabled style={{ padding: '6px 12px' }}>
            Trang sau <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="order-detail-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="tail-form-card" style={{ maxWidth: 520, margin: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div className="panel-header-row" style={{ marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}><UserPlus size={18} /> Thêm Khách Hàng Mới</h3>
                <p className="panel-sub" style={{ margin: '4px 0 0' }}>Tạo tài khoản và hồ sơ mua PC phần cứng mới</p>
              </div>
              <button type="button" className="btn-drawer-close" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="tail-crud-form">
              <div className="form-input-box">
                <label>Họ và Tên Khách Hàng *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Nguyễn Văn Nam"
                  value={newCustForm.name}
                  onChange={(e) => setNewCustForm({ ...newCustForm, name: e.target.value })}
                />
              </div>

              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Địa Chỉ Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="namnv@gmail.com"
                    value={newCustForm.email}
                    onChange={(e) => setNewCustForm({ ...newCustForm, email: e.target.value })}
                  />
                </div>
                <div className="form-input-box">
                  <label>Số Điện Thoại *</label>
                  <input
                    type="text"
                    required
                    placeholder="0988 888 999"
                    value={newCustForm.phone}
                    onChange={(e) => setNewCustForm({ ...newCustForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Địa Chỉ Giao Hàng</label>
                  <input
                    type="text"
                    placeholder="Quận Cầu Giấy, Hà Nội"
                    value={newCustForm.address}
                    onChange={(e) => setNewCustForm({ ...newCustForm, address: e.target.value })}
                  />
                </div>
                <div className="form-input-box">
                  <label>Phân Hạng (Tier)</label>
                  <select
                    value={newCustForm.tier}
                    onChange={(e) => setNewCustForm({ ...newCustForm, tier: e.target.value })}
                  >
                    <option value="Standard Member">👤 Standard Member</option>
                    <option value="Silver Member">🥈 Silver Member</option>
                    <option value="Gold VIP">🥇 Gold VIP</option>
                    <option value="Diamond VIP">💎 Diamond VIP</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn-tail-secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-tail-primary">
                  <Check size={15} /> Tạo Tài Khoản Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Detail Drawer */}
      {selectedCustomer && (
        <CustomerDetailDrawer
          customer={selectedCustomer}
          isOpen={Boolean(selectedCustomer)}
          onClose={() => {
            setSelectedCustomer(null);
            setSelectedCustomerId(null);
          }}
          onUpdateCustomer={handleUpdateCustomer}
          onViewOrder={onViewOrder}
          currencyFormatter={currencyFormatter}
        />
      )}
    </div>
  );
}
