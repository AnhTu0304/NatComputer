import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthRequireNoticeModal from './AuthRequireNoticeModal';

describe('AuthRequireNoticeModal', () => {
  test('renders login required notice title and buttons', () => {
    const onClose = jest.fn();

    render(
      <MemoryRouter>
        <AuthRequireNoticeModal
          isOpen={true}
          onClose={onClose}
        />
      </MemoryRouter>
    );

    expect(screen.getByText(/VUI LÒNG ĐĂNG NHẬP TÀI KHOẢN/i)).toBeInTheDocument();
    
    const loginBtn = screen.getByText(/CHUYỂN SANG TRANG ĐĂNG NHẬP NGAY/i);
    fireEvent.click(loginBtn);

    expect(onClose).toHaveBeenCalled();
  });
});
