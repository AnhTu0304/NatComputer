import React, { useState, useMemo } from 'react';
import {
  Warehouse, AlertTriangle, CheckCircle2, ArrowUpDown, Search, Filter,
  TrendingUp, TrendingDown, Package, PlusCircle, MinusCircle, ArrowRightLeft,
  Download, Upload, RefreshCw, AlertCircle, ShoppingCart, Truck, Calendar,
  ChevronLeft, ChevronRight, Check, X, ShieldAlert, BarChart3, Layers
} from 'lucide-react';
import InventoryAdjustmentModal from './InventoryAdjustmentModal';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

// Initial realistic PC Hardware stock movement history
const INITIAL_MOVEMENTS = [
  {
    id: 'mov_101',
    date: '2026-09-27T08:30:00Z',
    productName: 'VGA ASUS ROG Strix GeForce RTX 5080 16GB',
    sku: 'VGA-ROG-5080',
    movementType: 'Purchase',
    quantity: 10,
    previousStock: 2,
    newStock: 12,
    reason: 'Nhập lô hàng chính hãng Viễn Sơn (PO #VS-9821)',
    admin: 'Quân Hoàng (Kho HN)'
  },
  {
    id: 'mov_102',
    date: '2026-09-27T09:15:00Z',
    productName: 'CPU Intel Core i9-14900KS Special Edition',
    sku: 'CPU-14900KS',
    movementType: 'Sale',
    quantity: -1,
    previousStock: 6,
    newStock: 5,
    reason: 'Xuất lắp ráp dàn PC Gaming Ultra đơn #NAT-998811',
    admin: 'Hệ Thống Tự Động'
  },
  {
    id: 'mov_103',
    date: '2026-09-27T10:00:00Z',
    productName: 'RAM Corsair Vengeance RGB 32GB (2x16GB) DDR5',
    sku: 'RAM-COR-DDR5',
    movementType: 'Transfer',
    quantity: -4,
    previousStock: 18,
    newStock: 14,
    reason: 'Điều chuyển Kho Tổng HN ➔ Kho TP.HCM (Quận 10)',
    admin: 'Trần Minh (Kho Vận)'
  },
  {
    id: 'mov_104',
    date: '2026-09-26T14:20:00Z',
    productName: 'Nguồn Corsair RM850e 850W 80 Plus Gold',
    sku: 'PSU-RM850E',
    movementType: 'Damaged',
    quantity: -1,
    previousStock: 8,
    newStock: 7,
    reason: 'Hộp rách móp vỡ trong quá trình bốc dỡ xe tải',
    admin: 'Quân Hoàng (Kho HN)'
  },
  {
    id: 'mov_105',
    date: '2026-09-26T16:45:00Z',
    productName: 'SSD Kingston KC3000 1TB PCIe 4.0 NVMe M.2',
    sku: 'SSD-KC3000-1T',
    movementType: 'Manual Adjustment',
    quantity: 2,
    previousStock: 14,
    newStock: 16,
    reason: 'Cân bằng sau kiểm kê kho tầng 2 phát hiện dư 2 chiếc',
    admin: 'Nguyễn Văn Admin'
  },
  {
    id: 'mov_106',
    date: '2026-09-25T11:10:00Z',
    productName: 'Vỏ Case Lian Li O11 Dynamic EVO RGB White',
    sku: 'CASE-LIANLI-EVO',
    movementType: 'Return',
    quantity: 1,
    previousStock: 4,
    newStock: 5,
    reason: 'Khách đổi trả nguyên seal sang màu Đen',
    admin: 'Hệ Thống CSKH'
  }
];

