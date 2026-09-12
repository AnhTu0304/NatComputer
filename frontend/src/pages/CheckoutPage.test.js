import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CheckoutPage from './CheckoutPage';

const mockCartItems = [
  {
    id: 'pc-1',
    name: 'NAT GAMING BEAST 4070 Ti SUPER',
    price: 45900000,
    originalPrice: 49900000,
    quantity: 1,
    image: 'test.jpg',
    specs: { cpu: 'Ryzen 7 7800X3D', gpu: 'RTX 4070 Ti SUPER' }
  }
];

const mockUserComplete = {
  name: 'Nguyễn Văn Tú',
  phone: '0987654321',
  email: 'tu.ngo@example.com',
  address: '456 Trần Duy Hưng, Hà Nội'
};

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('CheckoutPage', () => {
  test('renders auth guard when user is not logged in', () => {
    renderWithRouter(<CheckoutPage user={null} cartItems={mockCartItems} />);

    expect(screen.getByText(/Yêu Cầu Đăng Nhập Tài Khoản/i)).toBeInTheDocument();
    expect(screen.getByText(/Đăng Nhập \/ Đăng Ký Ngay/i)).toBeInTheDocument();
  });

  test('renders profile incomplete guard when user missing phone or address', () => {
    const incompleteUser = { name: 'Nguyễn Văn Tú', email: 'tu@example.com' };
    renderWithRouter(<CheckoutPage user={incompleteUser} cartItems={mockCartItems} />);

    expect(screen.getByText(/Cần Cập Nhật Thông Tin Giao Hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Cập Nhật Thông Tin Profile/i)).toBeInTheDocument();
  });

  test('renders empty cart guard when cart is empty', () => {
    renderWithRouter(<CheckoutPage user={mockUserComplete} cartItems={[]} />);

    expect(screen.getByText(/Giỏ Hàng Của Bạn Đang Trống/i)).toBeInTheDocument();
  });

  test('renders checkout page with products, specs and payment methods when user and cart are valid', () => {
    renderWithRouter(<CheckoutPage user={mockUserComplete} cartItems={mockCartItems} />);

    expect(screen.getByText(/XÁC NHẬN & THANH TOÁN ĐƠN HÀNG/i)).toBeInTheDocument();
    expect(screen.getByText(/NAT GAMING BEAST 4070 Ti SUPER/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Ví MoMo/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Ví ZaloPay/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Chuyển khoản Ngân hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/Thanh toán khi nhận hàng \(COD\)/i)).toBeInTheDocument();
  });

  test('allows changing payment method', () => {
    renderWithRouter(<CheckoutPage user={mockUserComplete} cartItems={mockCartItems} />);

    const codOption = screen.getByLabelText(/Thanh toán khi nhận hàng \(COD\)/i);
    fireEvent.click(codOption);

    expect(codOption.checked).toBe(true);
  });
});
