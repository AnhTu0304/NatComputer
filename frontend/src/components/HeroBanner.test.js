import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';

describe('HeroBanner', () => {
  test('renders main promotional hero title and quick category buttons', () => {
    render(
      <MemoryRouter>
        <HeroBanner />
      </MemoryRouter>
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('NAT COMPUTER');
    expect(screen.getByText(/FREESHIP TOÀN QUỐC/i)).toBeInTheDocument();
    expect(screen.getByText('PC WORKSTATION 2D 3D')).toBeInTheDocument();
  });

  test('renders CTA links pointing to /build and /hotsale', () => {
    render(
      <MemoryRouter>
        <HeroBanner />
      </MemoryRouter>
    );
    const buildLink = screen.getByRole('link', { name: /BUILD PC 3D NGAY/i });
    const dealsLink = screen.getByRole('link', { name: /SĂN DEALS HOT/i });
    expect(buildLink).toHaveAttribute('href', '/build');
    expect(dealsLink).toHaveAttribute('href', '/hotsale');
  });

  test('renders the 3 featured sub-banners (PC Gaming Giá Rẻ, Lắp Tận Nhà, Thu Cũ Đổi Mới)', () => {
    render(
      <MemoryRouter>
        <HeroBanner />
      </MemoryRouter>
    );
    expect(screen.getByText(/PC GAMING GIÁ RẺ/i)).toBeInTheDocument();
    expect(screen.getByText(/CHỐT MÁY & LẮP TẬN NHÀ/i)).toBeInTheDocument();
    expect(screen.getByText(/THU CŨ - LÊN ĐỜI DÀN PC/i)).toBeInTheDocument();
  });
});