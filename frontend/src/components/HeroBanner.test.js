import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HeroBanner from '../components/HeroBanner';

describe('HeroBanner', () => {
  test('renders heading and description', () => {
    render(
      <MemoryRouter>
        <HeroBanner />
      </MemoryRouter>
    );
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('BUILD PC');
    expect(screen.getAllByText(/TƯ VẤN/i).length).toBeGreaterThan(0);
  });

  test('renders CTA links pointing to /build and /ai', () => {
    render(
      <MemoryRouter>
        <HeroBanner />
      </MemoryRouter>
    );
    const buildLink = screen.getByRole('link', { name: /BUILD PC 3D NGAY/i });
    const aiLink = screen.getByRole('link', { name: /NHẬN TƯ VẤN AI/i });
    expect(buildLink).toHaveAttribute('href', '/build');
    expect(aiLink).toHaveAttribute('href', '/ai');
  });

  test('does not render a 3D canvas — intro only', () => {
    render(
      <MemoryRouter>
        <HeroBanner />
      </MemoryRouter>
    );
    expect(screen.queryByTestId('three-d-canvas')).not.toBeInTheDocument();
  });
});