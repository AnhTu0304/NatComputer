import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

jest.mock('../services/api', () => ({
  getAdminOrders: jest.fn().mockResolvedValue({
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
        items: []
      }
    ]
  }),
  getProducts: jest.fn().mockResolvedValue({ products: [] }),
  getAdminStats: jest.fn().mockResolvedValue({
    totalRevenue: 34990000,
    totalOrders: 1,
    totalProducts: 5,
    totalUsers: 3782,
    processingOrders: 1,
    completedOrders: 0
  }),
  getAdminCategories: jest.fn().mockResolvedValue({ categories: [] }),
  getAdminBanners: jest.fn().mockResolvedValue({ banners: [] }),
  getAdminUsers: jest.fn().mockResolvedValue({ users: [] }),
  getAdminNotifications: jest.fn().mockResolvedValue({ notifications: [] }),
  getAdminPayments: jest.fn().mockResolvedValue({ payments: [] }),
  updateOrderStatus: jest.fn().mockResolvedValue({ message: 'Success' })
}));

describe('AdminPage (TailAdmin Layout)', () => {
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
});
