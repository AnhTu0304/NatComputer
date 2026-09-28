import React, { useState, useMemo } from 'react';
import {
  Ticket, Plus, Download, RefreshCw, Search, Filter,
  Percent, DollarSign, Truck, Gift, ShoppingBag, Calendar,
  CheckCircle, Ban, Clock, AlertTriangle, Edit3, Trash2,
  TrendingUp, CreditCard, ChevronLeft, ChevronRight, Copy, Check
} from 'lucide-react';
import PromotionEditorModal from './PromotionEditorModal';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

const INITIAL_PROMOTIONS = [
  {
    id: 'promo-01',
    name: 'DEAL KHAI XUÂN GAMING - GIẢM 10% DÀN MÁY PC',
    code: 'PCGAMING10',
    type: 'percentage',
    value: 10,
    minOrder: 15000000,
    maxDiscount: 2000000,
    applicableCategory: 'PC_GAMING',
    applicableProduct: 'ALL',
    eligibility: 'ALL',
    usageLimit: 150,
    usedCount: 78,
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    status: 'Active',
    totalDiscountGiven: 124800000,
    revenueGenerated: 1248000000,
    description: 'Giảm 10% tối đa 2 triệu cho đơn máy tính để bàn lắp ráp từ 15 triệu'
  },
  {
    id: 'promo-02',
    name: 'EARLY BIRD SIÊU PHẨM VGA RTX 5000 SERIES',
    code: 'RTX5090LAUNCH',
    type: 'fixed',
    value: 1500000,
    minOrder: 25000000,
    maxDiscount: 1500000,
    applicableCategory: 'VGA',
    applicableProduct: 'ALL',
    eligibility: 'VIP',
    usageLimit: 50,
    usedCount: 34,
    startDate: '2026-09-15',
    endDate: '2026-10-30',
    status: 'Active',
    totalDiscountGiven: 51000000,
    revenueGenerated: 850000000,
    description: 'Trừ trực tiếp 1.500.000đ khi đặt trước card màn hình NVIDIA thế hệ mới'
  },
  {
    id: 'promo-03',
    name: 'MIỄN PHÍ VẬN CHUYỂN HỎA TỐC TOÀN QUỐC',
    code: 'FREESHIPPC',
    type: 'shipping',
    value: 0,
    minOrder: 8000000,
    maxDiscount: 300000,
    applicableCategory: 'ALL',
    applicableProduct: 'ALL',
    eligibility: 'ALL',
    usageLimit: 300,
    usedCount: 215,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 'Active',
    totalDiscountGiven: 43000000,
    revenueGenerated: 1720000000,
    description: 'Freeship hỏa tốc đóng thùng gỗ bảo hiểm cho mọi đơn linh kiện từ 8 triệu'
  },
  {
    id: 'promo-04',
    name: 'COMBO BUILD PC I9 TẶNG PHÍM CƠ CUSTOM & CHUỘT WIRELESS',
    code: 'PCGEARGIFT',
    type: 'bundle',
    value: 1290000,
    minOrder: 35000000,
    maxDiscount: 1290000,
    giftItemName: 'Chuột Gaming Logitech G Pro X Superlight 2 (White)',
    applicableCategory: 'ALL',
    applicableProduct: 'ALL',
    eligibility: 'ALL',
    usageLimit: 40,
    usedCount: 19,
    startDate: '2026-09-20',
    endDate: '2026-10-25',
    status: 'Active',
    totalDiscountGiven: 24510000,
    revenueGenerated: 665000000,
    description: 'Tặng ngay Chuột Gaming trị giá 1.290.000đ khi build dàn máy đồ họa/gaming'
  },
  {
    id: 'promo-05',
    name: 'ĐẠI TIỆC CÔNG NGHỆ BLACK FRIDAY 2026',
    code: 'BLACKFRIDAY26',
    type: 'percentage',
    value: 20,
    minOrder: 10000000,
    maxDiscount: 4000000,
    applicableCategory: 'ALL',
    applicableProduct: 'ALL',
    eligibility: 'ALL',
    usageLimit: 500,
    usedCount: 0,
    startDate: '2026-11-20',
    endDate: '2026-11-30',
    status: 'Scheduled',
    totalDiscountGiven: 0,
    revenueGenerated: 0,
    description: 'Chiến dịch siêu giảm giá Black Friday quy mô toàn hệ thống cuối năm'
  },
  {
    id: 'promo-06',
    name: 'ƯU ĐÃI KHÁCH HÀNG MỚI ĐĂNG KÝ HỘI VIÊN',
    code: 'WELCOME500K',
    type: 'fixed',
    value: 500000,
    minOrder: 10000000,
    maxDiscount: 500000,
    applicableCategory: 'ALL',
    applicableProduct: 'ALL',
    eligibility: 'NEW',
    usageLimit: 200,
    usedCount: 180,
    startDate: '2026-08-01',
    endDate: '2026-09-20',
    status: 'Expired',
    totalDiscountGiven: 90000000,
    revenueGenerated: 1800000000,
    description: 'Voucher chào mừng dành cho tài khoản đăng ký tài khoản lần đầu'
  },
  {
    id: 'promo-07',
    name: 'CHIẾT KHẤU ĐẶC QUYỀN VIP DIAMOND CLUB',
    code: 'DIAMONDVIP',
    type: 'percentage',
    value: 12,
    minOrder: 50000000,
    maxDiscount: 6000000,
    applicableCategory: 'ALL',
    applicableProduct: 'ALL',
    eligibility: 'VIP',
    usageLimit: 30,
    usedCount: 14,
    startDate: '2026-09-01',
    endDate: '2026-12-31',
    status: 'Disabled',
    totalDiscountGiven: 84000000,
    revenueGenerated: 700000000,
    description: 'Chương trình chiết khấu nội bộ dành cho đối tác doanh nghiệp và hội viên Diamond'
  }
];

