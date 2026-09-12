import { render, screen } from '@testing-library/react';
import ShowroomSection from '../components/ShowroomSection';

describe('ShowroomSection', () => {
  test('renders section heading', () => {
    render(<ShowroomSection />);
    expect(screen.getAllByText(/SHOWROOM/i).length).toBeGreaterThan(0);
  });

  test('renders at least one showroom branch', () => {
    render(<ShowroomSection />);
    expect(screen.getAllByText(/TP\. HCM|HÀ NỘI|ĐÀ NẴNG|HẢI PHÒNG/i).length).toBeGreaterThan(0);
  });
});