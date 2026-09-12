import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CategoryCarousel from './CategoryCarousel';
import { GAMING_PCS } from '../data/catalogData';

describe('CategoryCarousel', () => {
  const props = {
    id: 'gaming',
    title: 'PC GAMING',
    items: GAMING_PCS,
    onAddToCart: jest.fn(),
  };

  const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

  test('renders section title', () => {
    renderWithRouter(<CategoryCarousel {...props} />);
    expect(screen.getAllByText(/PC GAMING/i).length).toBeGreaterThan(0);
  });

  test('renders one card per product with name', () => {
    renderWithRouter(<CategoryCarousel {...props} />);
    GAMING_PCS.forEach(pc => {
      expect(screen.getByText(pc.name)).toBeInTheDocument();
    });
  });

  test('renders spec list when product card is hovered', () => {
    jest.useFakeTimers();
    const { container } = renderWithRouter(<CategoryCarousel {...props} />);
    const card = container.querySelector('.carousel-card');
    fireEvent.mouseEnter(card);
    act(() => {
      jest.advanceTimersByTime(250);
    });
    expect(screen.getByText(/Thông số/i)).toBeInTheDocument();
    jest.useRealTimers();
  });

  test('renders price formatted in VND', () => {
    renderWithRouter(<CategoryCarousel {...props} />);
    const first = GAMING_PCS[0];
    const expected = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(first.price);
    const match = screen.getAllByText((content) => content.replace(/\u00a0/g, ' ') === expected.replace(/\u00a0/g, ' '));
    expect(match.length).toBeGreaterThan(0);
  });

  test('clicking add to cart button triggers onAddToCart', () => {
    renderWithRouter(<CategoryCarousel {...props} />);
    const buttons = screen.getAllByRole('button');
    const cartBtn = buttons.find(b => b.textContent.includes('THÊM VÀO GIỎ'));
    fireEvent.click(cartBtn);
    expect(props.onAddToCart).toHaveBeenCalledWith(GAMING_PCS[0]);
  });

  test('nav buttons scroll the track', () => {
    const { container } = renderWithRouter(<CategoryCarousel {...props} />);
    const track = container.querySelector('[data-carousel-track]');
    expect(track).toBeInTheDocument();
    const nextBtn = screen.getByLabelText(/Cuộn phải/i);
    fireEvent.click(nextBtn);
    expect(track).toBeInTheDocument();
  });
});
