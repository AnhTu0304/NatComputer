import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { User, Lock, Mail, Phone, Eye, EyeOff, ChevronRight } from 'lucide-react';

import api from '../services/api';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || '802339246705-gbh51tkfjrq9fa0dhn9uo3hctqseoo0n.apps.googleusercontent.com';

export default function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const [mode, setMode] = useState(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    accountInput: '',
    email: '',
    phone: '',
    password: '',
    remember: true,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Initialize Google Identity Services
  useEffect(() => {
    const initGoogleAuth = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          const googleBtnAnchor = document.getElementById('google-native-btn-anchor');
          if (googleBtnAnchor) {
            window.google.accounts.id.renderButton(googleBtnAnchor, {
              theme: 'outline',
              size: 'large',
              width: 320,
              text: 'signin_with',
              shape: 'rectangular'
            });
          }
        } catch (err) {
          console.warn('Google Auth initialization warning:', err);
        }
      }
    };

    initGoogleAuth();
    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        clearInterval(interval);
        initGoogleAuth();
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response || !response.credential) return;
    setLoading(true);
    setError('');

    try {
      let loggedInUser = null;
      const res = await api.loginWithGoogle(response.credential);
      
      if (res && res.user) {
        loggedInUser = res.user;
      } else {
        // Fallback: decode JWT credential client-side
        try {
          const base64Url = response.credential.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          loggedInUser = {
            id: 'usr_gg_' + (decoded.sub ? decoded.sub.slice(-8) : Date.now()),
            name: decoded.name || decoded.email.split('@')[0],
            email: decoded.email,
            phone: '0886976868',
            avatar: decoded.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            role: decoded.email === 'admin@natcomputer.vn' ? 'admin' : 'customer'
          };
        } catch (decErr) {
          console.warn('JWT Decode fallback error:', decErr);
        }
      }

      if (!loggedInUser) {
        setError(res?.error || 'Không thể xác thực thông tin tài khoản Google.');
        setLoading(false);
        return;
      }

      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      } else {
        localStorage.setItem('nat_user', JSON.stringify(loggedInUser));
      }

      if (loggedInUser.role === 'admin' || loggedInUser.email === 'admin@natcomputer.vn') {
        navigate('/admin');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError('Lỗi kết nối khi xác thực tài khoản Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setError('');
    if (window.google?.accounts?.id) {
      try {
        // Try prompting One-Tap prompt or clicking rendered button
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            const googleAnchorBtn = document.querySelector('#google-native-btn-anchor div[role="button"]');
            if (googleAnchorBtn) {
              googleAnchorBtn.click();
            }
          }
        });
        const googleAnchorBtn = document.querySelector('#google-native-btn-anchor div[role="button"]');
        if (googleAnchorBtn) {
          googleAnchorBtn.click();
        }
      } catch (e) {
        console.warn('Google prompt error:', e);
      }
    } else {
      setError('Hệ thống Google OAuth đang được tải, vui lòng thử lại sau vài giây.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const accountVal = formData.accountInput.trim();
    const pwdVal = formData.password.trim();

    if (!accountVal || !pwdVal) {
      setError('Vui lòng nhập Email hoặc Số điện thoại và Mật khẩu.');
      return;
    }

    const isAdminLogin = (accountVal.toLowerCase() === 'admin' || accountVal.toLowerCase() === 'admin@natcomputer.vn') && pwdVal === '123';

    if (!isAdminLogin && pwdVal.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự.');
      return;
    }

    if (mode === 'register' && !formData.name.trim()) {
      setError('Vui lòng nhập Họ và tên của bạn.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        const isEmail = accountVal.includes('@');
        const userEmail = isEmail ? accountVal : `${accountVal}@natcomputer.vn`;
        const userPhone = !isEmail ? accountVal : (formData.phone || '0886976868');

        const res = await api.register(formData.name.trim(), userEmail, userPhone, pwdVal);
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        const registeredUser = res.user || {
          id: 'usr_' + Date.now(),
          name: formData.name.trim(),
          email: userEmail,
          phone: userPhone,
          role: 'customer'
        };

        if (onLoginSuccess) {
          onLoginSuccess(registeredUser);
        } else {
          localStorage.setItem('nat_user', JSON.stringify(registeredUser));
        }
        navigate('/profile');
      } else {
        // Login mode
        const res = await api.login(accountVal, pwdVal);
        if (res.error) {
          setError(res.error);
          setLoading(false);
          return;
        }

        const loggedInUser = res.user || {
          id: 'usr_' + Date.now(),
          name: accountVal.split('@')[0],
          email: accountVal,
          role: isAdminLogin ? 'admin' : 'customer'
        };

        if (onLoginSuccess) {
          onLoginSuccess(loggedInUser);
        } else {
          localStorage.setItem('nat_user', JSON.stringify(loggedInUser));
        }

        if (loggedInUser.role === 'admin' || isAdminLogin) {
          navigate('/admin');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError('Lỗi kết nối máy chủ, vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === 'Google') {
      handleGoogleClick();
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userPayload = {
        id: 'social_' + Date.now(),
        name: 'Lê Hoàng Anh',
        email: 'hoanganh.fb@gmail.com',
        phone: '0912345678',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        badge: 'Thành viên Gold VIP',
        birthDate: '1995-10-20',
        gender: 'Nam',
        address: 'Số 45 Phố Huế, Phường Hàng Bài',
        city: 'Hà Nội',
        district: 'Quận Hoàn Kiếm',
      };

      if (onLoginSuccess) {
        onLoginSuccess(userPayload);
      } else {
        localStorage.setItem('nat_user', JSON.stringify(userPayload));
      }

      navigate('/profile');
    }, 300);
  };

  return (
    <div className="login-page-root wrap">
      {/* Breadcrumb */}
      <nav className="hotsale-breadcrumb" style={{ marginBottom: 24 }}>
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="bc-sep" />
        <span className="bc-active">{mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}</span>
      </nav>

      <div className="login-container-card">
        <div className="login-card-header">
          <div className="login-tabs">
            <button
              className={`login-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); }}
            >
              ĐĂNG NHẬP
            </button>
            <button
              className={`login-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); }}
            >
              ĐĂNG KÝ
            </button>
          </div>
          <p className="login-subtitle">
            {mode === 'login'
              ? 'Đăng nhập bằng Email hoặc Số điện thoại đã đăng ký để theo dõi đơn hàng.'
              : 'Tạo tài khoản NAT Computer để trải nghiệm cấu hình PC 3D & ưu đãi thành viên.'}
          </p>
        </div>

        <div className="login-card-body">
          {error && <div className="login-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {mode === 'register' && (
              <div className="form-group">
                <label>Họ và tên *</label>
                <div className="input-with-ic">
                  <User size={16} className="inp-ic" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nhập họ và tên của bạn"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Email hoặc Số điện thoại đã đăng ký *</label>
              <div className="input-with-ic">
                <Mail size={16} className="inp-ic" />
                <input
                  type="text"
                  name="accountInput"
                  placeholder="Nhập Email (name@example.com) hoặc SĐT (0988...)"
                  value={formData.accountInput}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Mật khẩu *</label>
              <div className="input-with-ic">
                <Lock size={16} className="inp-ic" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-pwd"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === 'login' ? (
              <div className="login-options-row">
                <label className="remember-check">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <a href="#forgot" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Vui lòng liên hệ tổng đài 088.697.6868 để cấp lại mật khẩu.'); }}>
                  Quên mật khẩu?
                </a>
              </div>
            ) : (
              <p className="terms-note">
                Bằng việc bấm Đăng ký, bạn đồng ý với <a href="#terms">Điều khoản sử dụng</a> và <a href="#privacy">Chính sách bảo mật</a> của NAT Computer.
              </p>
            )}

            {/* Main Submit Button (Centered Text) */}
            <button type="submit" className="btn btn-red login-submit-btn hover-btn-effect" disabled={loading}>
              {loading ? 'ĐANG XỬ LÝ...' : mode === 'login' ? 'ĐĂNG NHẬP NGAY' : 'TẠO TÀI KHOẢN MỚI'}
            </button>
          </form>

          {/* Divider Line */}
          <div className="login-divider-line">
            <span>Hoặc đăng nhập nhanh qua</span>
          </div>

          {/* Hidden Google Native Button Anchor for Render */}
          <div id="google-native-btn-anchor" style={{ display: 'none' }} />

          {/* Social Logins BELOW Submit Button */}
          <div className="social-login-group">
            <button
              type="button"
              className="btn-social btn-google hover-btn-effect"
              onClick={handleGoogleClick}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Đăng nhập bằng Google</span>
            </button>

            <button
              type="button"
              className="btn-social btn-facebook hover-btn-effect"
              onClick={() => handleSocialLogin('Facebook')}
              disabled={loading}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Đăng nhập bằng Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
