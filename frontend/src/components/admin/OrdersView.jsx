import React, { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, ArrowUpDown, CheckSquare, Square,
  ShoppingBag, CheckCircle2, AlertCircle, Clock, Truck, Package,
  FileText, CreditCard, RotateCcw, X, Eye, Download, RefreshCw,
  Plus, Calendar, ChevronLeft, ChevronRight, User, Phone, MapPin,
  ExternalLink, Sparkles
} from 'lucide-react';
import OrderDetailDrawer from './OrderDetailDrawer';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

export default function OrdersView({
  orders = [],
  onStatusChange,
  onConfirmPayment,
  onPrintInvoice,
  onSimulateOrder,
  onSyncOrders,
  isLoading = false,
  currencyFormatter = fmt
}) {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('ALL');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState('ALL');
  const [filterDateRange, setFilterDateRange] = useState('ALL');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('ALL');
  const [filterShippingMethod, setFilterShippingMethod] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, total_desc, total_asc

  // Selection & Detail Drawer
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewingOrder, setViewingOrder] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 1. Calculate 7 Summary KPI metrics
  const summaryMetrics = useMemo(() => {
    let all = orders.length;
    let pendingPay = 0;
    let processing = 0;
    let shipping = 0;
    let completed = 0;
    let cancelled = 0;
    let refunded = 0;

    let totalRevenue = 0;

    orders.forEach(o => {
      const amt = Number(o.totalAmount) || 0;
      totalRevenue += amt;

      const pStatus = String(o.paymentStatus || '').toUpperCase();
      const oStatus = String(o.orderStatus || '').toUpperCase();

      if (pStatus !== 'PAID' && oStatus !== 'CANCELLED') pendingPay++;
      if (['PROCESSING', 'PENDING', 'CONFIRMED'].includes(oStatus)) processing++;
      if (['SHIPPING', 'PACKED'].includes(oStatus)) shipping++;
      if (['COMPLETED', 'DELIVERED'].includes(oStatus)) completed++;
      if (oStatus === 'CANCELLED') cancelled++;
      if (oStatus === 'RETURNED' || pStatus === 'REFUNDED') refunded++;
    });

    return {
      all,
      pendingPay,
      processing,
      shipping,
      completed,
      cancelled,
      refunded,
      totalRevenue
    };
  }, [orders]);

  // 2. Filter & Sort Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const idMatch = String(o.id || o.orderId || '').toLowerCase().includes(q);
        const nameMatch = String(o.customerName || '').toLowerCase().includes(q);
        const emailMatch = String(o.customerEmail || '').toLowerCase().includes(q);
        const phoneMatch = String(o.customerPhone || '').toLowerCase().includes(q);
        if (!idMatch && !nameMatch && !emailMatch && !phoneMatch) return false;
      }

      // Order Status
      const oStatus = String(o.orderStatus || 'PROCESSING').toUpperCase();
      if (filterOrderStatus !== 'ALL') {
        if (filterOrderStatus === 'PROCESSING_GROUP') {
          if (!['PROCESSING', 'PENDING', 'CONFIRMED'].includes(oStatus)) return false;
        } else if (filterOrderStatus === 'SHIPPING_GROUP') {
          if (!['SHIPPING', 'PACKED'].includes(oStatus)) return false;
        } else if (filterOrderStatus === 'COMPLETED_GROUP') {
          if (!['COMPLETED', 'DELIVERED'].includes(oStatus)) return false;
        } else if (oStatus !== filterOrderStatus) {
          return false;
        }
      }

      // Payment Status
      const pStatus = String(o.paymentStatus || 'PENDING').toUpperCase();
      if (filterPaymentStatus !== 'ALL') {
        if (filterPaymentStatus === 'UNPAID') {
          if (pStatus === 'PAID') return false;
        } else if (pStatus !== filterPaymentStatus) {
          return false;
        }
      }

      // Payment Method
      if (filterPaymentMethod !== 'ALL') {
        const method = String(o.paymentMethod || '').toLowerCase();
        if (!method.includes(filterPaymentMethod.toLowerCase())) return false;
      }

      // Shipping Method
      if (filterShippingMethod !== 'ALL') {
        const ship = String(o.shippingMethod || '').toLowerCase();
        if (!ship.includes(filterShippingMethod.toLowerCase())) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'newest') return (b.id || 0) > (a.id || 0) ? 1 : -1;
      if (sortBy === 'oldest') return (a.id || 0) > (b.id || 0) ? 1 : -1;
      if (sortBy === 'total_desc') return (Number(b.totalAmount) || 0) - (Number(a.totalAmount) || 0);
      if (sortBy === 'total_asc') return (Number(a.totalAmount) || 0) - (Number(b.totalAmount) || 0);
      return 0;
    });
  }, [orders, searchTerm, filterOrderStatus, filterPaymentStatus, filterPaymentMethod, filterShippingMethod, sortBy]);

  // 3. Paginated Data
  const totalItems = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilterOrderStatus('ALL');
    setFilterPaymentStatus('ALL');
    setFilterDateRange('ALL');
    setFilterPaymentMethod('ALL');
    setFilterShippingMethod('ALL');
    setSortBy('newest');
    setCurrentPage(1);
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedIds.length === paginatedOrders.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedOrders.map(o => o.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Khách hàng', 'SĐT', 'Email', 'Địa chỉ', 'Phương thức', 'Tổng tiền', 'Thanh toán', 'Trạng thái'];
    const rows = filteredOrders.map(o => [
      `"${o.orderId || o.id}"`,
      `"${o.customerName || ''}"`,
      `"${o.customerPhone || ''}"`,
      `"${o.customerEmail || ''}"`,
      `"${(o.shippingAddress || '').replace(/"/g, '""')}"`,
      `"${o.paymentMethod || ''}"`,
      o.totalAmount || 0,
      `"${o.paymentStatus || 'PENDING'}"`,
      `"${o.orderStatus || 'PROCESSING'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF'
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `don_hang_nat_computer_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fulfillment determination helper
  const getFulfillmentInfo = (orderStatus) => {
    const s = String(orderStatus || '').toUpperCase();
    if (['DELIVERED', 'COMPLETED'].includes(s)) {
      return { label: 'Fulfilled', class: 'ful-done', text: 'Đã hoàn tất' };
    }
    if (['SHIPPING', 'PACKED'].includes(s)) {
      return { label: 'In Progress', class: 'ful-prog', text: 'Đang giao nhận' };
    }
    if (['CANCELLED', 'RETURNED'].includes(s)) {
      return { label: 'Cancelled', class: 'ful-cancel', text: 'Đã hủy/hoàn' };
    }
    return { label: 'Unfulfilled', class: 'ful-unful', text: 'Chờ đóng gói' };
  };

  return (
    <div className="orders-management-view">
      {/* PAGE HEADER */}
      <div className="orders-page-header">
        <div className="header-left">
          <h2>Orders</h2>
          <p className="subtitle">Manage customer orders, payments and fulfillment</p>
        </div>

        <div className="header-actions">
          {onSimulateOrder && (
            <button
              type="button"
              className="btn-header-secondary"
              onClick={onSimulateOrder}
              title="Tạo đơn hàng demo mô phỏng khách mua PC Gaming"
            >
              <Sparkles size={15} color="#4f46e5" /> Mô Phỏng Đơn Mới (Demo)
            </button>
          )}

          <button
            type="button"
            className="btn-header-secondary"
            onClick={onSyncOrders}
            disabled={isLoading}
            title="Đồng bộ dữ liệu đơn hàng mới nhất"
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} /> Đồng bộ
          </button>

          <button
            type="button"
            className="btn-header-primary"
            onClick={handleExportCSV}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* SUMMARY KPI CARDS (7 CARDS) */}
      <div className="orders-summary-cards-grid">
        {/* Card 1: All Orders */}
        <div
          className={`summary-order-card ${filterOrderStatus === 'ALL' && filterPaymentStatus === 'ALL' ? 'active-card' : ''}`}
          onClick={() => { setFilterOrderStatus('ALL'); setFilterPaymentStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">All Orders</span>
            <span className="card-icon ic-blue"><ShoppingBag size={16} /></span>
          </div>
          <div className="card-number">{summaryMetrics.all}</div>
          <div className="card-sub">{currencyFormatter(summaryMetrics.totalRevenue)}</div>
        </div>

        {/* Card 2: Pending Payment */}
        <div
          className={`summary-order-card ${filterPaymentStatus === 'UNPAID' ? 'active-card' : ''}`}
          onClick={() => { setFilterPaymentStatus('UNPAID'); setFilterOrderStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">Pending Payment</span>
            <span className="card-icon ic-amber"><CreditCard size={16} /></span>
          </div>
          <div className="card-number text-amber">{summaryMetrics.pendingPay}</div>
          <div className="card-sub">Chờ khách chuyển khoản</div>
        </div>

        {/* Card 3: Processing */}
        <div
          className={`summary-order-card ${filterOrderStatus === 'PROCESSING_GROUP' ? 'active-card' : ''}`}
          onClick={() => { setFilterOrderStatus('PROCESSING_GROUP'); setFilterPaymentStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">Processing</span>
            <span className="card-icon ic-indigo"><Clock size={16} /></span>
          </div>
          <div className="card-number text-indigo">{summaryMetrics.processing}</div>
          <div className="card-sub">Đang test & ráp máy</div>
        </div>

        {/* Card 4: Shipping */}
        <div
          className={`summary-order-card ${filterOrderStatus === 'SHIPPING_GROUP' ? 'active-card' : ''}`}
          onClick={() => { setFilterOrderStatus('SHIPPING_GROUP'); setFilterPaymentStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">Shipping</span>
            <span className="card-icon ic-blue"><Truck size={16} /></span>
          </div>
          <div className="card-number text-blue">{summaryMetrics.shipping}</div>
          <div className="card-sub">ViettelPost đang giao</div>
        </div>

        {/* Card 5: Completed */}
        <div
          className={`summary-order-card ${filterOrderStatus === 'COMPLETED_GROUP' ? 'active-card' : ''}`}
          onClick={() => { setFilterOrderStatus('COMPLETED_GROUP'); setFilterPaymentStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">Completed</span>
            <span className="card-icon ic-green"><CheckCircle2 size={16} /></span>
          </div>
          <div className="card-number text-green">{summaryMetrics.completed}</div>
          <div className="card-sub">Giao thành công</div>
        </div>

        {/* Card 6: Cancelled */}
        <div
          className={`summary-order-card ${filterOrderStatus === 'CANCELLED' ? 'active-card' : ''}`}
          onClick={() => { setFilterOrderStatus('CANCELLED'); setFilterPaymentStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">Cancelled</span>
            <span className="card-icon ic-red"><AlertCircle size={16} /></span>
          </div>
          <div className="card-number text-red">{summaryMetrics.cancelled}</div>
          <div className="card-sub">Đơn đã hủy</div>
        </div>

        {/* Card 7: Refunded */}
        <div
          className={`summary-order-card ${filterOrderStatus === 'RETURNED' ? 'active-card' : ''}`}
          onClick={() => { setFilterOrderStatus('RETURNED'); setFilterPaymentStatus('ALL'); setCurrentPage(1); }}
        >
          <div className="card-top">
            <span className="card-title">Refunded</span>
            <span className="card-icon ic-purple"><RotateCcw size={16} /></span>
          </div>
          <div className="card-number text-purple">{summaryMetrics.refunded}</div>
          <div className="card-sub">Đổi trả & hoàn tiền</div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="orders-filter-bar">
        <div className="filter-search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search Order ID, customer name, phone, email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
          {searchTerm && (
            <button type="button" className="btn-clear-search" onClick={() => setSearchTerm('')}>
              <X size={14} />
            </button>
          )}
        </div>

        <div className="filter-controls-row">
          {/* Order Status */}
          <div className="filter-item">
            <label>Order Status:</label>
            <select
              value={filterOrderStatus}
              onChange={(e) => { setFilterOrderStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Order Statuses</option>
              <option value="PENDING">Pending (Chờ duyệt)</option>
              <option value="CONFIRMED">Confirmed (Đã xác nhận)</option>
              <option value="PROCESSING">Processing (Đang ráp máy)</option>
              <option value="PACKED">Packed (Đã đóng gói)</option>
              <option value="SHIPPING">Shipping (Đang giao hàng)</option>
              <option value="DELIVERED">Delivered (Đã giao hàng)</option>
              <option value="CANCELLED">Cancelled (Đã hủy)</option>
              <option value="RETURNED">Returned (Hoàn tiền)</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="filter-item">
            <label>Payment Status:</label>
            <select
              value={filterPaymentStatus}
              onChange={(e) => { setFilterPaymentStatus(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Payment Statuses</option>
              <option value="PAID">Paid (Đã thanh toán)</option>
              <option value="UNPAID">Pending (Chờ thanh toán)</option>
              <option value="FAILED">Failed (Thất bại)</option>
              <option value="REFUNDED">Refunded (Đã hoàn tiền)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div className="filter-item">
            <label>Payment Method:</label>
            <select
              value={filterPaymentMethod}
              onChange={(e) => { setFilterPaymentMethod(e.target.value); setCurrentPage(1); }}
            >
              <option value="ALL">All Payment Methods</option>
              <option value="Chuyển Khoản">Chuyển Khoản QR MBBank</option>
              <option value="COD">Thanh Toán Khi Nhận (COD)</option>
              <option value="Thẻ">Thẻ Tín Dụng / Visa</option>
              <option value="Trả Góp">Trả Góp 0%</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="filter-item">
            <label>Sắp xếp:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="total_desc">Giá trị cao nhất</option>
              <option value="total_asc">Giá trị thấp nhất</option>
            </select>
          </div>

          {(searchTerm || filterOrderStatus !== 'ALL' || filterPaymentStatus !== 'ALL' || filterPaymentMethod !== 'ALL' || sortBy !== 'newest') && (
            <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
              Đặt lại bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* BULK ACTIONS BAR (When checked) */}
      {selectedIds.length > 0 && (
        <div className="orders-bulk-actions-dock">
          <div className="bulk-left">
            <CheckSquare size={16} />
            <span>Đã chọn <strong>{selectedIds.length}</strong> đơn hàng</span>
          </div>
          <div className="bulk-right">
            <button
              type="button"
              className="btn-bulk-item"
              onClick={() => {
                selectedIds.forEach(id => onStatusChange && onStatusChange(id, 'CONFIRMED'));
                setSelectedIds([]);
              }}
            >
              Xác Nhận Đơn Hàng
            </button>
            <button
              type="button"
              className="btn-bulk-item"
              onClick={() => {
                selectedIds.forEach(id => onStatusChange && onStatusChange(id, 'SHIPPING'));
                setSelectedIds([]);
              }}
            >
              Chuyển Sang Giao Hàng
            </button>
            <button
              type="button"
              className="btn-bulk-item"
              onClick={() => {
                selectedIds.forEach(id => onStatusChange && onStatusChange(id, 'DELIVERED'));
                setSelectedIds([]);
              }}
            >
              Đã Giao Thành Công
            </button>
            <button
              type="button"
              className="btn-bulk-cancel"
              onClick={() => setSelectedIds([])}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      {/* ORDERS DATA TABLE */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={paginatedOrders.length > 0 && selectedIds.length === paginatedOrders.length}
                  onChange={handleToggleSelectAll}
                />
              </th>
              <th>ORDER ID</th>
              <th>CUSTOMER</th>
              <th>ORDER DATE</th>
              <th>PRODUCTS</th>
              <th>TOTAL</th>
              <th>PAYMENT STATUS</th>
              <th>ORDER STATUS</th>
              <th>FULFILLMENT</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((o) => {
              const isSelected = selectedIds.includes(o.id);
              const isPaid = o.paymentStatus === 'PAID';
              const fulInfo = getFulfillmentInfo(o.orderStatus);
              const itemsCount = Array.isArray(o.items) ? o.items.length : 1;

              return (
                <tr key={o.id} className={isSelected ? 'selected-row' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(o.id)}
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="order-id-btn"
                      onClick={() => setViewingOrder(o)}
                      title="Click để xem chi tiết đơn hàng"
                    >
                      #{o.orderId || o.id}
                    </button>
                  </td>
                  <td>
                    <div className="customer-cell-col">
                      <div className="cust-name">{o.customerName || 'Khách vãng lai'}</div>
                      <div className="cust-sub">{o.customerPhone || o.customerEmail || 'N/A'}</div>
                    </div>
                  </td>
                  <td>
                    <span className="order-date-text">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
                    </span>
                  </td>
                  <td>
                    <span className="product-summary-badge">
                      <Package size={13} /> {itemsCount} sản phẩm
                    </span>
                  </td>
                  <td>
                    <span className="total-amount-strong">
                      {currencyFormatter(o.totalAmount)}
                    </span>
                  </td>
                  <td>
                    <span className={`pill-payment-status pay-${(o.paymentStatus || 'pending').toLowerCase()}`}>
                      {isPaid ? <CheckCircle2 size={12} /> : <CreditCard size={12} />}
                      {isPaid ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                  <td>
                    <select
                      className={`select-table-status status-${(o.orderStatus || 'processing').toLowerCase()}`}
                      value={o.orderStatus || 'PROCESSING'}
                      onChange={(e) => onStatusChange && onStatusChange(o.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="PACKED">Packed</option>
                      <option value="SHIPPING">Shipping</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="RETURNED">Returned</option>
                    </select>
                  </td>
                  <td>
                    <span className={`pill-fulfillment ${fulInfo.class}`}>
                      {fulInfo.text}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="table-actions-cluster">
                      {!isPaid && onConfirmPayment && (
                        <button
                          type="button"
                          className="btn-table-confirm-pay"
                          onClick={() => onConfirmPayment(o.id, o.totalAmount, o.customerName)}
                          title="Duyệt nhận tiền chuyển khoản MBBank"
                        >
                          <CheckCircle2 size={13} /> Duyệt Tiền
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => onPrintInvoice && onPrintInvoice(o)}
                        title="In Hóa Đơn & Phiếu Xuất Kho"
                      >
                        <FileText size={15} />
                      </button>
                      <button
                        type="button"
                        className="btn-table-icon"
                        onClick={() => setViewingOrder(o)}
                        title="Xem toàn bộ tiến trình đơn hàng"
                      >
                        <Eye size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedOrders.length === 0 && (
              <tr>
                <td colSpan="10" className="orders-empty-state">
                  <ShoppingBag size={36} color="#94a3b8" />
                  <h4>Không tìm thấy đơn hàng nào phù hợp</h4>
                  <p>Hãy thử điều chỉnh từ khóa tìm kiếm hoặc bấm đặt lại toàn bộ bộ lọc.</p>
                  <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
                    Đặt lại bộ lọc
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION FOOTER */}
      {totalItems > 0 && (
        <div className="orders-pagination-footer">
          <div className="page-info">
            Hiển thị <strong>{Math.min(totalItems, (currentPage - 1) * pageSize + 1)}</strong> - <strong>{Math.min(totalItems, currentPage * pageSize)}</strong> trong tổng số <strong>{totalItems}</strong> đơn hàng
          </div>

          <div className="page-controls">
            <div className="page-size-selector">
              <span>Hiển thị:</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
                <option value={10}>10 đơn / trang</option>
                <option value={20}>20 đơn / trang</option>
                <option value={50}>50 đơn / trang</option>
              </select>
            </div>

            <div className="page-nav-btns">
              <button
                type="button"
                className="btn-page-nav"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                <ChevronLeft size={16} /> Trước
              </button>
              <span className="current-page-num">{currentPage} / {totalPages}</span>
              <button
                type="button"
                className="btn-page-nav"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                Sau <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAIL DRAWER */}
      {viewingOrder && (
        <OrderDetailDrawer
          order={viewingOrder}
          isOpen={Boolean(viewingOrder)}
          onClose={() => setViewingOrder(null)}
          onConfirmPayment={onConfirmPayment}
          onUpdateStatus={onStatusChange}
          onPrintInvoice={onPrintInvoice}
          currencyFormatter={currencyFormatter}
        />
      )}
    </div>
  );
}
