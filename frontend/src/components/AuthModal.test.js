import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AuthModal from './AuthModal';
import api from '../services/api';

jest.mock('../services/api');

describe('AuthModal', () => {
  const onLoginSuccessMock = jest.fn();
  const onCloseMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('does not render when isOpen is false', () => {
    const { container } = render(
      <AuthModal isOpen={false} onClose={onCloseMock} onLoginSuccess={onLoginSuccessMock} />
    );
    expect(container.firstChild).toBeNull();
  });

  test('renders login tabs and inputs when open', () => {
    render(<AuthModal isOpen={true} onClose={onCloseMock} onLoginSuccess={onLoginSuccessMock} />);
    expect(screen.getByRole('button', { name: /^ĐĂNG NHẬP$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^TẠO TÀI KHOẢN$/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Địa chỉ Email hoặc Số điện thoại/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mật khẩu/i)).toBeInTheDocument();
  });

  test('shows error when password is too short', async () => {
    render(<AuthModal isOpen={true} onClose={onCloseMock} onLoginSuccess={onLoginSuccessMock} />);
    
    const accountInput = screen.getByPlaceholderText(/Địa chỉ Email hoặc Số điện thoại/i);
    const pwdInput = screen.getByPlaceholderText(/Mật khẩu/i);
    const submitBtn = screen.getByRole('button', { name: /ĐĂNG NHẬP TÀI KHOẢN/i });

    fireEvent.change(accountInput, { target: { value: 'user@example.com' } });
    fireEvent.change(pwdInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Mật khẩu phải có tối thiểu 6 ký tự/i)).toBeInTheDocument();
  });

  test('handles successful login with api.login', async () => {
    api.login.mockResolvedValueOnce({
      message: 'Đăng nhập thành công.',
      user: { id: 'usr_1', name: 'Nguyễn Văn A', email: 'a@nat.vn', role: 'customer' }
    });

    render(<AuthModal isOpen={true} onClose={onCloseMock} onLoginSuccess={onLoginSuccessMock} />);
    
    const accountInput = screen.getByPlaceholderText(/Địa chỉ Email hoặc Số điện thoại/i);
    const pwdInput = screen.getByPlaceholderText(/Mật khẩu/i);
    const submitBtn = screen.getByRole('button', { name: /ĐĂNG NHẬP TÀI KHOẢN/i });

    fireEvent.change(accountInput, { target: { value: 'a@nat.vn' } });
    fireEvent.change(pwdInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.login).toHaveBeenCalledWith('a@nat.vn', 'password123');
      expect(onLoginSuccessMock).toHaveBeenCalledWith(expect.objectContaining({
        id: 'usr_1',
        email: 'a@nat.vn'
      }));
      expect(onCloseMock).toHaveBeenCalled();
    });
  });

  test('handles registration mode and api.register', async () => {
    api.register.mockResolvedValueOnce({
      message: 'Tạo tài khoản thành công.',
      user: { id: 'usr_2', name: 'Trần Văn B', email: 'b@nat.vn', phone: '0886976868', role: 'customer' }
    });

    render(<AuthModal isOpen={true} onClose={onCloseMock} onLoginSuccess={onLoginSuccessMock} />);
    
    // Switch to register tab
    const registerTab = screen.getByRole('button', { name: /TẠO TÀI KHOẢN/i });
    fireEvent.click(registerTab);

    const nameInput = screen.getByPlaceholderText(/Họ và tên của bạn/i);
    const accountInput = screen.getByPlaceholderText(/Địa chỉ Email hoặc Số điện thoại/i);
    const pwdInput = screen.getByPlaceholderText(/Mật khẩu/i);
    const submitBtn = screen.getByRole('button', { name: /TẠO TÀI KHOẢN MỚI/i });

    fireEvent.change(nameInput, { target: { value: 'Trần Văn B' } });
    fireEvent.change(accountInput, { target: { value: 'b@nat.vn' } });
    fireEvent.change(pwdInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith('Trần Văn B', 'b@nat.vn', '0886976868', 'password123');
      expect(onLoginSuccessMock).toHaveBeenCalledWith(expect.objectContaining({
        id: 'usr_2',
        name: 'Trần Văn B'
      }));
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
});
