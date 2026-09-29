import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProfilePage from './ProfilePage';
import addressService from '../services/addressService';

jest.mock('../services/addressService', () => ({
  getProvinces: jest.fn(),
  getCommunes: jest.fn()
}));

describe('ProfilePage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    addressService.getProvinces.mockResolvedValue([
      { code: '01', name: 'Thành phố Hà Nội' },
      { code: '79', name: 'Thành phố Hồ Chí Minh' },
      { code: '48', name: 'Thành phố Đà Nẵng' }
    ]);
    addressService.getCommunes.mockResolvedValue([
      { code: '01_1', name: 'Phường Dịch Vọng', administrativeLevel: 'Phường' },
      { code: '01_2', name: 'Phường Cầu Giấy', administrativeLevel: 'Phường' }
    ]);
  });

  test('renders form with empty fields for new user instead of hardcoded mock data', async () => {
    const mockUser = {
      id: 'usr_test_1',
      name: 'Tú Ngô',
      email: 'tungo342005@gmail.com',
      // User has not set custom profile info yet
      phone: '0886976868' // Mock phone that should be cleaned
    };

    render(
      <MemoryRouter>
        <ProfilePage user={mockUser} />
      </MemoryRouter>
    );

    // Verify Name & Email are present from account
    expect(screen.getByDisplayValue('Tú Ngô')).toBeInTheDocument();
    expect(screen.getByDisplayValue('tungo342005@gmail.com')).toBeInTheDocument();

    // Verify Phone is EMPTY by default (not hardcoded mock phone)
    const phoneInput = screen.getByPlaceholderText(/Nhập số điện thoại/i);
    expect(phoneInput.value).toBe('');

    // Verify Address is EMPTY by default (not hardcoded mock address)
    const addressInput = screen.getByPlaceholderText(/Nhập số nhà, tên đường/i);
    expect(addressInput.value).toBe('');

    // Verify Selects have empty default placeholder
    expect(screen.getByText(/-- Chọn giới tính --/i)).toBeInTheDocument();
    expect(await screen.findByText(/Thành phố Hà Nội/i)).toBeInTheDocument();
  });

  test('fetches communes dynamically when user selects a province', async () => {
    const mockUser = {
      id: 'usr_test_2',
      name: 'Tú Ngô',
      email: 'tungo342005@gmail.com'
    };

    render(
      <MemoryRouter>
        <ProfilePage user={mockUser} />
      </MemoryRouter>
    );

    // Wait for provinces to load
    expect(await screen.findByText(/Thành phố Hà Nội/i)).toBeInTheDocument();

    // Select province "Thành phố Hà Nội"
    const citySelect = screen.getByRole('combobox', { name: /Tỉnh \/ Thành phố/i });
    fireEvent.change(citySelect, { target: { value: 'Thành phố Hà Nội' } });

    // Verify addressService.getCommunes was called with province code '01'
    await waitFor(() => {
      expect(addressService.getCommunes).toHaveBeenCalledWith('01');
    });

    // Verify communes options are populated
    expect(await screen.findByText(/Phường Dịch Vọng/i)).toBeInTheDocument();
    expect(screen.getByText(/Phường Cầu Giấy/i)).toBeInTheDocument();
  });
});