export default function InventoryView({
  products = [],
  initialTab = 'inventory',
  currencyFormatter = fmt
}) {
  // Navigation tabs: 'inventory', 'movements', 'low-stock'
  const [activeTab, setActiveTab] = useState(initialTab === 'low-stock' ? 'low-stock' : 'inventory');

  // Local state for stock movements and live adjustments
  const [stockMovements, setStockMovements] = useState(INITIAL_MOVEMENTS);
  const [localProducts, setLocalProducts] = useState(products);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedProductForModal, setSelectedProductForModal] = useState(null);

  // Filters for Main Inventory Table
  const [searchTerm, setSearchTerm] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStockStatus, setFilterStockStatus] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters for Movements Table
  const [filterMovementType, setFilterMovementType] = useState('ALL');
  const [movementSearch, setMovementSearch] = useState('');

  // Pagination for main table
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Sync if products prop updates
  useMemo(() => {
    if (products && products.length > 0) {
      setLocalProducts(prev => {
        // preserve local stock if already adjusted
        return products.map(p => {
          const found = prev.find(x => x.id === p.id);
          return found ? { ...p, stock: found.stock !== undefined ? found.stock : p.stock } : p;
        });
      });
    }
  }, [products]);

  // Normalize products with inventory attributes
  const inventoryItems = useMemo(() => {
    return localProducts.map((p, idx) => {
      const currentStock = p.stock !== undefined ? Number(p.stock) : (idx % 6 === 0 ? 0 : (idx % 4 === 0 ? 3 : 15));
      const minStock = p.minStock || 5;
      const reserved = Math.min(currentStock, idx % 3 === 0 ? 2 : (idx % 5 === 0 ? 1 : 0));
      const available = Math.max(0, currentStock - reserved);
      const warehouse = p.warehouse || (idx % 3 === 0 ? 'Kho Hồ Chí Minh' : (idx % 5 === 0 ? 'Kho Đà Nẵng' : 'Kho Tổng Hà Nội'));

      let status = 'Healthy';
      if (currentStock === 0) status = 'Out of Stock';
      else if (currentStock <= 2) status = 'Critical';
      else if (currentStock <= minStock) status = 'Low Stock';

      // Supplier and suggested reorder
      const suppliers = ['ASUS Việt Nam', 'MSI Việt Nam Chính Hãng', 'Synnex FPT Phân Phối', 'Viễn Sơn Distribution', 'Thùy Minh Technology'];
      const supplier = p.brand ? `${p.brand} Official / Phân Phối` : suppliers[idx % suppliers.length];
      const suggestedReorder = Math.max(0, (minStock * 3) - currentStock);
      const costPrice = p.costPrice || Math.round((p.price || 0) * 0.78);

      return {
        id: p.id,
        name: p.name,
        sku: p.sku || `SKU-NAT-${p.id ? String(p.id).slice(-4).toUpperCase() : 1000 + idx}`,
        category: p.category || 'gaming',
        price: p.price || 0,
        costPrice,
        currentStock,
        reserved,
        available,
        minStock,
        warehouse,
        status,
        image: p.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=150&q=80',
        supplier,
        suggestedReorder,
        lastUpdated: p.updatedAt ? new Date(p.updatedAt).toLocaleDateString('vi-VN') : '27/09/2026'
      };
    });
  }, [localProducts]);

  // 1. Calculate 6 Overview KPI Metrics
  const metrics = useMemo(() => {
    let totalProducts = inventoryItems.length;
    let totalStockUnits = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalInventoryValue = 0;

    inventoryItems.forEach(item => {
      totalStockUnits += item.currentStock;
      totalInventoryValue += (item.currentStock * item.costPrice);
      if (item.currentStock === 0) outOfStock++;
      else if (item.currentStock <= item.minStock) lowStock++;
    });

    return {
      totalProducts,
      totalStockUnits,
      lowStock,
      outOfStock,
      totalInventoryValue,
      movementToday: '+45 Nhập / -28 Xuất'
    };
  }, [inventoryItems]);

  // 2. Category Inventory Value Breakdown for charts
  const categoryValues = useMemo(() => {
    const map = {};
    inventoryItems.forEach(i => {
      const cat = (i.category || 'Khác').toUpperCase();
      map[cat] = (map[cat] || 0) + (i.currentStock * i.costPrice);
    });
    return Object.entries(map).slice(0, 6);
  }, [inventoryItems]);

  // 3. Filtered Items for Main Inventory Table
  const filteredMainItems = useMemo(() => {
    return inventoryItems.filter(item => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        if (!item.name.toLowerCase().includes(q) && !item.sku.toLowerCase().includes(q)) {
          return false;
        }
      }
      if (filterWarehouse !== 'ALL' && item.warehouse !== filterWarehouse) return false;
      if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
      if (filterStockStatus !== 'ALL') {
        if (filterStockStatus === 'LOW_AND_OUT') {
          if (item.status === 'Healthy') return false;
        } else if (item.status !== filterStockStatus) {
          return false;
        }
      }
      return true;
    });
  }, [inventoryItems, searchTerm, filterWarehouse, filterCategory, filterStockStatus]);

  // Paginated items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMainItems.slice(start, start + pageSize);
  }, [filteredMainItems, currentPage, pageSize]);

  // 4. Low stock items strictly needing restock
  const lowStockItems = useMemo(() => {
    return inventoryItems.filter(i => i.currentStock <= i.minStock);
  }, [inventoryItems]);

  // 5. Filtered Stock Movements
  const filteredMovements = useMemo(() => {
    return stockMovements.filter(m => {
      if (filterMovementType !== 'ALL' && m.movementType !== filterMovementType) return false;
      if (movementSearch) {
        const q = movementSearch.toLowerCase();
        return m.productName.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q) || m.reason.toLowerCase().includes(q);
      }
      return true;
    });
  }, [stockMovements, filterMovementType, movementSearch]);

  // Handle Adjustment Submission from Modal
  const handleApplyAdjustment = (adjustmentData) => {
    // 1. Update product stock locally
    setLocalProducts(prev => {
      return prev.map(p => {
        if (String(p.id) === String(adjustmentData.productId)) {
          return { ...p, stock: adjustmentData.newStock };
        }
        return p;
      });
    });

    // 2. Prepend new movement record
    const newMovement = {
      id: 'mov_' + Date.now(),
      date: adjustmentData.date,
      productName: adjustmentData.productName,
      sku: adjustmentData.sku,
      movementType: adjustmentData.movementType,
      quantity: adjustmentData.quantity,
      previousStock: adjustmentData.previousStock,
      newStock: adjustmentData.newStock,
      reason: adjustmentData.reason + (adjustmentData.note ? ` (${adjustmentData.note})` : ''),
      admin: adjustmentData.admin || 'Admin Master'
    };
    setStockMovements(prev => [newMovement, ...prev]);
  };

  // Export Inventory CSV
  const handleExportCSV = () => {
    const headers = ['Mã SKU', 'Tên Linh Kiện', 'Danh Mục', 'Kho Lưu Giữ', 'Tồn Kho', 'Đang Giữ', 'Khả Dụng', 'Mức Tối Thiểu', 'Trạng Thái', 'Giá Vốn'];
    const rows = inventoryItems.map(i => [
      `"${i.sku}"`,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      `"${i.warehouse}"`,
      i.currentStock,
      i.reserved,
      i.available,
      i.minStock,
      `"${i.status}"`,
      i.costPrice
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bao_cao_ton_kho_nat_computer_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="inventory-dashboard-view">
      {/* PAGE HEADER */}
      <div className="inventory-page-header">
        <div>
          <h2>Quản Lý Kho & Mức Tồn Linh Kiện (Inventory)</h2>
          <p className="subtitle">Real-time stock levels, warehouse distribution, tracking & fulfillment readiness</p>
        </div>

        {/* Top Action Buttons */}
        <div className="header-actions">
          <button
            type="button"
            className="btn-header-primary"
            onClick={() => {
              setSelectedProductForModal(null);
              setModalMode('add');
              setIsModalOpen(true);
            }}
          >
            <PlusCircle size={15} /> + Add Stock
          </button>

          <button
            type="button"
            className="btn-header-secondary"
            onClick={() => {
              setSelectedProductForModal(null);
              setModalMode('adjust');
              setIsModalOpen(true);
            }}
          >
            ⚖️ Adjust Stock
          </button>

          <button
            type="button"
            className="btn-header-secondary"
            onClick={() => {
              setSelectedProductForModal(null);
              setModalMode('transfer');
              setIsModalOpen(true);
            }}
          >
            <ArrowRightLeft size={14} /> Transfer Stock
          </button>

          <button
            type="button"
            className="btn-header-secondary"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* OVERVIEW CARDS (6 CARDS) */}
      <div className="inventory-overview-cards-grid">
        <div className="overview-inv-card">
          <div className="card-top">
            <span className="card-title">Total Products</span>
            <span className="card-icon ic-blue"><Package size={16} /></span>
          </div>
          <div className="card-number">{metrics.totalProducts}</div>
          <div className="card-sub">Mã linh kiện PC đang quản lý</div>
        </div>

        <div className="overview-inv-card">
          <div className="card-top">
            <span className="card-title">Total Stock Units</span>
            <span className="card-icon ic-indigo"><Warehouse size={16} /></span>
          </div>
          <div className="card-number text-indigo">{metrics.totalStockUnits.toLocaleString()}</div>
          <div className="card-sub">Tổng số sản phẩm vật lý trong kho</div>
        </div>

        <div
          className={`overview-inv-card ${filterStockStatus === 'Low Stock' ? 'active-card' : ''}`}
          onClick={() => {
            setActiveTab('inventory');
            setFilterStockStatus('Low Stock');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-top">
            <span className="card-title">Low Stock</span>
            <span className="card-icon ic-amber"><AlertTriangle size={16} /></span>
          </div>
          <div className="card-number text-amber">{metrics.lowStock}</div>
          <div className="card-sub">Linh kiện chạm ngưỡng an toàn</div>
        </div>

        <div
          className={`overview-inv-card ${filterStockStatus === 'Out of Stock' ? 'active-card' : ''}`}
          onClick={() => {
            setActiveTab('inventory');
            setFilterStockStatus('Out of Stock');
          }}
          style={{ cursor: 'pointer' }}
        >
          <div className="card-top">
            <span className="card-title">Out of Stock</span>
            <span className="card-icon ic-red"><AlertCircle size={16} /></span>
          </div>
          <div className="card-number text-red">{metrics.outOfStock}</div>
          <div className="card-sub">Linh kiện đã cạn kho (= 0)</div>
        </div>

        <div className="overview-inv-card">
          <div className="card-top">
            <span className="card-title">Inventory Value</span>
            <span className="card-icon ic-green"><TrendingUp size={16} /></span>
          </div>
          <div className="card-number text-green" style={{ fontSize: '18px' }}>
            {currencyFormatter(metrics.totalInventoryValue)}
          </div>
          <div className="card-sub">Tổng giá trị vốn lưu kho</div>
        </div>

        <div className="overview-inv-card">
          <div className="card-top">
            <span className="card-title">Stock Movement Today</span>
            <span className="card-icon ic-purple"><ArrowRightLeft size={16} /></span>
          </div>
          <div className="card-number" style={{ fontSize: '15px', color: '#6366f1' }}>
            {metrics.movementToday}
          </div>
          <div className="card-sub">Cập nhật qua 14 giao dịch kho</div>
        </div>
      </div>

      {/* INTERACTIVE TREND CHARTS SECTION */}
      <div className="inventory-charts-row">
        {/* Chart 1: Value by Category */}
        <div className="chart-panel-card">
          <div className="panel-title-row">
            <h4><BarChart3 size={15} /> Phân Bổ Giá Trị Vốn Kho Theo Nhóm Linh Kiện</h4>
            <span className="badge-chart">Tài sản kho</span>
          </div>
          <div className="category-value-bars">
            {categoryValues.map(([cat, val], idx) => {
              const maxVal = categoryValues[0] ? categoryValues[0][1] : 1;
              const percent = Math.min(100, Math.round((val / (maxVal || 1)) * 100));
              return (
                <div key={idx} className="cat-bar-item">
                  <div className="cat-bar-info">
                    <span className="cat-name">{cat}</span>
                    <span className="cat-val">{currencyFormatter(val)}</span>
                  </div>
                  <div className="cat-bar-track">
                    <div className="cat-bar-fill" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: 7-Day Stock In vs Out Flow */}
        <div className="chart-panel-card">
          <div className="panel-title-row">
            <h4><TrendingUp size={15} /> Xu Hướng Xuất / Nhập Kho 7 Ngày Gần Nhất</h4>
            <span className="badge-chart">Biến động luồng</span>
          </div>
          <div className="trend-flow-container">
            {[
              { day: 'T2', inQty: 35, outQty: 22 },
              { day: 'T3', inQty: 48, outQty: 30 },
              { day: 'T4', inQty: 20, outQty: 42 },
              { day: 'T5', inQty: 55, outQty: 28 },
              { day: 'T6', inQty: 62, outQty: 38 },
              { day: 'T7', inQty: 80, outQty: 54 },
              { day: 'CN', inQty: 45, outQty: 28 }
            ].map((d, idx) => (
              <div key={idx} className="flow-day-col">
                <div className="flow-bars-pair">
                  <div className="flow-bar bar-in" style={{ height: `${d.inQty}%` }} title={`Nhập: +${d.inQty}`} />
                  <div className="flow-bar bar-out" style={{ height: `${d.outQty}%` }} title={`Xuất: -${d.outQty}`} />
                </div>
                <span className="day-label">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flow-legend-row">
            <span className="legend-item"><span className="legend-dot dot-in" /> Nhập kho (Stock In)</span>
            <span className="legend-item"><span className="legend-dot dot-out" /> Xuất bán & Lắp ráp (Stock Out)</span>
          </div>
        </div>
      </div>

      {/* 3 DEDICATED WORKSPACE TABS */}
      <div className="inventory-tabs-container">
        <div className="tabs-header-bar">
          <button
            type="button"
            className={`inv-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <Warehouse size={15} /> Bảng Quản Lý Tồn Kho Tổng ({inventoryItems.length})
          </button>
          <button
            type="button"
            className={`inv-tab-btn ${activeTab === 'movements' ? 'active' : ''}`}
            onClick={() => setActiveTab('movements')}
          >
            <ArrowRightLeft size={15} /> Nhật Ký Biến Động Kho / Thẻ Kho ({stockMovements.length})
          </button>
          <button
            type="button"
            className={`inv-tab-btn ${activeTab === 'low-stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('low-stock')}
          >
            <AlertTriangle size={15} color="#d97706" /> Cảnh Báo Nhập Hàng (Low Stock)
            {metrics.lowStock > 0 && <span className="tab-pill-badge">{metrics.lowStock}</span>}
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: MAIN INVENTORY TABLE                              */}
        {/* ======================================================== */}
        {activeTab === 'inventory' && (
          <div className="tab-pane-content">
            {/* Filter Bar */}
            <div className="inv-table-filter-bar">
              <div className="filter-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm linh kiện theo tên, mã SKU, hãng sản xuất..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
                {searchTerm && (
                  <button type="button" className="btn-clear-search" onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="filter-selects-row">
                <select
                  value={filterWarehouse}
                  onChange={(e) => { setFilterWarehouse(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">Tất cả chi nhánh kho</option>
                  <option value="Kho Tổng Hà Nội">🏢 Kho Tổng Hà Nội</option>
                  <option value="Kho Hồ Chí Minh">🏬 Kho Hồ Chí Minh</option>
                  <option value="Kho Đà Nẵng">🏪 Kho Đà Nẵng</option>
                </select>

                <select
                  value={filterStockStatus}
                  onChange={(e) => { setFilterStockStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="ALL">Tất cả tình trạng tồn</option>
                  <option value="Healthy">🟢 Tồn kho an toàn (Healthy)</option>
                  <option value="Low Stock">🟠 Sắp hết hàng (Low Stock)</option>
                  <option value="Critical">🟡 Mức báo động (&le; 2 chiếc)</option>
                  <option value="Out of Stock">🔴 Hết hàng (Out of Stock)</option>
                </select>

                {(searchTerm || filterWarehouse !== 'ALL' || filterStockStatus !== 'ALL') && (
                  <button
                    type="button"
                    className="btn-reset-filters"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterWarehouse('ALL');
                      setFilterStockStatus('ALL');
                      setCurrentPage(1);
                    }}
                  >
                    Đặt lại
                  </button>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th style={{ width: '36px' }}>
                      <input
                        type="checkbox"
                        checked={paginatedItems.length > 0 && selectedIds.length === paginatedItems.length}
                        onChange={() => {
                          if (selectedIds.length === paginatedItems.length) setSelectedIds([]);
                          else setSelectedIds(paginatedItems.map(i => i.id));
                        }}
                      />
                    </th>
                    <th>LINH KIỆN / SẢN PHẨM</th>
                    <th>MÃ SKU</th>
                    <th>KHO LƯU GIỮ</th>
                    <th style={{ textAlign: 'center' }}>TỒN THỰC</th>
                    <th style={{ textAlign: 'center' }}>ĐANG GIỮ</th>
                    <th style={{ textAlign: 'center' }}>KHẢ DỤNG</th>
                    <th style={{ textAlign: 'center' }}>MỨC AN TOÀN</th>
                    <th>TRẠNG THÁI</th>
                    <th style={{ textAlign: 'right' }}>THAO TÁC</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedItems.map(item => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr key={item.id} className={isSelected ? 'selected-row' : ''}>
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              setSelectedIds(prev =>
                                prev.includes(item.id) ? prev.filter(x => x !== item.id) : [...prev, item.id]
                              );
                            }}
                          />
                        </td>
                        <td>
                          <div className="item-cell-layout">
                            <img src={item.image} alt={item.name} className="item-thumb" />
                            <div>
                              <div className="item-name">{item.name}</div>
                              <div className="item-sku">{item.category}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-code">{item.sku}</span>
                        </td>
                        <td>
                          <span className="warehouse-tag">{item.warehouse}</span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>
                          {item.currentStock}
                        </td>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>
                          {item.reserved}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 700, color: item.available > 0 ? '#16a34a' : '#dc2626' }}>
                          {item.available}
                        </td>
                        <td style={{ textAlign: 'center', color: '#94a3b8' }}>
                          {item.minStock}
                        </td>
                        <td>
                          <span className={`stock-status-badge status-${item.status.toLowerCase().replace(/\s+/g, '-')}`}>
                            {item.status === 'Healthy' && '🟢 Healthy'}
                            {item.status === 'Low Stock' && '🟠 Low Stock'}
                            {item.status === 'Critical' && '🟡 Critical'}
                            {item.status === 'Out of Stock' && '🔴 Out of Stock'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div className="table-actions-cluster">
                            <button
                              type="button"
                              className="btn-quick-stock"
                              title="Nhập thêm hàng"
                              onClick={() => {
                                setSelectedProductForModal(item);
                                setModalMode('add');
                                setIsModalOpen(true);
                              }}
                            >
                              + Nhập
                            </button>
                            <button
                              type="button"
                              className="btn-quick-adjust"
                              title="Cân bằng kiểm kê"
                              onClick={() => {
                                setSelectedProductForModal(item);
                                setModalMode('adjust');
                                setIsModalOpen(true);
                              }}
                            >
                              ⚖️
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {paginatedItems.length === 0 && (
                    <tr>
                      <td colSpan="10" className="orders-empty-state">
                        <Warehouse size={36} color="#94a3b8" />
                        <h4>Không tìm thấy linh kiện nào trong kho</h4>
                        <p>Thử tìm với từ khóa khác hoặc bấm nút đặt lại bộ lọc.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredMainItems.length > 0 && (
              <div className="orders-pagination-footer">
                <div className="page-info">
                  Hiển thị <strong>{Math.min(filteredMainItems.length, (currentPage - 1) * pageSize + 1)}</strong> - <strong>{Math.min(filteredMainItems.length, currentPage * pageSize)}</strong> trên tổng số <strong>{filteredMainItems.length}</strong> linh kiện
                </div>
                <div className="page-controls">
                  <div className="page-nav-btns">
                    <button
                      type="button"
                      className="btn-page-nav"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      <ChevronLeft size={16} /> Trước
                    </button>
                    <span className="current-page-num">{currentPage} / {Math.max(1, Math.ceil(filteredMainItems.length / pageSize))}</span>
                    <button
                      type="button"
                      className="btn-page-nav"
                      disabled={currentPage >= Math.ceil(filteredMainItems.length / pageSize)}
                      onClick={() => setCurrentPage(p => p + 1)}
                    >
                      Sau <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: STOCK MOVEMENT HISTORY                            */}
        {/* ======================================================== */}
        {activeTab === 'movements' && (
          <div className="tab-pane-content">
            {/* Filter Bar */}
            <div className="inv-table-filter-bar">
              <div className="filter-search-box">
                <Search size={15} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm theo sản phẩm, mã SKU hoặc lý do xuất nhập..."
                  value={movementSearch}
                  onChange={(e) => setMovementSearch(e.target.value)}
                />
              </div>

              <div className="filter-selects-row">
                <select
                  value={filterMovementType}
                  onChange={(e) => setFilterMovementType(e.target.value)}
                >
                  <option value="ALL">Tất cả loại biến động (Movement Types)</option>
                  <option value="Purchase">📥 Purchase (Nhập hàng NCC)</option>
                  <option value="Sale">📦 Sale (Xuất bán đơn hàng)</option>
                  <option value="Transfer">⇄ Transfer (Điều chuyển kho)</option>
                  <option value="Manual Adjustment">⚖️ Manual Adjustment (Cân bằng kiểm kê)</option>
                  <option value="Damaged">⚠️ Damaged (Lỗi hỏng xuất hủy)</option>
                  <option value="Return">🔄 Return (Khách đổi trả)</option>
                </select>
              </div>
            </div>

            {/* Movements Table */}
            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>THỜI GIAN</th>
                    <th>LINH KIỆN PC</th>
                    <th>MÃ SKU</th>
                    <th>LOẠI BIẾN ĐỘNG</th>
                    <th style={{ textAlign: 'center' }}>SỐ LƯỢNG</th>
                    <th style={{ textAlign: 'center' }}>TỒN CŨ</th>
                    <th style={{ textAlign: 'center' }}>TỒN MỚI</th>
                    <th>LÝ DO / CHỨNG TỪ</th>
                    <th>NGƯỜI THỰC HIỆN</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map(m => {
                    const isPositive = m.quantity > 0;
                    return (
                      <tr key={m.id}>
                        <td style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                          {new Date(m.date).toLocaleString('vi-VN')}
                        </td>
                        <td>
                          <strong>{m.productName}</strong>
                        </td>
                        <td><span className="text-code">{m.sku}</span></td>
                        <td>
                          <span className={`pill-movement-type mov-${m.movementType.toLowerCase().replace(/\s+/g, '-')}`}>
                            {m.movementType}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: isPositive ? '#16a34a' : '#dc2626' }}>
                          {isPositive ? `+${m.quantity}` : `${m.quantity}`}
                        </td>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>{m.previousStock}</td>
                        <td style={{ textAlign: 'center', fontWeight: 700 }}>{m.newStock}</td>
                        <td style={{ fontSize: '12px', color: '#334155' }}>{m.reason}</td>
                        <td style={{ fontSize: '11px', color: '#64748b' }}>{m.admin}</td>
                      </tr>
                    );
                  })}

                  {filteredMovements.length === 0 && (
                    <tr>
                      <td colSpan="9" className="orders-empty-state">
                        <ArrowRightLeft size={36} color="#94a3b8" />
                        <h4>Chưa có bản ghi biến động kho nào</h4>
                        <p>Mọi giao dịch xuất, nhập, điều chuyển linh kiện sẽ được ghi vết tự động tại đây.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: LOW STOCK RESTOCKING PAGE                         */}
        {/* ======================================================== */}
        {activeTab === 'low-stock' && (
          <div className="tab-pane-content">
            <div className="low-stock-banner">
              <AlertTriangle size={20} color="#b45309" />
              <div>
                <strong>Cảnh báo thiếu hụt linh kiện PC ({lowStockItems.length} sản phẩm cần nhập thêm)</strong>
                <p>Hệ thống tự động tính toán số lượng đề xuất đặt thêm dựa trên định mức an toàn tối thiểu và tốc độ bán ra.</p>
              </div>
            </div>

            <div className="orders-table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>LINH KIỆN CẦN NHẬP</th>
                    <th>MÃ SKU</th>
                    <th style={{ textAlign: 'center' }}>TỒN HIỆN TẠI</th>
                    <th style={{ textAlign: 'center' }}>MỨC TỐI THIỂU</th>
                    <th style={{ textAlign: 'center' }}>ĐỀ XUẤT ĐẶT THÊM</th>
                    <th>NHÀ PHÂN PHỐI CHÍNH HÃNG</th>
                    <th style={{ textAlign: 'right' }}>GIÁ NHẬP GẦN NHẤT</th>
                    <th style={{ textAlign: 'right' }}>DỰ TOÁN CHI PHÍ</th>
                    <th style={{ textAlign: 'center' }}>HÀNH ĐỘNG</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map(item => {
                    const estCost = item.suggestedReorder * item.costPrice;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div className="item-cell-layout">
                            <img src={item.image} alt={item.name} className="item-thumb" />
                            <div>
                              <div className="item-name">{item.name}</div>
                              <div className="item-sku">{item.category} • {item.warehouse}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="text-code">{item.sku}</span></td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: item.currentStock === 0 ? '#dc2626' : '#d97706' }}>
                          {item.currentStock} {item.currentStock === 0 ? '(HẾT)' : ''}
                        </td>
                        <td style={{ textAlign: 'center', color: '#64748b' }}>{item.minStock}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="suggested-qty-pill">
                            +{item.suggestedReorder} chiếc
                          </span>
                        </td>
                        <td>
                          <span className="supplier-tag">{item.supplier}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>{currencyFormatter(item.costPrice)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#4f46e5' }}>
                          {currencyFormatter(estCost)}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            type="button"
                            className="btn-restock-now"
                            onClick={() => {
                              setSelectedProductForModal(item);
                              setModalMode('add');
                              setIsModalOpen(true);
                            }}
                          >
                            <ShoppingCart size={13} /> + Nhập Hàng
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {lowStockItems.length === 0 && (
                    <tr>
                      <td colSpan="9" className="orders-empty-state">
                        <CheckCircle2 size={36} color="#16a34a" />
                        <h4>Kho hàng đang ở trạng thái an toàn tuyệt đối!</h4>
                        <p>Tất cả linh kiện đều đáp ứng đầy đủ định mức tồn kho tối thiểu.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* INVENTORY ADJUSTMENT MODAL */}
      <InventoryAdjustmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={inventoryItems}
        selectedProduct={selectedProductForModal}
        initialMode={modalMode}
        onApplyAdjustment={handleApplyAdjustment}
      />
    </div>
  );
}
