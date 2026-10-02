import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CustomerTrustSection from './CustomerTrustSection';

describe('CustomerTrustSection', () => {
  test('renders 4 trust pillars correctly', () => {
    render(<CustomerTrustSection />);

    expect(screen.getByText('GIAO HÀNG TOÀN QUỐC')).toBeInTheDocument();
    expect(screen.getByText('ĐỔI TRẢ DỄ DÀNG')).toBeInTheDocument();
    expect(screen.getByText('THANH TOÁN TIỆN LỢI')).toBeInTheDocument();
    expect(screen.getByText('HỖ TRỢ NHIỆT TÌNH')).toBeInTheDocument();
  });

  test('renders 5 customer commitment policy accordion items matching Image 2', () => {
    render(<CustomerTrustSection />);

    expect(screen.getByText(/Trải nghiệm mua sắm tại NAT COMPUTER/i)).toBeInTheDocument();
    expect(screen.getByText(/Cam Kết 100%/i)).toBeInTheDocument();

    expect(screen.getByText(/1. Liên hệ chăm sóc khách hàng dễ dàng/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Giao hàng nhanh trong 2 giờ mà không thu thêm phí/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Miễn phí lên đời và trải nghiệm sản phẩm trong vòng 15 ngày/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Cam kết thu cũ đổi mới trọn đời/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Cho mượn sản phẩm miễn phí thay thế trong thời gian bảo hành/i)).toBeInTheDocument();
  });

  test('toggles accordion item and closes previous item when a new item is clicked (single-active accordion)', () => {
    render(<CustomerTrustSection />);

    const item1Btn = screen.getByRole('button', { name: /1. Liên hệ chăm sóc khách hàng dễ dàng/i });
    const item2Btn = screen.getByRole('button', { name: /2. Giao hàng nhanh trong 2 giờ mà không thu thêm phí/i });

    // Open item 1
    fireEvent.click(item1Btn);
    expect(item1Btn).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/Quý khách có thể liên hệ trực tiếp qua Hotline 088.697.6868/i)).toBeInTheDocument();

    // Click item 2 -> Item 1 should close, Item 2 should open
    fireEvent.click(item2Btn);
    expect(item2Btn).toHaveAttribute('aria-expanded', 'true');
    expect(item1Btn).toHaveAttribute('aria-expanded', 'false');
    expect(screen.getByText(/Áp dụng cho mọi đơn hàng máy tính PC và linh kiện/i)).toBeInTheDocument();

    // Click item 2 again -> Item 2 should close
    fireEvent.click(item2Btn);
    expect(item2Btn).toHaveAttribute('aria-expanded', 'false');
  });
});
