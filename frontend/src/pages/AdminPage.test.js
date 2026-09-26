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
});
