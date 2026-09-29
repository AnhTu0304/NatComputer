import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
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

  test('renders full Inventory Dashboard with 6 overview cards, charts, tabs, and opens adjustment modal', async () => {
    const { fireEvent } = require('@testing-library/react');
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    // Click Inventory tab
    const inventoryTab = await screen.findByText(/Tổng quan kho hàng/i);
    fireEvent.click(inventoryTab);

    // Verify 6 Overview Cards
    expect(await screen.findByText(/Real-time stock levels, warehouse distribution/i)).toBeInTheDocument();
    expect(screen.getByText('Total Products')).toBeInTheDocument();
    expect(screen.getByText('Total Stock Units')).toBeInTheDocument();
    expect(screen.getAllByText('Low Stock')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Out of Stock')[0]).toBeInTheDocument();
    expect(screen.getByText('Inventory Value')).toBeInTheDocument();
    expect(screen.getByText('Stock Movement Today')).toBeInTheDocument();

    // Verify Tab switching: Stock Movement History
    const movementsTab = screen.getByText(/Nhật Ký Biến Động Kho/i);
    fireEvent.click(movementsTab);
    expect((await screen.findAllByText(/LOẠI BIẾN ĐỘNG/i))[0]).toBeInTheDocument();
    expect(screen.getByText('Purchase')).toBeInTheDocument();

    // Verify Tab switching: Low Stock Restock
    const lowStockTab = screen.getByText(/Cảnh Báo Nhập Hàng/i);
    fireEvent.click(lowStockTab);
    expect(await screen.findByText(/LINH KIỆN CẦN NHẬP/i)).toBeInTheDocument();
    expect((await screen.findAllByText(/ĐỀ XUẤT ĐẶT THÊM/i))[0]).toBeInTheDocument();

    // Open Add Stock Modal
    const addStockBtn = screen.getByText(/\+ Add Stock/i);
    fireEvent.click(addStockBtn);
    expect(await screen.findByText(/Nghiệp Vụ Kho Linh Kiện \(Inventory Action\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Xác Nhận Lưu Kho/i)).toBeInTheDocument();
  });

  test('renders full Customer Management dashboard with 5 KPI cards, table, search, and opens detail drawer', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const customersNavBtn = await screen.findByRole('button', { name: /Khách Hàng \(Customers\)/i });
    fireEvent.click(customersNavBtn);

    // Verify Header & 5 KPI cards
    expect(await screen.findByText(/Khách Hàng \(Customer Management\)/i)).toBeInTheDocument();
    expect(screen.getByText('TOTAL CUSTOMERS')).toBeInTheDocument();
    expect(screen.getByText('NEW CUSTOMERS (30D)')).toBeInTheDocument();
    expect(screen.getByText('RETURNING CUSTOMERS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE CUSTOMERS')).toBeInTheDocument();
    expect(screen.getByText('CUSTOMER LIFETIME VALUE (CLV)')).toBeInTheDocument();

    // Verify Customer Table items
    expect(screen.getByText('Nguyễn Tuấn Dũng')).toBeInTheDocument();
    expect(screen.getByText('Trần Minh Quang')).toBeInTheDocument();

    // Verify Privacy Toggle button
    const privacyBtn = screen.getByText(/Che Bảo Mật \(Privacy\)|Hiện SĐT\/Email/i);
    expect(privacyBtn).toBeInTheDocument();

    // Click to Open Customer Detail Drawer
    const detailBtns = screen.getAllByRole('button', { name: /Chi tiết/i });
    fireEvent.click(detailBtns[0]);

    // Verify Drawer content
    expect((await screen.findAllByText(/Hồ Sơ Khách Hàng/i))[0]).toBeInTheDocument();
    expect(screen.getByText(/Lịch Sử Đơn Hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Dòng Hoạt Động \(Activity Timeline\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Ghi Chú Kỹ Thuật \/ CSKH/i)).toBeInTheDocument();
    expect(screen.getByText(/Quản Trị & Bảo Mật/i)).toBeInTheDocument();

    // Switch to Notes Tab
    const notesTab = screen.getByText(/Ghi Chú Kỹ Thuật \/ CSKH/i);
    fireEvent.click(notesTab);
    expect(await screen.findByText(/Thêm Ghi Chú Khách Hàng/i)).toBeInTheDocument();

    // Switch to Admin & Security Actions Tab
    const actionsTab = screen.getByText(/Quản Trị & Bảo Mật/i);
    fireEvent.click(actionsTab);
    expect(await screen.findByText(/Đặt Lại Mật Khẩu/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Tạm Khóa Tài Khoản/i)[0]).toBeInTheDocument();
  });

  test('renders full Promotions & Discounts dashboard with 5 KPI cards, table, and opens builder with Live Preview', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const promoNavBtn = await screen.findByRole('button', { name: /Khuyến Mãi & Voucher/i });
    fireEvent.click(promoNavBtn);

    // Verify Header & 5 KPI cards
    expect(await screen.findByText(/Khuyến Mãi & Giảm Giá \(Promotions & Discounts\)/i)).toBeInTheDocument();
    expect(screen.getByText('ACTIVE PROMOTIONS')).toBeInTheDocument();
    expect(screen.getByText('SCHEDULED PROMOTIONS')).toBeInTheDocument();
    expect(screen.getByText('EXPIRED PROMOTIONS')).toBeInTheDocument();
    expect(screen.getByText('TOTAL DISCOUNT AMOUNT')).toBeInTheDocument();
    expect(screen.getByText('PROMOTION REVENUE')).toBeInTheDocument();

    // Verify promotion codes & items
    expect(screen.getByText('PCGAMING10')).toBeInTheDocument();
    expect(screen.getByText('FREESHIPPC')).toBeInTheDocument();

    // Open Create Promotion Modal
    const createPromoBtn = screen.getByRole('button', { name: /\+ Tạo Khuyến Mãi Mới/i });
    fireEvent.click(createPromoBtn);

    // Verify Modal & Live Customer Voucher Preview
    expect(await screen.findByText(/GIAO DIỆN KHÁCH HÀNG \(LIVE PREVIEW\)/i)).toBeInTheDocument();
    expect(screen.getByText('LIVE SIMULATOR')).toBeInTheDocument();
    expect(screen.getByText(/Kích Hoạt Chương Trình/i)).toBeInTheDocument();
  });

  test('renders full Returns & Warranty dashboard with 7 KPI cards, table, and opens RMA drawer with workflow', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const warrantyNavBtn = await screen.findByRole('button', { name: /Bảo Hành & Đổi Trả/i });
    fireEvent.click(warrantyNavBtn);

    // Verify Header & 7 KPI cards
    expect(await screen.findByText(/Tiếp Nhận Bảo Hành & Đổi Trả Linh Kiện \(Returns & Warranty RMA\)/i)).toBeInTheDocument();
    expect(screen.getByText('OPEN REQUESTS')).toBeInTheDocument();
    expect(screen.getByText('PENDING REVIEW')).toBeInTheDocument();
    expect(screen.getByText('APPROVED')).toBeInTheDocument();
    expect(screen.getByText('REJECTED')).toBeInTheDocument();
    expect(screen.getByText('IN REPAIR')).toBeInTheDocument();
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('REFUNDED')).toBeInTheDocument();

    // Verify Table content & Serial Numbers
    expect(screen.getByText('SN-RTX5070TI-891024')).toBeInTheDocument();
    expect(screen.getByText('Hoàng Minh Quân')).toBeInTheDocument();

    // Open RMA Detail Drawer
    const rmaBtns = screen.getAllByRole('button', { name: /Xử lý RMA/i });
    fireEvent.click(rmaBtns[0]);

    // Verify Drawer Workflow Stepper and Tabs
    expect(await screen.findByText(/Nhật Ký Truy Vết \(Traceability Timeline\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Chi Tiết Linh Kiện & Bảo Hành/i)).toBeInTheDocument();
    expect(screen.getByText(/Ảnh Khách Gửi & Tem Niêm Phong/i)).toBeInTheDocument();
    expect(screen.getByText(/Ghi Chú Kỹ Thuật/i)).toBeInTheDocument();
  });

  test('renders full Admin Management & RBAC dashboard with 4 KPI cards, admin table, and interactive permission matrix', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const adminNavBtn = await screen.findByRole('button', { name: /Quản Trị Viên & Phân Quyền/i });
    fireEvent.click(adminNavBtn);

    // Verify Header & 4 KPI cards
    expect(await screen.findByText(/Quản Trị Viên & Phân Quyền Vai Trò \(Admin Management & RBAC\)/i)).toBeInTheDocument();
    expect(screen.getByText('TOTAL ADMINS')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE SESSIONS')).toBeInTheDocument();
    expect(screen.getByText('SUPER ADMINS')).toBeInTheDocument();
    expect(screen.getByText('DEFAULT ROLES')).toBeInTheDocument();

    // Verify Admin Table items & Master protection
    expect(screen.getByText(/Ngô Anh Tú/i)).toBeInTheDocument();
    expect(screen.getByText(/Trần Văn Kho/i)).toBeInTheDocument();
    expect(screen.getByText(/👑 Master/i)).toBeInTheDocument();

    // Verify Table Headers
    expect(screen.getByText('QUẢN TRỊ VIÊN (ADMIN)')).toBeInTheDocument();
    expect(screen.getByText('VAI TRÒ (ROLE)')).toBeInTheDocument();
    expect(screen.getByText('LẦN ĐĂNG NHẬP CUỐI')).toBeInTheDocument();

    // Open Add Admin Modal
    const addAdminBtn = screen.getByRole('button', { name: /\+ Thêm Quản Trị Viên \(Add Admin\)/i });
    fireEvent.click(addAdminBtn);
    expect(await screen.findByText(/Thêm Quản Trị Viên Nội Bộ/i)).toBeInTheDocument();
    expect(screen.getByText(/Tạo Tài Khoản Quản Trị/i)).toBeInTheDocument();

    // Close Modal
    const cancelBtn = screen.getByRole('button', { name: /Hủy Bỏ/i });
    fireEvent.click(cancelBtn);

    // Switch to Permission Matrix Tab
    const matrixTabBtn = screen.getAllByRole('button', { name: /Ma Trận Phân Quyền \(Permission Matrix\)/i })[0];
    fireEvent.click(matrixTabBtn);

    // Verify Permission Matrix Table & 10 Modules
    expect(await screen.findByText(/Ma Trận Phân Quyền Theo 5 Vai Trò Mặc Định/i)).toBeInTheDocument();
    expect(screen.getByText('PHÂN HỆ (MODULE)')).toBeInTheDocument();
    expect(screen.getByText('VIEW (XEM)')).toBeInTheDocument();
    expect(screen.getByText('CREATE (THÊM)')).toBeInTheDocument();
    expect(screen.getByText('EDIT (SỬA)')).toBeInTheDocument();
    expect(screen.getByText('DELETE (XÓA)')).toBeInTheDocument();
    expect(screen.getByText('EXPORT (XUẤT FILE)')).toBeInTheDocument();

    // Check specific PC modules in matrix
    expect(screen.getByText(/Sản Phẩm & Linh Kiện PC/i)).toBeInTheDocument();
    expect(screen.getByText(/Bảo Hành & Đổi Trả \(RMA\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Quản Trị Nhân Sự & RBAC/i)).toBeInTheDocument();
  });

  test('renders full VietQR & Store Settings view with bank config, live preview, and tabs', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const settingsNavBtn = await screen.findByRole('button', { name: /Cài Đặt VietQR & Store/i });
    fireEvent.click(settingsNavBtn);

    // Verify Header & Live Napas tag
    expect(await screen.findByText(/Cài Đặt Hệ Thống & Cổng VietQR \(Store & VietQR Settings\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Napas 24\/7 Sẵn Sàng/i)).toBeInTheDocument();

    // Verify Tabs
    expect(screen.getByText(/Cổng Thanh Toán VietQR Napas/i)).toBeInTheDocument();
    expect(screen.getByText(/Thông Tin Showroom & Cửa Hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Âm Báo & Cấu Hình Vận Hành/i)).toBeInTheDocument();

    // Verify VietQR Form & Live Preview
    expect(screen.getByText(/Tài Khoản Thụ Hưởng VietQR/i)).toBeInTheDocument();
    expect(screen.getByText(/Giao Diện Quét Mã Khách Hàng \(Live Preview\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Bắn Thử Webhook Báo Có/i)).toBeInTheDocument();

    // Switch to Showroom Tab
    const showroomTab = screen.getByText(/Thông Tin Showroom & Cửa Hàng/i);
    fireEvent.click(showroomTab);
    expect(await screen.findByText(/Hồ Sơ Showroom & Doanh Nghiệp NAT Computer/i)).toBeInTheDocument();
    expect(screen.getByText(/Hotline Bán Hàng & Tư Vấn/i)).toBeInTheDocument();

    // Switch to System & Audio Tab
    const systemTab = screen.getByText(/Âm Báo & Cấu Hình Vận Hành/i);
    fireEvent.click(systemTab);
    expect(await screen.findByText(/Cấu Hình Âm Thanh & Thông Báo Vận Hành Realtime/i)).toBeInTheDocument();
    expect(screen.getByText(/Âm Thanh Báo Đơn Hàng Mới \(Web Audio Chime\)/i)).toBeInTheDocument();
  });

  test('renders Realtime Notifications Hub with 4 KPI cards, filters, and action buttons', async () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const notisNavBtn = await screen.findByRole('button', { name: /Thông Báo Realtime/i });
    fireEvent.click(notisNavBtn);

    // Verify Header & 4 KPI cards
    expect(await screen.findByText(/Trung Tâm Thông Báo Realtime \(Notification Hub\)/i)).toBeInTheDocument();
    expect(screen.getByText('TỔNG SỐ THÔNG BÁO')).toBeInTheDocument();
    expect(screen.getByText('CHƯA ĐỌC (UNREAD)')).toBeInTheDocument();
    expect(screen.getByText('ĐƠN HÀNG MỚI (ORDERS)')).toBeInTheDocument();
    expect(screen.getByText('CẢNH BÁO KHO & RMA')).toBeInTheDocument();

    // Verify Top Action Buttons
    expect(screen.getByRole('button', { name: /Thử Chuông Báo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Đánh Dấu Tất Cả Đã Đọc/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Giả Lập Đơn Hàng Mới/i })).toBeInTheDocument();

    // Verify Filters
    expect(screen.getByPlaceholderText(/Tìm thông báo theo tiêu đề, mã đơn, khách hàng hoặc linh kiện\.\.\./i)).toBeInTheDocument();

    // Trigger Mark All Read
    const markAllBtn = screen.getByRole('button', { name: /Đánh Dấu Tất Cả Đã Đọc/i });
    fireEvent.click(markAllBtn);
    expect(await screen.findByText(/Đã đánh dấu tất cả thông báo là đã đọc!/i)).toBeInTheDocument();
  });
});



