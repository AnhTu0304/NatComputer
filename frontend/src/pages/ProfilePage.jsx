import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ChevronRight,
  User,
  Package,
  Lock,
  LogOut,
  Camera,
  CheckCircle2,
  Shield,
  Save,
  Loader2,
  X,
  Eye,
  EyeOff,
  ShoppingBag,
  Truck,
  RotateCcw,
  Clock
} from 'lucide-react';

const CITIES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];
const DISTRICTS = ['Quận Cầu Giấy', 'Quận Hoàn Kiếm', 'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Thanh Xuân', 'Quận 1', 'Quận 3', 'Quận 7'];

const MOCK_ORDERS = [
  {
    id: 'NAT-889412',
    date: '18/08/2026',
    status: 'Đang vận chuyển',
    statusType: 'shipping',
    total: 34990000,
    items: [
      {
        name: 'PC NAT GAMING PRO — INTEL I7 14700K / RTX 4070 SUPER 12GB',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 34990000,
        specs: 'i7 14700K | 32GB DDR5 | RTX 4070 SUPER 12GB | 1TB NVMe'
      }
    ]
  },
  {
    id: 'NAT-774910',
    date: '02/07/2026',
    status: 'Đã hoàn thành',
    statusType: 'completed',
    total: 4890000,
    items: [
      {
        name: 'Màn hình ASUS ROG Swift OLED PG27AQDM 27" 2K 240Hz',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=300&q=80',
        qty: 1,
        price: 4890000,
        specs: '27 inch | 2K QHD | OLED 240Hz 0.03ms'
      }
    ]
  }
];

