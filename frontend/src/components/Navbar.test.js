import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../components/Navbar';

describe('Navbar', () => {
  test('logo links to homepage "/"', () => {
    render(
      <MemoryRouter initialEntries={['/ai']}>
        <Navbar />
      </MemoryRouter>
    );
    const logoLink = screen.getByRole('link', { name: /NAT COMPUTER/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });
});