import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PcCompareModal from './PcCompareModal';

const sampleItems = [
  {
    id: 'pc-1',
    name: 'PC GAMING ULTRA 1',
    price: 25000000,
    specs: { cpu: 'Core i5', gpu: 'RTX 4060', ram: '16GB', ssd: '512GB' },
  },
  {
    id: 'pc-2',
    name: 'PC WORKSTATION PRO 2',
    price: 45000000,
    specs: { cpu: 'Core i9', gpu: 'RTX 4080', ram: '32GB', ssd: '1TB' },
  },
];

describe('PcCompareModal', () => {
  test('renders comparison title and items table', () => {
    render(
      <PcCompareModal
        compareItems={sampleItems}
        onClose={jest.fn()}
        onRemoveItem={jest.fn()}
        onAddToCart={jest.fn()}
        onBuyNow={jest.fn()}
      />
    );

    expect(screen.getByText(/SO SÁNH CẤU HÌNH CÁC DÒNG MÁY TÍNH PC/i)).toBeInTheDocument();
    expect(screen.getByText('PC GAMING ULTRA 1')).toBeInTheDocument();
    expect(screen.getByText('PC WORKSTATION PRO 2')).toBeInTheDocument();
  });
});
