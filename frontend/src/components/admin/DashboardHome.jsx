import React from 'react';
import {
  DollarSign,
  ShoppingBag,
  Users,
  CreditCard,
  PackageCheck,
  AlertTriangle,
  Activity
} from 'lucide-react';
import KpiCard from './KpiCard';
import RevenueChart from './RevenueChart';
import CategorySalesChart from './CategorySalesChart';
import RecentOrdersTable from './RecentOrdersTable';
import LowStockWidget from './LowStockWidget';
import TopProductsTable from './TopProductsTable';

export default function DashboardHome({
  stats = {},
  orders = [],
  products = [],
  usersList = [],
  onApprovePayment,
  onViewInvoice,
  onNavigateTab,
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  // Compute Key Metrics
  const totalRevenue = stats.totalRevenue || orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 145000000;
  const totalOrdersCount = stats.totalOrders || orders.length || 28;
  const totalCustomersCount = stats.totalUsers || usersList.length || 3782;
  const aov = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 5180000;
  const productsSoldCount = stats.productsSold || 248;
  const lowStockCount = stats.lowStockCount || 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* =================================================================== */}
      {/* ROW 1: 6 KPI CARDS                                                 */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: 16
        }}
      >
        <KpiCard
          title="Tổng Doanh Thu"
          value={currencyFormatter(totalRevenue)}
          change="+18.4%"
          isPositive={true}
          comparisonText="so với tháng trước"
          icon={DollarSign}
          iconColor="#4f46e5"
        />

        <KpiCard
          title="Tổng Đơn Hàng"
          value={totalOrdersCount.toLocaleString('vi-VN')}
          change="+9.2%"
          isPositive={true}
          comparisonText="so với tháng trước"
          icon={ShoppingBag}
          iconColor="#3b82f6"
        />

        <KpiCard
          title="Tổng Khách Hàng"
          value={totalCustomersCount.toLocaleString('vi-VN')}
          change="+11.0%"
          isPositive={true}
          comparisonText="142 khách mới tuần này"
          icon={Users}
          iconColor="#10b981"
        />

        <KpiCard
          title="Giá Trị Đơn TB (AOV)"
          value={currencyFormatter(aov)}
          change="+6.5%"
          isPositive={true}
          comparisonText="cấu hình PC cao cấp"
          icon={CreditCard}
          iconColor="#8b5cf6"
        />

        <KpiCard
          title="Sản Phẩm Đã Bán"
          value={`${productsSoldCount} món`}
          change="+14.8%"
          isPositive={true}
          comparisonText="linh kiện & dàn máy"
          icon={PackageCheck}
          iconColor="#06b6d4"
        />

        <KpiCard
          title="Cảnh Báo Hết Hàng"
          value={`${lowStockCount} linh kiện`}
          change="-2 SKU"
          isPositive={false}
          comparisonText="cần tạo đơn nhập kho"
          icon={AlertTriangle}
          iconColor="#ef4444"
          badgeText="Chú ý"
        />
      </div>

      {/* =================================================================== */}
      {/* ROW 2: REVENUE CHART (65%) + CATEGORY SALES (35%)                  */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.1fr)',
          gap: 20
        }}
        className="analytics-grid-row"
      >
        <RevenueChart
          monthlySales={stats.monthlySales}
          currencyFormatter={currencyFormatter}
        />
        <CategorySalesChart
          currencyFormatter={currencyFormatter}
        />
      </div>

      {/* =================================================================== */}
      {/* ROW 2.5: MONTHLY TARGET (GAUGE) & MONTHLY SALES DISTRIBUTION        */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1.8fr)',
          gap: 20
        }}
        className="target-sales-grid-row"
      >
        {/* Monthly Target Radial Gauge Card */}
        <div className="monthly-target-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <div className="target-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Monthly Target</h4>
              <p className="target-subtext" style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>Mục tiêu doanh thu đặt ra trong tháng</p>
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#4f46e5', background: '#eef2ff', padding: '3px 8px', borderRadius: 4 }}>
              Tháng {new Date().getMonth() + 1}/2026
            </span>
          </div>

          {/* SVG Radial Gauge */}
          <div className="gauge-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <svg viewBox="0 0 200 110" className="gauge-svg" style={{ width: 190, height: 105, overflow: 'visible' }}>
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="14"
                strokeLinecap="round"
              />
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#4f46e5"
                strokeWidth="14"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (Math.min(100, stats.monthlyTargetProgress || 78.5) / 100))}
                strokeLinecap="round"
              />
            </svg>
            <div className="gauge-center-text" style={{ position: 'absolute', bottom: 10, textAlign: 'center' }}>
              <h2 className="gauge-percent" style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0f172a' }}>
                {stats.monthlyTargetProgress || 78.5}%
              </h2>
              <span className="gauge-badge" style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>
                +{stats.customerGrowth || 11.0}% tăng
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 20, paddingTop: 16, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Mục tiêu</span>
              <strong style={{ fontSize: 12, color: '#0f172a' }}>{currencyFormatter(stats.monthlyTarget || 500000000)}</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Doanh thu</span>
              <strong style={{ fontSize: 12, color: '#4f46e5' }}>{currencyFormatter(totalRevenue)}</strong>
            </div>
            <div>
              <span style={{ fontSize: 11, color: '#94a3b8', display: 'block' }}>Hôm nay</span>
              <strong style={{ fontSize: 12, color: '#10b981' }}>{currencyFormatter(stats.todayRevenue || 45900000)}</strong>
            </div>
          </div>
        </div>

        {/* Monthly Sales Breakdown Card */}
        <div className="tail-chart-card monthly-sales-card" style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px' }}>
          <div className="chart-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Monthly Sales</h4>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>Phân bố doanh số các tháng trong năm</p>
            </div>
          </div>
          <div className="bar-chart-visual">
            <div className="chart-bars-container" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 130, gap: 6, paddingTop: 10 }}>
              {(stats.monthlySales && stats.monthlySales.length > 0 ? stats.monthlySales : [
                { m: 'T1', v: 45, revenue: 145000000 },
                { m: 'T2', v: 65, revenue: 210000000 },
                { m: 'T3', v: 55, revenue: 185000000 },
                { m: 'T4', v: 80, revenue: 290000000 },
                { m: 'T5', v: 70, revenue: 240000000 },
                { m: 'T6', v: 92, revenue: 380000000 },
                { m: 'T7', v: 75, revenue: 310000000 },
                { m: 'T8', v: 88, revenue: 420000000 },
                { m: 'T9', v: 98, active: true, revenue: 495000000 },
                { m: 'T10', v: 85, revenue: 450000000 },
                { m: 'T11', v: 90, revenue: 520000000 },
                { m: 'T12', v: 100, active: true, revenue: 610000000 }
              ]).map((b, idx) => (
                <div key={idx} className="bar-col" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div className="bar-track" style={{ width: '100%', height: 95, display: 'flex', alignItems: 'flex-end', background: '#f8fafc', borderRadius: 4, overflow: 'hidden' }}>
                    <div
                      className={`bar-fill ${b.active ? 'highlight' : ''}`}
                      style={{
                        width: '100%',
                        height: `${b.v}%`,
                        background: b.active ? '#4f46e5' : '#cbd5e1',
                        borderRadius: 3,
                        transition: 'height 0.3s ease'
                      }}
                      title={`${b.m}: ${currencyFormatter(b.revenue)}`}
                    />
                  </div>
                  <span className="bar-month-lbl" style={{ fontSize: 10, color: b.active ? '#4f46e5' : '#94a3b8', fontWeight: b.active ? 700 : 500 }}>
                    {b.m}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ROW 3: RECENT ORDERS (60%) + LOW STOCK ATTENTION (40%)              */}
      {/* =================================================================== */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.7fr) minmax(0, 1.1fr)',
          gap: 20
        }}
        className="orders-inventory-grid-row"
      >
        <RecentOrdersTable
          orders={orders}
          onApprovePayment={onApprovePayment}
          onViewInvoice={onViewInvoice}
          onViewAllOrders={() => onNavigateTab && onNavigateTab('orders')}
          currencyFormatter={currencyFormatter}
        />
        <LowStockWidget
          onRestockClick={(item) => alert(`Khởi tạo phiếu nhập hàng cho linh kiện: ${item.name} (${item.sku})`)}
          onViewAllInventory={() => onNavigateTab && onNavigateTab('inventory')}
        />
      </div>

      {/* =================================================================== */}
      {/* ROW 4: TOP SELLING PRODUCTS & BUILDS TABLE                         */}
      {/* =================================================================== */}
      <div>
        <TopProductsTable
          products={products}
          currencyFormatter={currencyFormatter}
        />
      </div>

      {/* =================================================================== */}
      {/* ROW 5: RECENT SYSTEM & STORE ACTIVITIES                            */}
      {/* =================================================================== */}
      <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Activity size={16} color="#4f46e5" />
          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
            Nhật Ký Hoạt Động Cửa Hàng & Kho Vận Gần Đây
          </h4>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          {[
            { time: '10 phút trước', text: 'Khách hàng Trần Tuấn Anh đã đặt cọc dàn PC Gaming Ultra 9 qua VietQR', user: 'Hệ Thống' },
            { time: '35 phút trước', text: 'Thủ kho xác nhận xuất 2x VGA RTX 5070 Ti cho kỹ thuật lắp ráp', user: 'Admin Kho' },
            { time: '1 giờ trước', text: 'Tạo mã voucher giảm 500.000đ cho đơn hàng PC trên 20 triệu (PCGAMING2026)', user: 'Marketing' },
            { time: '2 giờ trước', text: 'Cảnh báo mức tồn kho tối thiểu: SSD Samsung 990 Pro 2TB chỉ còn 0 chiếc', user: 'Kho Tự Động' }
          ].map((act, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4f46e5' }} />
                <span style={{ color: '#1e293b' }}>{act.text}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: '#94a3b8' }}>
                <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: 4, color: '#475569' }}>{act.user}</span>
                <span>{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
