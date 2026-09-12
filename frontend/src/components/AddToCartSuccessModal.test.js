import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddToCartSuccessModal from './AddToCartSuccessModal';

describe('AddToCartSuccessModal', () => {
  test('renders success message when open', () => {
    render(<AddToCartSuccessModal isOpen={true} onClose={jest.fn()} />);

    expect(screen.getByText(/Thêm sản phẩm vào giỏ hàng/i)).toBeInTheDocument();
    expect(screen.getByText(/thành công!/i)).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(<AddToCartSuccessModal isOpen={false} onClose={jest.fn()} />);

    expect(container.firstChild).toBeNull();
  });

  test('calls onClose when overlay is clicked', () => {
    const onClose = jest.fn();
    const { container } = render(<AddToCartSuccessModal isOpen={true} onClose={onClose} />);

    const overlay = container.querySelector('.cart-success-overlay');
    fireEvent.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
