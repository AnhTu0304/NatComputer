import React from 'react';
import { Eye, CheckCircle2, Clock, Truck, AlertCircle } from 'lucide-react';

export default function RecentOrdersTable({
  orders = [],
  onApprovePayment,
  onViewInvoice,
  onViewAllOrders,
  currencyFormatter = (v) => `${(v || 0).toLocaleString('vi-VN')} đ`
}) {
  const getPaymentBadge = (status) => {
    switch (status) {
      case 'PAID':
        return <span className="tail-badge badge-success"><CheckCircle2 size={12} style={{ display: 'inline', marginRight: 3 }} /> Đã thanh toán</span>;
      case 'UNPAID':
      case 'PENDING':
        return <span className="tail-badge badge-warning"><Clock size={12} style={{ display: 'inline', marginRight: 3 }} /> Chờ thanh toán</span>;
      case 'FAILED':
        return <span className="tail-badge badge-danger"><AlertCircle size={12} style={{ display: 'inline', marginRight: 3 }} /> Thất bại</span>;
      default:
        return <span className="tail-badge badge-secondary">{status || 'Chưa rõ'}</span>;
    }
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="tail-badge badge-success">Hoàn thành</span>;
      case 'SHIPPED':
        return <span className="tail-badge badge-info"><Truck size={12} style={{ display: 'inline', marginRight: 3 }} /> Đang giao</span>;
      case 'PROCESSING':
        return <span className="tail-badge badge-warning">Đang xử lý</span>;
      case 'CANCELLED':
        return <span className="tail-badge badge-danger">Đã hủy</span>;
      default:
        return <span className="tail-badge badge-secondary">{status || 'Mới'}</span>;
    }
  };

  return (
    <div className="tail-chart-card" style={{ padding: '20px 24px', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
            Đơn Hàng Mới Nhất
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b' }}>
            Các giao dịch máy tính và linh kiện vừa phát sinh trên hệ thống
          </p>
        </div>
        {onViewAllOrders && (
          <button
            type="button"
            className="tail-btn-subtle"
            onClick={onViewAllOrders}
            style={{ fontSize: 12, fontWeight: 600, color: '#4f46e5', background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            Xem tất cả đơn →
          </button>
        )}
      </div>

      <div className="tail-table-container" style={{ overflowX: 'auto' }}>
        <table className="tail-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '10px 12px' }}>MÃ ĐƠN</th>
              <th style={{ padding: '10px 12px' }}>KHÁCH HÀNG</th>
              <th style={{ padding: '10px 12px' }}>THỜI GIAN</th>
              <th style={{ padding: '10px 12px' }}>LINH KIỆN</th>
              <th style={{ padding: '10px 12px' }}>TỔNG TIỀN</th>
              <th style={{ padding: '10px 12px' }}>THANH TOÁN</th>
              <th style={{ padding: '10px 12px' }}>TRẠNG THÁI</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            {(!orders || orders.length === 0) ? (
              <tr>
                <td colSpan={8} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
                  Chưa có đơn hàng nào được ghi nhận.
                </td>
              </tr>
            ) : (
              orders.slice(0, 5).map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s ease' }}>
                  <td style={{ padding: '12px' }}>
                    <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontWeight: 600, color: '#4f46e5' }}>
                      #{order.id}
                    </code>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a' }}>{order.customerName || 'Khách vãng lai'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{order.customerPhone || order.customerEmail || 'Chưa cung cấp'}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#64748b', fontSize: 12 }}>
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString('vi-VN') : 'Hôm nay'}
                  </td>
                  <td style={{ padding: '12px', color: '#475569' }}>
                    {order.items ? `${order.items.length} món` : '1 bộ PC'}
                  </td>
                  <td style={{ padding: '12px', fontWeight: 700, color: '#0f172a' }}>
                    {currencyFormatter(order.totalAmount)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getPaymentBadge(order.paymentStatus)}
                  </td>
                  <td style={{ padding: '12px' }}>
                    {getOrderStatusBadge(order.orderStatus)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: 6 }}>
                      {order.paymentStatus === 'UNPAID' && onApprovePayment && (
                        <button
                          type="button"
                          className="btn-tail-edit"
                          onClick={() => onApprovePayment(order.id)}
                          style={{
                            fontSize: 11,
                            padding: '4px 8px',
                            background: '#10b981',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 4,
                            cursor: 'pointer',
                            fontWeight: 600
                          }}
                        >
                          Duyệt Tiền
                        </button>
                      )}
                      {onViewInvoice && (
                        <button
                          type="button"
                          className="btn-icon-action"
                          onClick={() => onViewInvoice(order)}
                          title="Xem & In Hóa Đơn"
                          style={{
                            padding: '4px 8px',
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#475569'
                          }}
                        >
                          <Eye size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
