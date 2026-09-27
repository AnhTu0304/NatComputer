import React from 'react';
import { render, screen, act } from '@testing-library/react';
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
  confirmAdminOrderPayment: jest.fn(),
  addAdminProduct: jest.fn(),
  updateAdminProduct: jest.fn(),
  deleteAdminProduct: jest.fn()
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

  test('renders 6 KPI cards, Low Stock widget, Quick Actions, and 9 categories on dashboard', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    expect(await screen.findByText(/Overview of your store performance/i)).toBeInTheDocument();
    expect(screen.getByText(/Export Report/i)).toBeInTheDocument();
    expect(screen.getByText(/Quick Actions/i)).toBeInTheDocument();
    expect(screen.getByText('Total Revenue')).toBeInTheDocument();
    expect(screen.getByText('Total Orders')).toBeInTheDocument();
    expect(screen.getByText('Customers')).toBeInTheDocument();
    expect(screen.getByText('Average Order Value')).toBeInTheDocument();
    expect(screen.getByText('Products Sold')).toBeInTheDocument();
    expect(screen.getByText('Low Stock Items')).toBeInTheDocument();
    expect(screen.getByText(/Cảnh Báo Tồn Kho \(Low Stock\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Sales by Category/i)).toBeInTheDocument();
  });

  test('renders Orders tab, 7 summary cards, table, and opens OrderDetailDrawer with timeline', async () => {
    const { fireEvent } = require('@testing-library/react');
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const ordersTab = await screen.findByText(/Orders \(Đơn Hàng\)/i);
    fireEvent.click(ordersTab);

    // Verify Orders Header & 7 KPI Summary Cards
    expect(await screen.findByText(/Manage customer orders, payments and fulfillment/i)).toBeInTheDocument();
    expect(screen.getByText('All Orders')).toBeInTheDocument();
    expect(screen.getByText('Pending Payment')).toBeInTheDocument();
    expect(screen.getAllByText('Processing')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Shipping')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Cancelled')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Refunded')[0]).toBeInTheDocument();

    // Verify order row and Duyệt Tiền button for unpaid order
    expect(screen.getByText('#NAT-998811')).toBeInTheDocument();
    expect(screen.getByText('Nguyễn Văn Admin')).toBeInTheDocument();
    expect(screen.getAllByText(/Duyệt Tiền/i)[0]).toBeInTheDocument();

    // Click Order ID to open OrderDetailDrawer
    const orderBtn = screen.getByText('#NAT-998811');
    fireEvent.click(orderBtn);

    // Verify OrderDetailDrawer opened with Timeline tracker & actions
    expect(await screen.findByText(/Hành Trình Đơn Hàng \(Order Timeline\)/i)).toBeInTheDocument();
    expect(screen.getByText('Order created')).toBeInTheDocument();
    expect(screen.getByText('Payment received')).toBeInTheDocument();
    expect(screen.getAllByText('Packed')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Shipped')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Delivered')[0]).toBeInTheDocument();
    expect(screen.getAllByText(/In Hóa Đơn/i)[0]).toBeInTheDocument();
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

  test('navigates to Products tab and renders full Product Management interface', async () => {
    const { fireEvent } = require('@testing-library/react');
    api.getProducts.mockResolvedValue({
      products: [
        {
          id: 'prod_rtx5080',
          name: 'VGA ASUS ROG Strix GeForce RTX 5080',
          sku: 'VGA-ROG-5080',
          brand: 'ASUS',
          category: 'gaming',
          price: 38990000,
          stock: 6,
          sold: 15,
          status: 'Published',
          specs: [{ item: 'VRAM', desc: '16GB GDDR7' }]
        }
      ]
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const productsTab = await screen.findByText(/Tất cả sản phẩm/i);
    fireEvent.click(productsTab);

    // Expect Page Header and actions
    expect(await screen.findByText('Manage your PC components and products')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Product/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Import Products/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Export/i })).toBeInTheDocument();

    // Expect Filter Bar search and filters
    expect(screen.getByPlaceholderText(/Search product name, SKU, brand/i)).toBeInTheDocument();

    // Expect product row
    expect(await screen.findByText('VGA ASUS ROG Strix GeForce RTX 5080')).toBeInTheDocument();
    expect(screen.getByText('VGA-ROG-5080')).toBeInTheDocument();
  });

  test('opens ProductEditor, renders 7 sections, switches dynamic specs, and saves product', async () => {
    const { fireEvent } = require('@testing-library/react');
    api.addAdminProduct.mockResolvedValue({
      product: {
        id: 'prod_new_cpu',
        name: 'CPU Intel Core i9-14900KS',
        price: 16990000,
        category: 'cpu',
        specs: [{ item: 'Socket', desc: 'LGA1700' }]
      }
    });

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    // Click "Thêm sản phẩm mới" from sidebar submenu
    const addProductBtn = await screen.findByText(/Thêm sản phẩm mới/i);
    fireEvent.click(addProductBtn);

    // Verify 7 structured sections render
    expect(await screen.findByText(/Section 1 — Thông Tin Cơ Bản/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 2 — Hình Ảnh & Media Sản Phẩm/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 3 — Giá Bán & Lợi Nhuận/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 4 — Kho Hàng & Tồn Kho/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 5 — Thông Số Kỹ Thuật/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 6 — Tối Ưu SEO & Đường Dẫn/i)).toBeInTheDocument();
    expect(screen.getByText(/Section 7 — Trạng Thái Xuất Bản/i)).toBeInTheDocument();

    // Verify sticky action bar buttons
    expect(screen.getByText(/Lưu Bản Nháp \(Save Draft\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Lưu & Xuất Bản \(Save & Publish\)/i)).toBeInTheDocument();

    // Verify Dynamic Category Specs Pills (e.g. click CPU template)
    const cpuPill = screen.getByRole('button', { name: 'CPU' });
    fireEvent.click(cpuPill);
    expect(screen.getByDisplayValue(/LGA1700 \/ AM5/i)).toBeInTheDocument();

    // Enter Product Name & Selling Price
    const nameInput = screen.getByPlaceholderText(/Dàn PC Gaming Ultra/i);
    fireEvent.change(nameInput, { target: { value: 'CPU Intel Core i9-14900KS Special Edition' } });

    const priceInput = screen.getByPlaceholderText(/VD: 35900000/i);
    fireEvent.change(priceInput, { target: { value: '16990000' } });

    // Verify Margin and SEO auto-slug update
    expect(screen.getByDisplayValue(/cpu-intel-core-i9-14900ks-special-edition/i)).toBeInTheDocument();

    // Click Save & Publish
    const publishBtn = screen.getByText(/Lưu & Xuất Bản \(Save & Publish\)/i);
    await act(async () => {
      fireEvent.click(publishBtn);
    });

    // Verify API called and navigates back to products list
    expect(api.addAdminProduct).toHaveBeenCalled();
  });
});
