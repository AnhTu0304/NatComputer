import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FloatingContactButtons from './FloatingContactButtons';

describe('FloatingContactButtons', () => {
  test('renders Messenger link with correct Facebook URL', () => {
    render(<FloatingContactButtons />);

    const messengerBtn = screen.getByTitle(/Liên hệ Facebook/i);
    expect(messengerBtn).toBeInTheDocument();
    expect(messengerBtn.getAttribute('href')).toBe('https://www.facebook.com/tu.ngo.358912');
  });

  test('opens Zalo QR Code Modal when clicking Zalo button', () => {
    render(<FloatingContactButtons />);

    const zaloBtn = screen.getByTitle(/Quét mã QR Zalo/i);
    expect(zaloBtn).toBeInTheDocument();

    fireEvent.click(zaloBtn);

    const qrImg = screen.getByAltText(/Mã QR Zalo Tú/i);
    expect(qrImg).toBeInTheDocument();
  });
});
