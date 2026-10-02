import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PcBuilderTable from './PcBuilderTable';

// Mock child components
jest.mock('./PartSelectionModal', () => {
  return function MockPartSelectionModal({ isOpen, category, onClose, onSelectPart }) {
    if (!isOpen) return null;
    return (
      <div data-testid="mock-part-modal">
        <span>Modal {category?.name}</span>
        <button onClick={() => onSelectPart(category.id, { id: 'test_cpu', name: 'Intel i9 Test', price: 10000000 })}>
          Chọn CPU Test
        </button>
        <button onClick={onClose}>Đóng</button>
      </div>
    );
  };
});

jest.mock('./BuildPrintModal', () => {
  return function MockBuildPrintModal({ isOpen }) {
    if (!isOpen) return null;
    return <div data-testid="mock-print-modal">Print Modal</div>;
  };
});

describe('PcBuilderTable Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders 9 component categories matching design', () => {
    render(<PcBuilderTable onAddToCart={jest.fn()} />);

    // Check main title
    expect(screen.getByText(/CHỌN LINH KIỆN XÂY DỰNG CẤU HÌNH/i)).toBeInTheDocument();

    // Check reset button and initial 0đ price
    expect(screen.getByText(/LÀM MỚI/i)).toBeInTheDocument();
    expect(screen.getAllByText(/0 đ/i).length).toBeGreaterThan(0);

    // Check 9 rows
    expect(screen.getByText('1. CPU')).toBeInTheDocument();
    expect(screen.getByText('2. MAINBOARD')).toBeInTheDocument();
    expect(screen.getByText('3. RAM')).toBeInTheDocument();
    expect(screen.getByText('4. CARD ĐỒ HỌA')).toBeInTheDocument();
    expect(screen.getByText('5. Ổ CỨNG')).toBeInTheDocument();
    expect(screen.getByText('6. NGUỒN (PSU)')).toBeInTheDocument();
    expect(screen.getByText('7. TẢN NHIỆT')).toBeInTheDocument();
    expect(screen.getByText('8. VỎ CASE')).toBeInTheDocument();
    expect(screen.getByText('9. MÀN HÌNH')).toBeInTheDocument();

    // Check action buttons matching photo
    expect(screen.getByRole('button', { name: /\+ Chọn CPU/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Chọn Mainboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /\+ Chọn RAM/i })).toBeInTheDocument();
  });

  test('opens part selection modal and updates total price when selecting a part', () => {
    render(<PcBuilderTable onAddToCart={jest.fn()} />);

    // Click "+ Chọn CPU" button
    const cpuBtn = screen.getByRole('button', { name: /\+ Chọn CPU/i });
    fireEvent.click(cpuBtn);

    // Modal should be opened
    expect(screen.getByTestId('mock-part-modal')).toBeInTheDocument();

    // Select the part
    fireEvent.click(screen.getByText('Chọn CPU Test'));

    // Modal should close and item should display in the table
    expect(screen.queryByTestId('mock-part-modal')).not.toBeInTheDocument();
    expect(screen.getByText('Intel i9 Test')).toBeInTheDocument();
    expect(screen.getAllByText(/10\.000\.000 đ/i).length).toBeGreaterThan(0);
  });
});
