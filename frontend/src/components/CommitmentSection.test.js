import { render, screen } from '@testing-library/react';
import CommitmentSection from '../components/CommitmentSection';

describe('CommitmentSection', () => {
  test('renders section heading', () => {
    render(<CommitmentSection />);
    expect(screen.getAllByText(/CAM KẾT/i).length).toBeGreaterThan(0);
  });

  test('renders 4 commitment items', () => {
    render(<CommitmentSection />);
    expect(screen.getAllByText(/BẢO HÀNH/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ĐỔI TRẢ/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/CHÍNH HÃNG/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/GIAO/i).length).toBeGreaterThan(0);
  });
});