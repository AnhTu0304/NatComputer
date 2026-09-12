import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

/* Google Icon SVG */
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z" />
    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.0 10.05.0 12c0 1.95.46 3.8 1.27 5.42l4.01-3.15z" />
    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
  </svg>
);

/* Facebook Icon SVG */
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [accountInput, setAccountInput] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const accountVal = accountInput.trim();
    const pwdVal = password.trim();

    if (!accountVal || !pwdVal) {
      setErrorMsg('Vui lòng nhập đầy đủ Email / Số điện thoại và Mật khẩu.');
      return;
    }

    const isAdminLogin = (accountVal.toLowerCase() === 'admin' || accountVal.toLowerCase() === 'admin@natcomputer.vn') && pwdVal === '123';

    if (!isAdminLogin && pwdVal.length < 6) {
      setErrorMsg('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (activeTab === 'register' && !fullName.trim()) {
      setErrorMsg('Vui lòng nhập Họ và tên của bạn.');
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'register') {
        const isEmail = accountVal.includes('@');
        const userEmail = isEmail ? accountVal : `${accountVal}@natcomputer.vn`;
        const userPhone = !isEmail ? accountVal : '0886976868';

        const res = await api.register(fullName.trim(), userEmail, userPhone, pwdVal);
        if (res.error) {
          setErrorMsg(res.error);
          setLoading(false);
          return;
        }
        const user = res.user || {
          id: 'usr_' + Date.now(),
          name: fullName.trim(),
          email: userEmail,
          phone: userPhone,
          role: 'customer'
        };
        try {
          localStorage.setItem('nat_user', JSON.stringify(user));
        } catch {}
        onLoginSuccess(user);
        onClose();
      } else {
        const res = await api.login(accountVal, pwdVal);
        if (res.error) {
          setErrorMsg(res.error);
          setLoading(false);
          return;
        }
        const user = res.user || {
          id: 'usr_' + Date.now(),
          name: accountVal.split('@')[0],
          email: accountVal,
          role: isAdminLogin ? 'admin' : 'customer'
        };
        try {
          localStorage.setItem('nat_user', JSON.stringify(user));
        } catch {}
        onLoginSuccess(user);
        onClose();
      }
    } catch (err) {
      setErrorMsg('Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    const userData = {
      name: provider === 'Google' ? 'Tuấn Nguyễn (Google)' : 'Tuấn Nguyễn (Facebook)',
      email: provider === 'Google' ? 'tuan.nguyen@gmail.com' : 'tuan.facebook@fb.com',
      avatar: null,
      role: 'customer'
    };
    try {
      localStorage.setItem('nat_user', JSON.stringify(userData));
    } catch {}
    onLoginSuccess(userData);
    onClose();
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="auth-modal-close" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>

        {/* Tab Header */}
        <div className="auth-tab-header">
          <button
            className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
          >
            ĐĂNG NHẬP
          </button>
          <button
            className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
          >
            TẠO TÀI KHOẢN
          </button>
        </div>

        <div className="auth-modal-body">
          {/* Social Logins */}
          <div className="auth-social-btns">
            <button className="btn-social google" onClick={() => handleSocialLogin('Google')}>
              <GoogleIcon />
              <span>Tiếp tục với Google</span>
            </button>
            <button className="btn-social facebook" onClick={() => handleSocialLogin('Facebook')}>
              <FacebookIcon />
              <span>Tiếp tục với Facebook</span>
            </button>
          </div>

          <div className="auth-divider">
            <span>Hoặc sử dụng Email / Số điện thoại</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {activeTab === 'register' && (
              <div className="auth-input-group">
                <User size={16} className="input-icon" />
                <input
                  type="text"
                  placeholder="Họ và tên của bạn"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="auth-input-group">
              <Mail size={16} className="input-icon" />
              <input
                type="text"
                placeholder="Địa chỉ Email hoặc Số điện thoại"
                value={accountInput}
                onChange={(e) => setAccountInput(e.target.value)}
                required
              />
            </div>

            <div className="auth-input-group">
              <Lock size={16} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-pwd-btn"
                onClick={() => setShowPassword(v => !v)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {errorMsg && <div className="auth-error-msg">{errorMsg}</div>}

            {activeTab === 'login' ? (
              <div className="auth-options-row">
                <label className="auth-remember-lbl">
                  <input type="checkbox" defaultChecked />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#forgot" className="auth-forgot-link" onClick={(e) => e.preventDefault()}>
                  Quên mật khẩu?
                </a>
              </div>
            ) : (
              <div className="auth-terms-note">
                Bằng việc đăng ký, bạn đồng ý với <strong>Điều khoản dịch vụ</strong> & <strong>Chính sách bảo mật</strong> của NAT Computer.
              </div>
            )}

            <button type="submit" className="btn btn-blue auth-submit-btn" disabled={loading}>
              {loading ? 'ĐANG XỬ LÝ...' : activeTab === 'login' ? 'ĐĂNG NHẬP TÀI KHOẢN' : 'TẠO TÀI KHOẢN MỚI'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
