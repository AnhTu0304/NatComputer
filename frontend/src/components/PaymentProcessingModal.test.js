import React from 'react';
import { render, screen, act } from '@testing-library/react';
import PaymentProcessingModal from './PaymentProcessingModal';

jest.useFakeTimers();

describe('PaymentProcessingModal', () => {
  test('renders loading progress and step titles for momo gateway', () => {
    const onComplete = jest.fn();
    render(
      <PaymentProcessingModal
        paymentMethod="momo"
        paymentMethodLabel="Ví MoMo"
        customerEmail="tu.ngo@example.com"
        onComplete={onComplete}
      />
    );

    expect(screen.getByText(/ĐANG XỬ LÝ THANH TOÁN/i)).toBeInTheDocument();
    expect(screen.getByText(/Xác thực thông tin đơn hàng & cấu hình/i)).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onComplete).toHaveBeenCalled();
  });

  test('renders VietQR MBBank modal with account 0773071629 and NGO ANH TU', () => {
    const onComplete = jest.fn();
    render(
      <PaymentProcessingModal
        paymentMethod="vietqr"
        paymentMethodLabel="Chuyển khoản Ngân hàng (VietQR)"
        customerEmail="tu.ngo@example.com"
        orderId="NAT-889900"
        totalAmount={25000000}
        onComplete={onComplete}
      />
    );

    expect(screen.getByText(/QUÉT MÃ VIETQR THANH TOÁN/i)).toBeInTheDocument();
    expect(screen.getByText('0773071629')).toBeInTheDocument();
    expect(screen.getByText('NGO ANH TU')).toBeInTheDocument();
    expect(screen.getAllByText(/MBBank/i).length).toBeGreaterThan(0);

    const confirmBtn = screen.getByRole('button', { name: /TÔI ĐÃ CHUYỂN KHOẢN THÀNH CÔNG/i });
    expect(confirmBtn).toBeInTheDocument();
    confirmBtn.click();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
