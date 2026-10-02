import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
  test('renders brand information and navigation links', () => {
    render(<Footer />);
    expect(screen.getByText('NAT COMPUTER')).toBeInTheDocument();
    expect(screen.getByText('SẢN PHẨM')).toBeInTheDocument();
    expect(screen.getByText('DỊCH VỤ')).toBeInTheDocument();
    expect(screen.getByText('HỖ TRỢ')).toBeInTheDocument();
  });

  test('renders integrated showroom band with 3 branches', () => {
    render(<Footer />);
    expect(screen.getByText('HỆ THỐNG SHOWROOM NAT COMPUTER')).toBeInTheDocument();
    expect(screen.getByText('HÀ NỘI')).toBeInTheDocument();
    expect(screen.getByText('TP. HỒ CHÍ MINH')).toBeInTheDocument();
    expect(screen.getByText('ĐÀ NẴNG')).toBeInTheDocument();
  });
});