export default function ProfilePage({ user, onLogout, onUpdateUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const saved = localStorage.getItem('nat_user');
      if (!saved) {
        navigate('/login');
      }
    }
  }, [user, navigate]);

  const [activeNav, setActiveNav] = useState('profile');
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Personal Info Form State
  const [formData, setFormData] = useState({
    name: user?.name || 'Nguyễn Văn An',
    email: user?.email || 'khachhang@natcomputer.vn',
    phone: user?.phone || '0988668868',
    birthDate: user?.birthDate || '1998-05-15',
    gender: user?.gender || 'Nam',
    address: user?.address || 'Số 188 Đường Cầu Giấy, Phường Dịch Vọng',
    city: user?.city || 'Hà Nội',
    district: user?.district || 'Quận Cầu Giấy',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  });

  const [isDirty, setIsDirty] = useState(false);

  // Password Form State
  const [pwdData, setPwdData] = useState({
    currentPwd: '',
    newPwd: '',
    confirmPwd: '',
  });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [pwdError, setPwdError] = useState('');

  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        birthDate: user.birthDate || prev.birthDate,
        gender: user.gender || prev.gender,
        address: user.address || prev.address,
        city: user.city || prev.city,
        district: user.district || prev.district,
        avatar: user.avatar || prev.avatar,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPwdData(prev => ({ ...prev, [name]: value }));
    setPwdError('');
  };

  const handleAvatarChange = () => {
    const avatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    ];
    const nextAv = avatars[(avatars.indexOf(formData.avatar) + 1) % avatars.length];
    setFormData(prev => ({ ...prev, avatar: nextAv }));
    setIsDirty(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
      setToastMessage('Vui lòng nhập đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận hàng.');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    const phoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      setToastMessage('Số điện thoại không hợp lệ (Phải đúng 10 số đầu nhà mạng Việt Nam).');
      setTimeout(() => setToastMessage(''), 4000);
      return;
    }

    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      const updatedUser = { ...user, ...formData };
      if (onUpdateUser) onUpdateUser(updatedUser);
      localStorage.setItem('nat_user', JSON.stringify(updatedUser));
      setIsDirty(false);

      setToastMessage('Cập nhật thông tin tài khoản thành công.');
      setTimeout(() => setToastMessage(''), 4000);
    }, 500);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    setPwdError('');

    if (!pwdData.currentPwd || !pwdData.newPwd || !pwdData.confirmPwd) {
      setPwdError('Vui lòng nhập đầy đủ các trường mật khẩu.');
      return;
    }

    if (pwdData.newPwd.length < 6) {
      setPwdError('Mật khẩu mới phải có tối thiểu 6 ký tự.');
      return;
    }

    if (pwdData.newPwd !== pwdData.confirmPwd) {
      setPwdError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setPwdData({ currentPwd: '', newPwd: '', confirmPwd: '' });
      setToastMessage('Đổi mật khẩu thành công.');
      setTimeout(() => setToastMessage(''), 4000);
    }, 500);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || 'Nguyễn Văn An',
      email: user?.email || 'khachhang@natcomputer.vn',
      phone: user?.phone || '0988668868',
      birthDate: user?.birthDate || '1998-05-15',
      gender: user?.gender || 'Nam',
      address: user?.address || 'Số 188 Đường Cầu Giấy, Phường Dịch Vọng',
      city: user?.city || 'Hà Nội',
      district: user?.district || 'Quận Cầu Giấy',
      avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    });
    setIsDirty(false);
  };

  const handleLogoutClick = () => {
    if (onLogout) onLogout();
    localStorage.removeItem('nat_user');
    navigate('/login');
  };

  return (
    <div className="profile-page-root wrap">
      {/* ── BREADCRUMB ── */}
      <nav className="hotsale-breadcrumb" style={{ marginBottom: 24 }}>
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="bc-sep" />
        <span>Tài khoản</span>
        <ChevronRight size={14} className="bc-sep" />
        <span className="bc-active">
          {activeNav === 'profile' && 'Thông tin cá nhân'}
          {activeNav === 'orders' && 'Đơn hàng của tôi'}
          {activeNav === 'password' && 'Đổi mật khẩu'}
        </span>
      </nav>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="profile-toast-alert">
          <CheckCircle2 size={18} color="#16a34a" />
          <span>{toastMessage}</span>
          <button className="toast-close-btn" onClick={() => setToastMessage('')}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── ACCOUNT DASHBOARD LAYOUT ── */}
      <div className="profile-dashboard-grid">
        {/* LEFT SIDEBAR (4 Items ONLY) */}
        <aside className="profile-sidebar-card">
          <div className="profile-mini-box">
            <div className="mini-avatar-wrap">
              <img src={formData.avatar} alt={formData.name} />
            </div>
            <div className="mini-user-info">
              <h3 className="mini-name">{formData.name}</h3>
              <p className="mini-email">{formData.email}</p>
              <span className="user-gold-badge">Thành viên Gold VIP</span>
            </div>
          </div>

          <nav className="profile-nav-menu">
            <button
              className={`profile-nav-item hover-btn-effect ${activeNav === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveNav('profile')}
            >
              <User size={18} />
              <span>Thông tin cá nhân</span>
            </button>

            <button
              className={`profile-nav-item hover-btn-effect ${activeNav === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveNav('orders')}
            >
              <Package size={18} />
              <span>Đơn hàng của tôi</span>
            </button>

            <button
              className={`profile-nav-item hover-btn-effect ${activeNav === 'password' ? 'active' : ''}`}
              onClick={() => setActiveNav('password')}
            >
              <Lock size={18} />
              <span>Đổi mật khẩu</span>
            </button>

            <button className="profile-nav-item nav-logout hover-btn-effect" onClick={handleLogoutClick}>
              <LogOut size={18} />
              <span>Đăng xuất</span>
            </button>
          </nav>
        </aside>

        {/* RIGHT CONTENT PANEL */}
        <main className="profile-content-panel">
          {/* VIEW 1: PERSONAL INFORMATION */}
          {activeNav === 'profile' && (
            <>
              <div className="content-card-header">
                <h1 className="content-title">Thông tin cá nhân</h1>
                <p className="content-subtitle">Quản lý thông tin tài khoản và thông tin liên hệ của bạn.</p>
              </div>

              {/* Avatar Section */}
              <div className="avatar-upload-section">
                <div className="avatar-lg-box">
                  <img src={formData.avatar} alt={formData.name} />
                  <button type="button" className="avatar-camera-btn" onClick={handleAvatarChange} title="Thay đổi ảnh">
                    <Camera size={18} />
                  </button>
                </div>
                <div className="avatar-upload-info">
                  <button type="button" className="btn btn-outline-dark btn-sm btn-avatar-change hover-btn-effect" onClick={handleAvatarChange}>
                    Thay đổi ảnh
                  </button>
                  <span className="upload-note">JPG, PNG. Tối đa 2MB.</span>
                </div>
              </div>

              {/* Form */}
              <form className="profile-form-grid" onSubmit={handleSave}>
                <div className="form-col">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>

                <div className="form-col">
                  <label>Email (Tài khoản gốc)</label>
                  <div className="disabled-input-wrap">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      readOnly
                    />
                    <Lock size={14} className="lock-icon" />
                  </div>
                </div>

                <div className="form-col">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="form-col">
                  <label>Ngày sinh</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-col">
                  <label>Giới tính</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>

                <div className="form-col full-width">
                  <label>Địa chỉ nhận hàng</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Nhập số nhà, tên đường, phường/xã"
                  />
                </div>

                <div className="form-col">
                  <label>Tỉnh / Thành phố</label>
                  <select name="city" value={formData.city} onChange={handleChange}>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-col">
                  <label>Quận / Huyện</label>
                  <select name="district" value={formData.district} onChange={handleChange}>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="profile-actions-row full-width">
                  <button
                    type="button"
                    className="btn btn-secondary btn-cancel hover-btn-effect"
                    onClick={handleCancel}
                    disabled={!isDirty || isSaving}
                  >
                    HỦY
                  </button>

                  <button
                    type="submit"
                    className="btn btn-red btn-save hover-btn-effect"
                    disabled={isSaving || !isDirty}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="btn-spinner" />
                        <span>ĐANG LƯU...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>LƯU THAY ĐỔI</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* VIEW 2: MY ORDERS DASHBOARD */}
          {activeNav === 'orders' && (
            <div className="orders-dashboard-view">
              <div className="content-card-header">
                <h1 className="content-title">Đơn hàng của tôi</h1>
                <p className="content-subtitle">Quản lý và theo dõi tiến độ các đơn hàng PC & linh kiện đã đặt mua.</p>
              </div>

              <div className="orders-list-wrapper">
                {MOCK_ORDERS.map(order => (
                  <div key={order.id} className="order-card-box">
                    <div className="order-box-header">
                      <div className="order-id-area">
                        <ShoppingBag size={18} color="var(--c-blue)" />
                        <span className="order-id-code">Đơn hàng #{order.id}</span>
                        <span className="order-date-str">• {order.date}</span>
                      </div>
                      <span className={`order-status-badge status-${order.statusType}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="order-box-body">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item-row">
                          <img src={item.image} alt={item.name} className="order-item-img" />
                          <div className="order-item-details">
                            <h4 className="order-item-title">{item.name}</h4>
                            <p className="order-item-specs">{item.specs}</p>
                            <span className="order-item-qty">Số lượng: x{item.qty}</span>
                          </div>
                          <div className="order-item-price">
                            {fmt(item.price)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-box-footer">
                      <div className="order-total-area">
                        <span className="total-title">Tổng số tiền:</span>
                        <span className="total-amount">{fmt(order.total)}</span>
                      </div>
                      <div className="order-btn-group">
                        <button className="btn btn-outline-dark btn-sm hover-btn-effect" onClick={() => alert(`Chi tiết đơn hàng ${order.id}`)}>
                          Xem chi tiết đơn
                        </button>
                        <button className="btn btn-red btn-sm hover-btn-effect" onClick={() => alert(`Đã thêm lại các sản phẩm trong đơn ${order.id} vào giỏ hàng!`)}>
                          Mua lại đơn này
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW 3: CHANGE PASSWORD FORM */}
          {activeNav === 'password' && (
            <div className="change-password-view">
              <div className="content-card-header">
                <h1 className="content-title">Đổi mật khẩu</h1>
                <p className="content-subtitle">Quản lý và cập nhật mật khẩu bảo mật tài khoản của bạn.</p>
              </div>

              {pwdError && <div className="login-error-alert" style={{ marginBottom: 20 }}>{pwdError}</div>}

              <form className="password-form-box" onSubmit={handlePasswordSubmit}>
                <div className="form-col full-width" style={{ marginBottom: 16 }}>
                  <label>Mật khẩu hiện tại *</label>
                  <div className="input-with-ic">
                    <Lock size={16} className="inp-ic" />
                    <input
                      type={showCurrentPwd ? 'text' : 'password'}
                      name="currentPwd"
                      placeholder="Nhập mật khẩu hiện tại"
                      value={pwdData.currentPwd}
                      onChange={handlePwdChange}
                    />
                    <button
                      type="button"
                      className="toggle-pwd"
                      onClick={() => setShowCurrentPwd(v => !v)}
                    >
                      {showCurrentPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-col full-width" style={{ marginBottom: 16 }}>
                  <label>Mật khẩu mới *</label>
                  <div className="input-with-ic">
                    <Lock size={16} className="inp-ic" />
                    <input
                      type={showNewPwd ? 'text' : 'password'}
                      name="newPwd"
                      placeholder="Nhập mật khẩu mới (Tối thiểu 6 ký tự)"
                      value={pwdData.newPwd}
                      onChange={handlePwdChange}
                    />
                    <button
                      type="button"
                      className="toggle-pwd"
                      onClick={() => setShowNewPwd(v => !v)}
                    >
                      {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="form-col full-width" style={{ marginBottom: 24 }}>
                  <label>Xác nhận mật khẩu mới *</label>
                  <div className="input-with-ic">
                    <Lock size={16} className="inp-ic" />
                    <input
                      type={showConfirmPwd ? 'text' : 'password'}
                      name="confirmPwd"
                      placeholder="Nhập lại mật khẩu mới"
                      value={pwdData.confirmPwd}
                      onChange={handlePwdChange}
                    />
                    <button
                      type="button"
                      className="toggle-pwd"
                      onClick={() => setShowConfirmPwd(v => !v)}
                    >
                      {showConfirmPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="profile-actions-row full-width">
                  <button
                    type="submit"
                    className="btn btn-red btn-save hover-btn-effect"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={16} className="btn-spinner" />
                        <span>ĐANG CẬP NHẬT...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>CẬP NHẬT MẬT KHẨU</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