export default function PromotionsView({
  categories = [],
  products = [],
  currencyFormatter = fmt
}) {
  const [promotions, setPromotions] = useState(INITIAL_PROMOTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);

  // 5 KPI Summary Metrics
  const summaryMetrics = useMemo(() => {
    const activeCount = promotions.filter(p => p.status === 'Active').length;
    const scheduledCount = promotions.filter(p => p.status === 'Scheduled').length;
    const expiredCount = promotions.filter(p => p.status === 'Expired').length;
    const totalDiscountAmount = promotions.reduce((sum, p) => sum + (p.totalDiscountGiven || 0), 0);
    const promotionRevenue = promotions.reduce((sum, p) => sum + (p.revenueGenerated || 0), 0);

    return {
      activeCount,
      scheduledCount,
      expiredCount,
      totalDiscountAmount,
      promotionRevenue
    };
  }, [promotions]);

  // Filtered List
  const filteredPromotions = useMemo(() => {
    return promotions.filter(p => {
      // Search Name or Code
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesCode = (p.code || '').toLowerCase().includes(q);
        if (!matchesName && !matchesCode) return false;
      }

      // Type Filter
      if (typeFilter !== 'ALL' && p.type !== typeFilter) return false;

      // Status Filter
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;

      return true;
    });
  }, [promotions, searchQuery, typeFilter, statusFilter]);

  // Handle Save (Create or Edit)
  const handleSavePromotion = (data) => {
    if (editingPromotion) {
      setPromotions(prev => prev.map(p => p.id === editingPromotion.id ? { ...p, ...data } : p));
    } else {
      const newPromo = {
        id: `promo-${Date.now()}`,
        ...data,
        usedCount: 0,
        totalDiscountGiven: 0,
        revenueGenerated: 0
      };
      setPromotions([newPromo, ...promotions]);
    }
    setEditingPromotion(null);
  };

  // Toggle Status (Active <=> Disabled)
  const handleToggleStatus = (promo, e) => {
    e.stopPropagation();
    let newStatus = 'Active';
    if (promo.status === 'Active') newStatus = 'Disabled';
    else if (promo.status === 'Disabled') newStatus = 'Active';
    else if (promo.status === 'Scheduled') newStatus = 'Active';
    else if (promo.status === 'Expired') newStatus = 'Active';

    setPromotions(prev => prev.map(p => p.id === promo.id ? { ...p, status: newStatus } : p));
  };

  // Delete Promotion
  const handleDeletePromotion = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Bạn có chắc chắn muốn xóa chương trình khuyến mãi này khỏi hệ thống?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
    }
  };

  // Copy Code
  const handleCopyCode = (code, e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Mã Voucher', 'Tên Khuyến Mãi', 'Loại Ưu Đãi', 'Mức Giảm', 'Đã Dùng / Giới Hạn', 'Bắt Đầu', 'Kết Thúc', 'Trạng Thái', 'Tiền Đã Giảm', 'Doanh Thu Mang Về'];
    const rows = filteredPromotions.map(p => [
      p.code,
      `"${p.name}"`,
      p.type,
      p.type === 'percentage' ? `${p.value}%` : fmt(p.value),
      `${p.usedCount || 0}/${p.usageLimit || 0}`,
      p.startDate,
      p.endDate,
      p.status,
      p.totalDiscountGiven || 0,
      p.revenueGenerated || 0
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `promotions_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Format type badge
  const renderTypePill = (type) => {
    switch (type) {
      case 'percentage':
        return <span className="promo-type-pill pill-percentage"><Percent size={12} /> Percentage</span>;
      case 'fixed':
        return <span className="promo-type-pill pill-fixed"><DollarSign size={12} /> Fixed Amount</span>;
      case 'shipping':
        return <span className="promo-type-pill pill-shipping"><Truck size={12} /> Free Shipping</span>;
      case 'bundle':
        return <span className="promo-type-pill pill-bundle"><Gift size={12} /> Buy X Get Y</span>;
      case 'category':
        return <span className="promo-type-pill pill-category"><ShoppingBag size={12} /> Category</span>;
      case 'product':
        return <span className="promo-type-pill pill-product"><Ticket size={12} /> Product</span>;
      default:
        return <span className="promo-type-pill pill-fixed">{type}</span>;
    }
  };

  // Format status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <span className="badge-promo-status status-active">● Active</span>;
      case 'Scheduled':
        return <span className="badge-promo-status status-scheduled">🕒 Scheduled</span>;
      case 'Expired':
        return <span className="badge-promo-status status-expired">⚠ Expired</span>;
      case 'Disabled':
        return <span className="badge-promo-status status-disabled">○ Disabled</span>;
      default:
        return <span className="badge-promo-status status-active">{status}</span>;
    }
  };

  return (
    <div className="promotions-view-wrapper">
      {/* Top Header */}
      <div className="panel-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Khuyến Mãi & Giảm Giá (Promotions & Discounts)
            </h3>
            <span className="badge-active-tag badge-healthy" style={{ fontSize: 12 }}>
              {promotions.length} Chiến Dịch
            </span>
          </div>
          <p className="panel-sub" style={{ margin: '4px 0 0' }}>
            Thiết lập mã voucher, chiết khấu linh kiện, miễn phí vận chuyển và quà tặng combo PC
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn-tail-secondary" onClick={handleExportCSV}>
            <Download size={15} /> Xuất Báo Cáo
          </button>
          <button
            type="button"
            className="btn-tail-primary"
            onClick={() => {
              setEditingPromotion(null);
              setIsModalOpen(true);
            }}
          >
            <Plus size={15} /> + Tạo Khuyến Mãi Mới
          </button>
        </div>
      </div>

      {/* 5 KPI Summary Cards */}
      <div className="customer-kpi-grid">
        {/* Card 1: Active Promotions */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">ACTIVE PROMOTIONS</span>
            <div className="c-kpi-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Ticket size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.activeCount}</div>
          <div className="c-kpi-foot positive">
            <CheckCircle size={13} />
            <span>Đang kích hoạt trên Storefront</span>
          </div>
        </div>

        {/* Card 2: Scheduled Promotions */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">SCHEDULED PROMOTIONS</span>
            <div className="c-kpi-icon" style={{ background: '#eff6ff', color: '#3b82f6' }}>
              <Clock size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.scheduledCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Sắp diễn ra theo lịch hẹn</span>
          </div>
        </div>

        {/* Card 3: Expired Promotions */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">EXPIRED PROMOTIONS</span>
            <div className="c-kpi-icon" style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="c-kpi-num">{summaryMetrics.expiredCount}</div>
          <div className="c-kpi-foot neutral">
            <span>Cần gia hạn hoặc lưu trữ</span>
          </div>
        </div>

        {/* Card 4: Total Discount Amount */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">TOTAL DISCOUNT AMOUNT</span>
            <div className="c-kpi-icon" style={{ background: '#fdf2f8', color: '#db2777' }}>
              <Percent size={18} />
            </div>
          </div>
          <div className="c-kpi-num" style={{ fontSize: 20 }}>
            {currencyFormatter(summaryMetrics.totalDiscountAmount)}
          </div>
          <div className="c-kpi-foot positive">
            <span>Tổng tiền đã giảm cho khách</span>
          </div>
        </div>

        {/* Card 5: Promotion Revenue */}
        <div className="c-kpi-card">
          <div className="c-kpi-top">
            <span className="c-kpi-title">PROMOTION REVENUE</span>
            <div className="c-kpi-icon" style={{ background: '#ecfeff', color: '#0891b2' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="c-kpi-num" style={{ fontSize: 20 }}>
            {currencyFormatter(summaryMetrics.promotionRevenue)}
          </div>
          <div className="c-kpi-foot positive">
            <span>Doanh thu từ các đơn dùng mã</span>
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
            placeholder="Tìm theo tên chiến dịch hoặc mã code (VD: PCGAMING10, FREESHIP)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter items */}
        <div className="c-filters-group">
          <div className="c-filter-item">
            <label>Hình Thức Ưu Đãi:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="ALL">Tất cả hình thức ({promotions.length})</option>
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Amount (VNĐ)</option>
              <option value="shipping">Free Shipping</option>
              <option value="bundle">Buy X Get Y (Quà tặng)</option>
              <option value="category">Category Discount</option>
              <option value="product">Product Discount</option>
            </select>
          </div>

          <div className="c-filter-item">
            <label>Trạng Thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">Mọi trạng thái</option>
              <option value="Active">Đang chạy (Active)</option>
              <option value="Scheduled">Đã lên lịch (Scheduled)</option>
              <option value="Expired">Hết hạn (Expired)</option>
              <option value="Disabled">Đã tắt (Disabled)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Promotion Data Table */}
      <div className="tail-table-container">
        <table className="tail-data-table">
          <thead>
            <tr>
              <th>CHƯƠNG TRÌNH KHUYẾN MÃI</th>
              <th>MÃ VOUCHER</th>
              <th>HÌNH THỨC</th>
              <th>MỨC GIẢM</th>
              <th style={{ width: 150 }}>LƯỢT SỬ DỤNG</th>
              <th>BẮT ĐẦU</th>
              <th>KẾT THÚC</th>
              <th>TRẠNG THÁI</th>
              <th style={{ textAlign: 'center' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {filteredPromotions.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '36px', color: '#94a3b8' }}>
                  <Ticket size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  Không tìm thấy chương trình khuyến mãi nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredPromotions.map((promo) => {
                const usagePercent = promo.usageLimit > 0 ? Math.min(100, Math.round((promo.usedCount / promo.usageLimit) * 100)) : 0;

                return (
                  <tr key={promo.id}>
                    {/* Promotion Name & Subtitle */}
                    <td>
                      <div style={{ maxWidth: 280 }}>
                        <strong style={{ fontSize: 13, color: '#0f172a', display: 'block', lineHeight: 1.4 }}>
                          {promo.name}
                        </strong>
                        <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                          {promo.description || 'Ưu đãi dành cho khách hàng NAT Computer'}
                        </div>
                      </div>
                    </td>

                    {/* Code */}
                    <td>
                      <div className="promo-code-pill">
                        <code>{promo.code}</code>
                        <button
                          type="button"
                          className="btn-code-copy"
                          onClick={(e) => handleCopyCode(promo.code, e)}
                          title="Sao chép mã voucher"
                        >
                          {copiedCode === promo.code ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                        </button>
                      </div>
                    </td>

                    {/* Type */}
                    <td>
                      {renderTypePill(promo.type)}
                    </td>

                    {/* Discount Value */}
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 13, color: '#059669' }}>
                        {promo.type === 'percentage' && `${promo.value}% (Max ${fmt(promo.maxDiscount)})`}
                        {promo.type === 'fixed' && fmt(promo.value)}
                        {promo.type === 'shipping' && '100% Freeship'}
                        {promo.type === 'bundle' && `Tặng ${promo.giftItemName || 'Quà VIP'}`}
                        {promo.type === 'category' && `${promo.value}% Danh mục`}
                        {promo.type === 'product' && `${promo.value}% Sản phẩm`}
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        Đơn từ {fmt(promo.minOrder || 0)}
                      </div>
                    </td>

                    {/* Usage Progress */}
                    <td>
                      <div className="promo-usage-box">
                        <div className="usage-numbers">
                          <span>{promo.usedCount || 0}</span>
                          <span style={{ color: '#94a3b8' }}>/ {promo.usageLimit}</span>
                          <span className="usage-percent">({usagePercent}%)</span>
                        </div>
                        <div className="usage-track">
                          <div
                            className={`usage-bar ${usagePercent >= 80 ? 'bar-high' : 'bar-normal'}`}
                            style={{ width: `${usagePercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Start Date */}
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      {promo.startDate}
                    </td>

                    {/* End Date */}
                    <td style={{ fontSize: 12, color: '#64748b' }}>
                      {promo.endDate}
                    </td>

                    {/* Status */}
                    <td>
                      {renderStatusBadge(promo.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          type="button"
                          className={promo.status === 'Active' ? 'btn-tail-delete' : 'btn-tail-edit'}
                          onClick={(e) => handleToggleStatus(promo, e)}
                          title={promo.status === 'Active' ? 'Tạm tắt khuyến mãi' : 'Kích hoạt khuyến mãi'}
                        >
                          {promo.status === 'Active' ? <Ban size={13} /> : <CheckCircle size={13} />}
                        </button>
                        <button
                          type="button"
                          className="btn-tail-edit"
                          onClick={() => {
                            setEditingPromotion(promo);
                            setIsModalOpen(true);
                          }}
                          title="Chỉnh sửa chương trình"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          className="btn-tail-delete"
                          onClick={(e) => handleDeletePromotion(promo.id, e)}
                          title="Xóa khuyến mãi"
                        >
                          <Trash2 size={13} />
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
          Hiển thị <strong>{filteredPromotions.length}</strong> trên tổng số <strong>{promotions.length}</strong> chương trình khuyến mãi
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

      {/* Promotion Editor Modal with Live Customer Preview */}
      {isModalOpen && (
        <PromotionEditorModal
          isOpen={isModalOpen}
          initialData={editingPromotion}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPromotion(null);
          }}
          onSave={handleSavePromotion}
          categories={categories}
          products={products}
        />
      )}
    </div>
  );
}
