import React, { useState } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function RevenueChart({
  monthlySales = [],
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const [metricMode, setMetricMode] = useState('revenue'); // 'revenue' | 'orders'
  const [timeframe, setTimeframe] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  // Default dataset if empty
  const defaultData = [
    { label: 'T1', revenue: 145000000, orders: 42 },
    { label: 'T2', revenue: 210000000, orders: 68 },
    { label: 'T3', revenue: 185000000, orders: 55 },
    { label: 'T4', revenue: 290000000, orders: 94 },
    { label: 'T5', revenue: 240000000, orders: 78 },
    { label: 'T6', revenue: 380000000, orders: 120 },
    { label: 'T7', revenue: 310000000, orders: 105 },
    { label: 'T8', revenue: 420000000, orders: 135 },
    { label: 'T9', revenue: 495000000, orders: 162 },
    { label: 'T10', revenue: 450000000, orders: 148 },
    { label: 'T11', revenue: 520000000, orders: 175 },
    { label: 'T12', revenue: 610000000, orders: 198 }
  ];

  const chartData = (monthlySales && monthlySales.length > 0)
    ? monthlySales.map((s, idx) => ({
        label: s.m || `T${idx + 1}`,
        revenue: s.revenue || (s.v ? s.v * 5000000 : 100000000),
        orders: s.orders || Math.round((s.v || 30) * 1.5)
      }))
    : defaultData;

  const currentValues = chartData.map(d => metricMode === 'revenue' ? d.revenue : d.orders);
  const maxVal = Math.max(...currentValues, 1);
  const minVal = Math.min(...currentValues, 0);

  // SVG Coordinates calculation
  const svgWidth = 800;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;
  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  const points = chartData.map((d, index) => {
    const x = paddingX + (index / (chartData.length - 1)) * usableWidth;
    const val = metricMode === 'revenue' ? d.revenue : d.orders;
    const ratio = (val - minVal) / (maxVal - minVal || 1);
    const y = svgHeight - paddingY - ratio * usableHeight;
    return { x, y, label: d.label, val, revenue: d.revenue, orders: d.orders };
  });

  const linePath = points.reduce((acc, pt, idx) => {
    if (idx === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[idx - 1];
    const cp1x = prev.x + (pt.x - prev.x) / 2;
    const cp1y = prev.y;
    const cp2x = prev.x + (pt.x - prev.x) / 2;
    const cp2y = pt.y;
    return `${acc} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`
    : '';

  const [hoveredPoint, setHoveredPoint] = useState(null);

  return (
    <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
              Statistics & Doanh Thu Đơn Hàng
            </h4>
            <span style={{ fontSize: 12, color: '#10b981', display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
              <TrendingUp size={14} /> +24.8%
            </span>
          </div>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Theo dõi dòng tiền và nhịp độ xuất kho phần cứng PC thời gian thực
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Revenue vs Orders Toggle */}
          <div className="pill-toggle-group" style={{ display: 'flex', background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
            <button
              type="button"
              className={`pill-btn ${metricMode === 'revenue' ? 'active' : ''}`}
              onClick={() => setMetricMode('revenue')}
              style={{
                border: 'none',
                background: metricMode === 'revenue' ? '#ffffff' : 'transparent',
                color: metricMode === 'revenue' ? '#4f46e5' : '#64748b',
                fontWeight: 600,
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: metricMode === 'revenue' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Doanh Thu
            </button>
            <button
              type="button"
              className={`pill-btn ${metricMode === 'orders' ? 'active' : ''}`}
              onClick={() => setMetricMode('orders')}
              style={{
                border: 'none',
                background: metricMode === 'orders' ? '#ffffff' : 'transparent',
                color: metricMode === 'orders' ? '#4f46e5' : '#64748b',
                fontWeight: 600,
                fontSize: 12,
                padding: '5px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                boxShadow: metricMode === 'orders' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Số Lượng Đơn
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="pill-toggle-group" style={{ display: 'flex', background: '#f1f5f9', padding: 3, borderRadius: 8 }}>
            {['daily', 'weekly', 'monthly'].map((tf) => (
              <button
                key={tf}
                type="button"
                className={`pill-btn ${timeframe === tf ? 'active' : ''}`}
                onClick={() => setTimeframe(tf)}
                style={{
                  border: 'none',
                  background: timeframe === tf ? '#ffffff' : 'transparent',
                  color: timeframe === tf ? '#0f172a' : '#64748b',
                  fontWeight: 600,
                  fontSize: 12,
                  padding: '5px 10px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {tf === 'daily' ? 'Ngày' : tf === 'weekly' ? 'Tuần' : 'Tháng'}
              </button>
            ))}
          </div>

          {/* Date range pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#475569', background: '#f8fafc', padding: '6px 12px', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <Calendar size={13} color="#4f46e5" />
            <span>Năm 2026 (Toàn kỳ)</span>
          </div>
        </div>
      </div>

      {/* Interactive SVG Area Chart */}
      <div style={{ position: 'relative', width: '100%', height: svgHeight, marginTop: 10 }}>
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="primaryAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal gridlines */}
          {[0, 0.33, 0.66, 1].map((ratio, i) => {
            const y = paddingY + ratio * usableHeight;
            return (
              <line
                key={i}
                x1={paddingX}
                y1={y}
                x2={svgWidth - paddingX}
                y2={y}
                stroke="#f1f5f9"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fill */}
          {areaPath && <path d={areaPath} fill="url(#primaryAreaGrad)" />}

          {/* Smooth line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#4f46e5"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}

          {/* Interactive points */}
          {points.map((pt, idx) => (
            <g key={idx}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === idx ? 6 : 4}
                fill={hoveredPoint === idx ? '#4f46e5' : '#ffffff'}
                stroke="#4f46e5"
                strokeWidth={hoveredPoint === idx ? 3 : 2}
                style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                onMouseEnter={() => setHoveredPoint(idx)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
              <text
                x={pt.x}
                y={svgHeight - 8}
                textAnchor="middle"
                fontSize="11"
                fill="#94a3b8"
                fontWeight="500"
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredPoint !== null && points[hoveredPoint] && (
          <div
            style={{
              position: 'absolute',
              top: Math.max(10, points[hoveredPoint].y - 50),
              left: `${(points[hoveredPoint].x / svgWidth) * 100}%`,
              transform: 'translateX(-50%)',
              background: '#0f172a',
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 6,
              fontSize: 11,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 10
            }}
          >
            <strong>{points[hoveredPoint].label}</strong>: {currencyFormatter(points[hoveredPoint].revenue)} ({points[hoveredPoint].orders} đơn)
          </div>
        )}
      </div>
    </div>
  );
}
