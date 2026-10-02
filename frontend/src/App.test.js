import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

jest.mock('./components/ThreeDCanvas', () => () => <div data-testid="three-d-canvas" />);

test('renders homepage hero banner', async () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  const heading = await screen.findByRole('heading', { level: 1 }, { timeout: 4000 });
  expect(heading.textContent).toContain('NAT COMPUTER');
});

test('renders all 4 category carousels on homepage', async () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect((await screen.findAllByText(/PC GAMING/i)).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/PC VĂN PHÒNG/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/LINH KIỆN/i).length).toBeGreaterThan(0);
  expect(screen.getAllByText(/MÀN HÌNH/i).length).toBeGreaterThan(0);
});

test('renders commitment and showroom sections on homepage', async () => {
  render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
  expect(await screen.findAllByText(/CAM KẾT/i)).toBeTruthy();
  expect(screen.getAllByText(/SHOWROOM/i).length).toBeGreaterThan(0);
});

test('renders AI page at /ai', async () => {
  render(<MemoryRouter initialEntries={['/ai']}><App /></MemoryRouter>);
  expect(await screen.findByText(/NAT AI HARDWARE ENGINE/i)).toBeInTheDocument();
});

test('renders Build page at /build', async () => {
  render(<MemoryRouter initialEntries={['/build']}><App /></MemoryRouter>);
  expect(await screen.findByText(/XÂY DỰNG CẤU HÌNH/i, {}, { timeout: 4000 })).toBeInTheDocument();
});

test('renders Hot Sale page at /hotsale', async () => {
  render(<MemoryRouter initialEntries={['/hotsale']}><App /></MemoryRouter>);
  expect((await screen.findAllByText(/DEAL GAMING BÙNG NỔ/i)).length).toBeGreaterThan(0);
});

test('renders Login page at /login', async () => {
  render(<MemoryRouter initialEntries={['/login']}><App /></MemoryRouter>);
  expect((await screen.findAllByText(/ĐĂNG NHẬP/i)).length).toBeGreaterThan(0);
});

test('redirects unknown routes to homepage', async () => {
  render(<MemoryRouter initialEntries={['/unknown']}><App /></MemoryRouter>);
  const heading = await screen.findByRole('heading', { level: 1 });
  expect(heading.textContent).toContain('NAT COMPUTER');
});