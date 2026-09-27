import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';
import api from '../services/api';

jest.mock('../services/socket', () => ({
  joinAdminRoom: jest.fn(),
  leaveAdminRoom: jest.fn(),
  onNewOrder: jest.fn().mockReturnValue(jest.fn()),
  onOrderPaymentUpdated: jest.fn().mockReturnValue(jest.fn())
}));

jest.mock('../services/api', () => ({
  getAdminOrders: jest.fn(),
  getProducts: jest.fn(),
  getAdminStats: jest.fn(),
  getAdminCategories: jest.fn(),
  getAdminBanners: jest.fn(),
  getAdminUsers: jest.fn(),
  getAdminNotifications: jest.fn(),
  getAdminPayments: jest.fn(),
  getAdminCoupons: jest.fn(),
  updateOrderStatus: jest.fn(),
  confirmAdminOrderPayment: jest.fn()
}));

describe('AdminPage (TailAdmin Layout)', () => {
  beforeEach(() => {
    api.getAdminOrders.mockResolvedValue({
      orders: [
        {
          id: 'NAT-998811',
          customerName: 'Nguyễn Văn Admin',
          customerEmail: 'admin@natcomputer.vn',
          customerPhone: '0886976868',
          shippingAddress: '123 Cầu Giấy',
          paymentMethod: 'MoMo',
          totalAmount: 34990000,
          orderStatus: 'PROCESSING',
          paymentStatus: 'UNPAID',
          items: []
        }
      ]
    });
    api.getProducts.mockResolvedValue({ products: [] });
    api.getAdminStats.mockResolvedValue({
      totalRevenue: 34990000,
      totalOrders: 1,
      totalProducts: 5,
      totalUsers: 3782,
      processingOrders: 1,
      completedOrders: 0
    });
    api.getAdminCategories.mockResolvedValue({ categories: [] });
    api.getAdminBanners.mockResolvedValue({ banners: [] });
    api.getAdminUsers.mockResolvedValue({ users: [] });
    api.getAdminNotifications.mockResolvedValue({ notifications: [] });
    api.getAdminPayments.mockResolvedValue({ payments: [] });
    api.getAdminCoupons.mockResolvedValue({ coupons: [] });
    api.updateOrderStatus.mockResolvedValue({ message: 'Success' });
    api.confirmAdminOrderPayment.mockResolvedValue({ success: true, message: 'Duyệt thành công' });
  });
  test('renders TailAdmin brand, sidebar items, and eCommerce widgets', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('TailAdmin')).toBeInTheDocument();
    expect(screen.getByText(/Monthly Target/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Sales/i)).toBeInTheDocument();
    expect(screen.getByText(/Statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Orders \(Đơn Hàng\)/i)).toBeInTheDocument();
  });

  test('renders 6 KPI cards, Low Stock widget, and category breakdown on dashboard', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(await screen.findByText('Tổng Doanh Thu')).toBeInTheDocument();
    expect(screen.getByText('Tổng Đơn Hàng')).toBeInTheDocument();
    expect(screen.getByText('Tổng Khách Hàng')).toBeInTheDocument();
    expect(screen.getByText('Giá Trị Đơn TB (AOV)')).toBeInTheDocument();
    expect(screen.getByText('Sản Phẩm Đã Bán')).toBeInTheDocument();
    expect(screen.getByText('Cảnh Báo Hết Hàng')).toBeInTheDocument();
    expect(screen.getByText(/Cảnh Báo Tồn Kho \(Low Stock\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Doanh Số Theo Danh Mục/i)).toBeInTheDocument();
  });

  test('renders Orders tab and displays Duyệt Tiền button for unpaid orders', async () => {
    const { fireEvent } = require('@testing-library/react');
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const ordersTab = await screen.findByText(/Orders \(Đơn Hàng\)/i);
    fireEvent.click(ordersTab);

    expect(await screen.findByText(/Quản Lý Đơn Hàng & Vận Chuyển Realtime/i)).toBeInTheDocument();
    expect(await screen.findByText(/Duyệt Tiền/i)).toBeInTheDocument();
    expect(await screen.findByText(/Chưa thanh toán/i)).toBeInTheDocument();
  });

  test('navigates to PC Builds, Inventory, and Warranty tabs', async () => {
    const { fireEvent } = require('@testing-library/react');
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    // PC Builds tab
    const pcBuildsTab = await screen.findByText(/Cấu hình PC Builds/i);
    fireEvent.click(pcBuildsTab);
    expect(await screen.findByText(/Quản Lý Dàn PC Builds & Cấu Hình Lắp Sẵn/i)).toBeInTheDocument();

    // Inventory tab
    const inventoryTab = await screen.findByText(/Tổng quan kho hàng/i);
    fireEvent.click(inventoryTab);
    expect(await screen.findByText(/Quản Lý Kho & Mức Tồn Linh Kiện/i)).toBeInTheDocument();

    // Warranties tab
    const warrantyTab = await screen.findByText(/Bảo Hành & Đổi Trả/i);
    fireEvent.click(warrantyTab);
    expect(await screen.findByText(/Tiếp Nhận Bảo Hành & Đổi Trả Linh Kiện/i)).toBeInTheDocument();

    // Reports tab
    const reportsTab = await screen.findByText(/Báo Cáo Doanh Thu/i);
    fireEvent.click(reportsTab);
    expect(await screen.findByText(/Báo Cáo Doanh Số & Phân Tích Tài Chính Cửa Hàng/i)).toBeInTheDocument();
  });
});
