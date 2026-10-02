import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CartPage from './CartPage';

const mockCartItems = [
  {
    id: 1,
    name: 'PC GAMING ULTRA I9 / RTX 4080',
    price: 35900000,
    originalPrice: 39900000,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7'
  }
];

describe('CartPage', () => {
  test('renders empty cart state when cart has no items', () => {
    render(
      <MemoryRouter>
        <CartPage cartItems={[]} />
      </MemoryRouter>
    );
    expect(screen.getByText(/GIỎ HÀNG CỦA BẠN ĐANG TRỐNG/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /TIẾP TỤC MUA SẮM/i })).toBeInTheDocument();
  });

  test('renders buyer info form and order summary with cart items', () => {
    render(
      <MemoryRouter>
        <CartPage cartItems={mockCartItems} />
      </MemoryRouter>
    );

    // Product item
    expect(screen.getByText('PC GAMING ULTRA I9 / RTX 4080')).toBeInTheDocument();

    // Left Column: Buyer Info
    expect(screen.getByText('THÔNG TIN NGƯỜI MUA')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Nguyễn Văn A/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/0886976868/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/natcomputer@gmail.com/i)).toBeInTheDocument();

    // Right Column: Summary
    expect(screen.getByText('TỔNG TIỀN')).toBeInTheDocument();
    expect(screen.getByText(/Chọn mã voucher/i)).toBeInTheDocument();
  });

  test('renders all 5 action buttons matching Image 1', () => {
    render(
      <MemoryRouter>
        <CartPage cartItems={mockCartItems} />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /IN BÁO GIÁ/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /TẢI FILE EXCEL/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ĐẶT HÀNG/i })).toBeInTheDocument();
    expect(screen.getByText(/TRẢ GÓP QUA HỒ SƠ/i)).toBeInTheDocument();
    expect(screen.getByText(/HOME PayLater/i)).toBeInTheDocument();
  });

  test('allows entering voucher code and opens voucher modal', () => {
    render(
      <MemoryRouter>
        <CartPage cartItems={mockCartItems} />
      </MemoryRouter>
    );

    const voucherBtn = screen.getByRole('button', { name: /Chọn mã voucher/i });
    fireEvent.click(voucherBtn);
    expect(screen.getByText(/CHỌN MÃ VOUCHER ƯU ĐÃI/i)).toBeInTheDocument();
  });
});
