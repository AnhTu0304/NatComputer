import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProductCard from './ProductCard';

describe('ProductCard', () => {
  const item = {
    id: 'pc-1',
    name: 'PC TTG DESIGNER -3D RENDER - EDIT VIDEO i7 14700F / 32GB DDR5 / RTX 4060Ti 8GB',
    price: 41480000,
    originalPrice: 42990000,
    image: '/images/pc1.jpg',
  };

  const onAddToCart = jest.fn();

  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  test('renders product name and formatted price', () => {
    renderWithRouter(<ProductCard item={item} onAddToCart={onAddToCart} />);
    expect(screen.getByText(item.name)).toBeInTheDocument();
    expect(screen.getByText(/41.480.000/)).toBeInTheDocument();
    expect(screen.getByText(/42.990.000/)).toBeInTheDocument();
    expect(screen.getByText(/Còn hàng/i)).toBeInTheDocument();
  });

  test('clicking add to cart triggers callback', () => {
    renderWithRouter(<ProductCard item={item} onAddToCart={onAddToCart} />);
    const btn = screen.getByRole('button', { name: /THÊM VÀO GIỎ/i });
    fireEvent.click(btn);
    expect(onAddToCart).toHaveBeenCalledWith(item);
  });
});
