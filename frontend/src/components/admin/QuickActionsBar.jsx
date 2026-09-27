import React from 'react';
import {
  PlusCircle,
  Cpu,
  ShoppingBag,
  Warehouse,
  Ticket,
  Zap
} from 'lucide-react';

export default function QuickActionsBar({
  onNavigateTab
}) {
  const actions = [
    {
      label: 'Thêm Sản Phẩm',
      sublabel: 'Add Product',
      icon: PlusCircle,
      color: '#4f46e5',
      bg: '#eef2ff',
      target: 'add-product'
    },
    {
      label: 'Tạo Cấu Hình PC',
      sublabel: 'Create PC Build',
      icon: Cpu,
      color: '#0891b2',
      bg: '#ecfeff',
      target: 'pc-builds'
    },
    {
      label: 'Xem Đơn Hàng',
      sublabel: 'View Orders',
      icon: ShoppingBag,
      color: '#2563eb',
      bg: '#eff6ff',
      target: 'orders'
    },
    {
      label: 'Điều Chỉnh Kho',
      sublabel: 'Adjust Inventory',
      icon: Warehouse,
      color: '#d97706',
      bg: '#fffbeb',
      target: 'inventory'
    },
    {
      label: 'Tạo Khuyến Mãi',
      sublabel: 'Create Promotion',
      icon: Ticket,
      color: '#7c3aed',
      bg: '#f5f3ff',
      target: 'promotions'
    }
  ];

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: 6,
            background: '#eef2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4f46e5'
          }}
        >
          <Zap size={16} />
        </div>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', display: 'block', lineHeight: 1.2 }}>
            Tác Vụ Nhanh (Quick Actions)
          </span>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            Lối tắt quản trị và thao tác vận hành hàng ngày
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onNavigateTab && onNavigateTab(act.target)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                border: `1px solid ${act.color}30`,
                background: act.bg,
                color: act.color,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Icon size={14} />
              <span>{act.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
