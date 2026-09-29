import React, { useState } from 'react';
import {
  Settings,
  CreditCard,
  Building2,
  BellRing,
  Volume2,
  VolumeX,
  Save,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Smartphone,
  MapPin,
  Mail,
  Clock,
  Send,
  Zap,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { generateVietQrUrl, DEFAULT_BANK_CONFIG } from '../../utils/vietqr';

// Popular Vietnamese banks supported by VietQR NAPAS 24/7
const POPULAR_BANKS = [
  { id: 'MB', name: 'Ngân hàng Quân Đội (MBBank)', bin: '970422', shortName: 'MBBank' },
  { id: 'VCB', name: 'Ngân hàng Ngoại Thương (Vietcombank)', bin: '970436', shortName: 'Vietcombank' },
  { id: 'TCB', name: 'Ngân hàng Kỹ Thương (Techcombank)', bin: '970407', shortName: 'Techcombank' },
  { id: 'ACB', name: 'Ngân hàng Á Châu (ACB)', bin: '970416', shortName: 'ACB' },
  { id: 'VPB', name: 'Ngân hàng Việt Nam Thịnh Vượng (VPBank)', bin: '970432', shortName: 'VPBank' },
  { id: 'ICB', name: 'Ngân hàng Công Thương (VietinBank)', bin: '970415', shortName: 'VietinBank' },
  { id: 'BIDV', name: 'Ngân hàng Đầu tư & Phát triển (BIDV)', bin: '970418', shortName: 'BIDV' },
  { id: 'TPB', name: 'Ngân hàng Tiên Phong (TPBank)', bin: '970458', shortName: 'TPBank' }
];

export default function StoreSettingsView({
  onSaveBankConfig,
  onSimulateWebhook,
  onPlayChime
}) {
  const [activeTab, setActiveTab] = useState('vietqr'); // 'vietqr' | 'store' | 'system'
  const [alert, setAlert] = useState({ text: '', type: 'success' });
  const [isCopied, setIsCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Bank & VietQR Settings
  const [bankConfig, setBankConfig] = useState({
    bankId: 'MB',
    bankName: 'Ngân hàng Quân Đội (MBBank)',
    accountNo: '0773071629',
    accountName: 'NGO ANH TU',
    template: 'compact2',
    memoPrefix: 'NAT',
    autoConfirmTimeout: 15 // minutes
  });

  // Test amount for QR Preview
  const [previewAmount, setPreviewAmount] = useState(25500000);
  const [previewOrderId, setPreviewOrderId] = useState('NAT-9988');

  // Store Profile Settings
  const [storeProfile, setStoreProfile] = useState({
    storeName: 'NAT COMPUTER - PC GAMING & WORKSTATION',
    slogan: 'Chuyên Linh Kiện PC Cao Cấp, Custom Watercooling & Máy Trạm Đồ Họa',
    hotline: '0886.97.6868',
    techSupport: '0979.88.9900',
    email: 'contact@natcomputer.vn',
    showroomAddress: 'Số 45, Đường Lê Thanh Nghị, Quận Hai Bà Trưng, TP. Hà Nội',
    labAddress: 'Tầng 2 - Phòng Kỹ Thuật & Đo Kiểm RMA, 45 Lê Thanh Nghị, Hà Nội',
    openingHours: '08:00 - 21:00 (Thứ 2 - Chủ Nhật)',
    businessLicense: '0109887766 - Do Sở KH&ĐT TP. Hà Nội cấp'
  });

  // System & Sound Settings
  const [systemSettings, setSystemSettings] = useState({
    enableChimeSound: true,
    chimeVolume: 80,
    lowStockThreshold: 5,
    autoRefreshInterval: 30, // seconds
    emailNotificationOnOrder: true,
    telegramAlerts: true
  });

  const showAlert = (text, type = 'success') => {
    setAlert({ text, type });
    setTimeout(() => setAlert({ text: '', type: 'success' }), 4000);
  };

  // Generate Realtime Live QR URL
  const liveQrUrl = generateVietQrUrl({
    amount: previewAmount,
    orderId: previewOrderId,
    template: bankConfig.template,
    bankConfig
  });

  const handleBankChange = (e) => {
    const selectedBankId = e.target.value;
    const selected = POPULAR_BANKS.find(b => b.id === selectedBankId);
    setBankConfig(prev => ({
      ...prev,
      bankId: selectedBankId,
      bankName: selected ? selected.name : prev.bankName
    }));
  };

  const handleSaveVietQr = (e) => {
    e.preventDefault();
    if (!bankConfig.accountNo || !bankConfig.accountName) {
      showAlert('Vui lòng nhập đầy đủ Số tài khoản và Tên chủ tài khoản!', 'error');
      return;
    }
    if (onSaveBankConfig) {
      onSaveBankConfig(bankConfig);
    }
    showAlert('Đã lưu cấu hình cổng thanh toán VietQR Napas 24/7 thành công!');
  };

  const handleSaveStoreProfile = (e) => {
    e.preventDefault();
    showAlert('Đã cập nhật thông tin cửa hàng & showroom NAT Computer thành công!');
  };

  const handleSaveSystemSettings = (e) => {
    e.preventDefault();
    showAlert('Đã lưu cấu hình hệ thống & thông báo âm thanh thành công!');
  };

  const handleCopyMemo = () => {
    const memo = `${bankConfig.memoPrefix} ${previewOrderId}`;
    navigator.clipboard?.writeText(memo);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleTriggerSimulate = async () => {
    setIsSimulating(true);
    try {
      if (onSimulateWebhook) {
        await onSimulateWebhook(previewOrderId, previewAmount);
      }
      showAlert(`Đã bắn Webhook thanh toán thành công cho đơn #${previewOrderId}!`);
    } catch {
      showAlert('Lỗi khi giả lập Webhook thanh toán!', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="store-settings-wrapper">
      {/* Header Row */}
      <div className="panel-header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
              Cài Đặt Hệ Thống & Cổng VietQR (Store & VietQR Settings)
            </h3>
            <span className="badge-active-tag badge-healthy" style={{ fontSize: 12 }}>
              <ShieldCheck size={13} style={{ display: 'inline', marginRight: 3 }} /> Napas 24/7 Sẵn Sàng
            </span>
          </div>
          <p className="panel-sub" style={{ margin: '4px 0 0' }}>
            Quản trị tài khoản thụ hưởng thanh toán mã QR tự động, thông tin showroom và cấu hình thông báo realtime
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            className="btn-tail-secondary"
            onClick={() => onPlayChime && onPlayChime()}
            title="Thử tiếng chuông thông báo đơn hàng"
          >
            <Volume2 size={15} color="#4f46e5" /> Thử Chuông Báo
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {alert.text && (
        <div className={`customer-alert-banner ${alert.type === 'error' ? 'warning' : 'success'}`}>
          {alert.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
          <span>{alert.text}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="customer-tabs-bar" style={{ margin: '12px 0 16px' }}>
        <button
          type="button"
          className={`c-tab-btn ${activeTab === 'vietqr' ? 'active' : ''}`}
          onClick={() => setActiveTab('vietqr')}
        >
          <CreditCard size={15} /> Cổng Thanh Toán VietQR Napas
        </button>
        <button
          type="button"
          className={`c-tab-btn ${activeTab === 'store' ? 'active' : ''}`}
          onClick={() => setActiveTab('store')}
        >
          <Building2 size={15} /> Thông Tin Showroom & Cửa Hàng
        </button>
        <button
          type="button"
          className={`c-tab-btn ${activeTab === 'system' ? 'active' : ''}`}
          onClick={() => setActiveTab('system')}
        >
          <Settings size={15} /> Âm Báo & Cấu Hình Vận Hành
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: VIETQR GATEWAY CONFIGURATION                                 */}
      {/* =================================================================== */}
      {activeTab === 'vietqr' && (
        <div className="vietqr-settings-grid">
          {/* Left Form: Bank Account Details */}
          <div className="tail-form-card" style={{ flex: '1 1 540px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <QrCode size={20} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                  Tài Khoản Thụ Hưởng VietQR
                </h4>
                <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                  Thông tin tài khoản ngân hàng nhận tiền thanh toán trực tiếp từ khách hàng
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveVietQr} className="tail-crud-form">
              <div className="form-grid-2">
                <div className="form-input-box">
                  <label>Ngân Hàng Thụ Hưởng (Bank) *</label>
                  <select value={bankConfig.bankId} onChange={handleBankChange}>
                    {POPULAR_BANKS.map(b => (
                      <option key={b.id} value={b.id}>{b.name} ({b.id})</option>
                    ))}
                  </select>
                </div>

                <div className="form-input-box">
                  <label>Số Tài Khoản Ngân Hàng (STK) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 0773071629"
                    value={bankConfig.accountNo}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, accountNo: e.target.value.trim() }))}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="form-input-box">
                  <label>Tên Chủ Tài Khoản (In hoa không dấu) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NGO ANH TU"
                    value={bankConfig.accountName}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, accountName: e.target.value.toUpperCase() }))}
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Cần trùng khớp chính xác 100% với tên đăng ký tại ngân hàng
                  </span>
                </div>

                <div className="form-input-box">
                  <label>Mẫu Giao Diện VietQR (Template) *</label>
                  <select
                    value={bankConfig.template}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, template: e.target.value }))}
                  >
                    <option value="compact2">Compact 2 (Chuẩn có khung & logo Napas)</option>
                    <option value="compact">Compact (Đơn giản gọn gàng)</option>
                    <option value="qr_only">QR Only (Chỉ mã QR thuần)</option>
                    <option value="print">Print (Khổ in hóa đơn POS)</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: 12 }}>
                <div className="form-input-box">
                  <label>Tiền Tố Nội Dung Chuyển Khoản (Prefix)</label>
                  <input
                    type="text"
                    placeholder="NAT"
                    value={bankConfig.memoPrefix}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, memoPrefix: e.target.value.toUpperCase() }))}
                  />
                  <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                    Ví dụ: <strong>{bankConfig.memoPrefix || 'NAT'} 12345</strong> để bot tự khớp đơn hàng
                  </span>
                </div>

                <div className="form-input-box">
                  <label>Thời Gian Hết Hạn Mã QR (Phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={bankConfig.autoConfirmTimeout}
                    onChange={(e) => setBankConfig(prev => ({ ...prev, autoConfirmTimeout: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <button type="submit" className="btn-tail-primary">
                  <Save size={15} /> Lưu Cấu Hình VietQR
                </button>
                <button
                  type="button"
                  className="btn-tail-secondary"
                  onClick={() => setBankConfig(DEFAULT_BANK_CONFIG)}
                >
                  <RefreshCw size={14} /> Khôi Phục Mặc Định
                </button>
              </div>
            </form>
          </div>

          {/* Right Panel: Live Realtime QR Simulator */}
          <div className="tail-form-card vietqr-preview-card" style={{ flex: '1 1 380px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={16} color="#eab308" />
                <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
                  Giao Diện Quét Mã Khách Hàng (Live Preview)
                </h4>
              </div>
              <span className="badge-active-tag" style={{ background: '#fef08a', color: '#854d0e', fontSize: 11 }}>
                LIVE NAPAS 24/7
              </span>
            </div>

            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
              Mã QR thanh toán thực tế sẽ hiển thị tại trang Checkout và Modal thanh toán khi khách chọn chuyển khoản:
            </p>

            {/* QR Simulation Box */}
            <div className="vietqr-live-box">
              <div className="vietqr-img-wrapper">
                <img
                  src={liveQrUrl}
                  alt={`VietQR ${bankConfig.bankId} ${bankConfig.accountNo}`}
                  className="vietqr-img-preview"
                />
              </div>

              {/* Account summary info */}
              <div className="vietqr-info-pills">
                <div className="v-pill-row">
                  <span className="v-pill-lbl">Ngân Hàng:</span>
                  <span className="v-pill-val">{bankConfig.bankName}</span>
                </div>
                <div className="v-pill-row">
                  <span className="v-pill-lbl">Số Tài Khoản:</span>
                  <strong className="v-pill-val" style={{ color: '#2563eb', letterSpacing: '0.04em' }}>
                    {bankConfig.accountNo}
                  </strong>
                </div>
                <div className="v-pill-row">
                  <span className="v-pill-lbl">Chủ Tài Khoản:</span>
                  <span className="v-pill-val" style={{ fontWeight: 600 }}>{bankConfig.accountName}</span>
                </div>
                <div className="v-pill-row">
                  <span className="v-pill-lbl">Số Tiền Test:</span>
                  <span className="v-pill-val" style={{ color: '#059669', fontWeight: 700 }}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(previewAmount)}
                  </span>
                </div>
                <div className="v-pill-row highlight-memo">
                  <span className="v-pill-lbl">Nội Dung CK:</span>
                  <span className="v-pill-val memo-badge">
                    {bankConfig.memoPrefix} {previewOrderId}
                    <button
                      type="button"
                      onClick={handleCopyMemo}
                      className="btn-copy-memo"
                      title="Sao chép nội dung chuyển khoản"
                    >
                      {isCopied ? <Check size={12} color="#16a34a" /> : <Copy size={12} />}
                    </button>
                  </span>
                </div>
              </div>

              {/* Test controls */}
              <div className="vietqr-test-controls">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Mã Đơn Test:</label>
                    <input
                      type="text"
                      value={previewOrderId}
                      onChange={(e) => setPreviewOrderId(e.target.value)}
                      style={{ width: '100%', padding: '4px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, color: '#64748b', display: 'block', marginBottom: 2 }}>Số Tiền Test (VNĐ):</label>
                    <input
                      type="number"
                      step="500000"
                      value={previewAmount}
                      onChange={(e) => setPreviewAmount(Number(e.target.value))}
                      style={{ width: '100%', padding: '4px 8px', fontSize: 12, borderRadius: 6, border: '1px solid #cbd5e1' }}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-simulate-webhook"
                  onClick={handleTriggerSimulate}
                  disabled={isSimulating}
                >
                  <Send size={13} /> {isSimulating ? 'Đang gửi tín hiệu...' : 'Bắn Thử Webhook Báo Có (Tự Duyệt Đơn)'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: STORE PROFILE & SHOWROOM DETAILS                            */}
      {/* =================================================================== */}
      {activeTab === 'store' && (
        <div className="tail-form-card" style={{ maxWidth: 900 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Hồ Sơ Showroom & Doanh Nghiệp NAT Computer
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Thông tin xuất hiện trên hóa đơn đỏ, email xác nhận đơn hàng và chân trang website
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveStoreProfile} className="tail-crud-form">
            <div className="form-grid-2">
              <div className="form-input-box">
                <label>Tên Thương Hiệu Cửa Hàng *</label>
                <input
                  type="text"
                  required
                  value={storeProfile.storeName}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, storeName: e.target.value }))}
                />
              </div>

              <div className="form-input-box">
                <label>Khẩu Hiệu / Slogan *</label>
                <input
                  type="text"
                  value={storeProfile.slogan}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, slogan: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-grid-3" style={{ marginTop: 12 }}>
              <div className="form-input-box">
                <label>Hotline Bán Hàng & Tư Vấn *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={storeProfile.hotline}
                    onChange={(e) => setStoreProfile(prev => ({ ...prev, hotline: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-input-box">
                <label>Hotline Hỗ Trợ Kỹ Thuật & RMA</label>
                <input
                  type="text"
                  value={storeProfile.techSupport}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, techSupport: e.target.value }))}
                />
              </div>

              <div className="form-input-box">
                <label>Email Hộp Thư Đơn Hàng *</label>
                <input
                  type="email"
                  required
                  value={storeProfile.email}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginTop: 12 }}>
              <div className="form-input-box">
                <label>Địa Chỉ Showroom Trưng Bày *</label>
                <input
                  type="text"
                  required
                  value={storeProfile.showroomAddress}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, showroomAddress: e.target.value }))}
                />
              </div>

              <div className="form-input-box">
                <label>Địa Chỉ Phòng Lab Đo Kiểm & RMA *</label>
                <input
                  type="text"
                  required
                  value={storeProfile.labAddress}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, labAddress: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-grid-2" style={{ marginTop: 12 }}>
              <div className="form-input-box">
                <label>Giờ Mở Cửa Phục Vụ</label>
                <input
                  type="text"
                  value={storeProfile.openingHours}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, openingHours: e.target.value }))}
                />
              </div>

              <div className="form-input-box">
                <label>Số Giấy Phép Đăng Ký Kinh Doanh</label>
                <input
                  type="text"
                  value={storeProfile.businessLicense}
                  onChange={(e) => setStoreProfile(prev => ({ ...prev, businessLicense: e.target.value }))}
                />
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <button type="submit" className="btn-tail-primary">
                <Save size={15} /> Lưu Hồ Sơ Cửa Hàng
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: SYSTEM OPERATIONAL & CHIME NOTIFICATION SETTINGS             */}
      {/* =================================================================== */}
      {activeTab === 'system' && (
        <div className="tail-form-card" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: '#fdf2f8', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BellRing size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#0f172a' }}>
                Cấu Hình Âm Thanh & Thông Báo Vận Hành Realtime
              </h4>
              <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>
                Kiểm soát chuông báo Web Audio khi có đơn mới và ngưỡng giám sát tồn kho linh kiện
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveSystemSettings} className="tail-crud-form">
            <div className="settings-switch-group">
              <div className="settings-switch-item">
                <div className="sw-info">
                  <strong>Âm Thanh Báo Đơn Hàng Mới (Web Audio Chime)</strong>
                  <span>Tự động phát tiếng chuông leng keng khi khách hàng đặt hàng hoặc thanh toán thành công</span>
                </div>
                <label className="perm-toggle-box">
                  <input
                    type="checkbox"
                    checked={systemSettings.enableChimeSound}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, enableChimeSound: e.target.checked }))}
                  />
                  <span className={`perm-indicator ${systemSettings.enableChimeSound ? 'perm-on' : 'perm-off'}`}>
                    {systemSettings.enableChimeSound ? 'BẬT' : 'TẮT'}
                  </span>
                </label>
              </div>

              <div className="settings-switch-item">
                <div className="sw-info">
                  <strong>Thông Báo Email Khi Có Đơn Hàng Mới</strong>
                  <span>Gửi email tóm tắt chi tiết cấu hình PC và linh kiện đến hộp thư ban giám đốc</span>
                </div>
                <label className="perm-toggle-box">
                  <input
                    type="checkbox"
                    checked={systemSettings.emailNotificationOnOrder}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, emailNotificationOnOrder: e.target.checked }))}
                  />
                  <span className={`perm-indicator ${systemSettings.emailNotificationOnOrder ? 'perm-on' : 'perm-off'}`}>
                    {systemSettings.emailNotificationOnOrder ? 'BẬT' : 'TẮT'}
                  </span>
                </label>
              </div>

              <div className="settings-switch-item">
                <div className="sw-info">
                  <strong>Đồng Bộ Cảnh Báo Telegram Bot</strong>
                  <span>Gửi tin nhắn tức thì vào nhóm CSKH & Kỹ thuật khi có yêu cầu bảo hành RMA</span>
                </div>
                <label className="perm-toggle-box">
                  <input
                    type="checkbox"
                    checked={systemSettings.telegramAlerts}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, telegramAlerts: e.target.checked }))}
                  />
                  <span className={`perm-indicator ${systemSettings.telegramAlerts ? 'perm-on' : 'perm-off'}`}>
                    {systemSettings.telegramAlerts ? 'BẬT' : 'TẮT'}
                  </span>
                </label>
              </div>
            </div>

            <div className="form-grid-2" style={{ marginTop: 18 }}>
              <div className="form-input-box">
                <label>Ngưỡng Báo Động Sắp Hết Kho (Tồn kho tối thiểu)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={systemSettings.lowStockThreshold}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, lowStockThreshold: Number(e.target.value) }))}
                />
                <span style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  Linh kiện có số lượng tồn bằng hoặc thấp hơn số này sẽ kích hoạt thông báo vàng
                </span>
              </div>

              <div className="form-input-box">
                <label>Chu Kỳ Tự Động Làm Mới Dữ Liệu (Giây)</label>
                <select
                  value={systemSettings.autoRefreshInterval}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, autoRefreshInterval: Number(e.target.value) }))}
                >
                  <option value={15}>15 giây (Thời gian thực cao)</option>
                  <option value={30}>30 giây (Khuyên dùng)</option>
                  <option value={60}>1 phút</option>
                  <option value={120}>2 phút (Tiết kiệm băng thông)</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
              <button type="submit" className="btn-tail-primary">
                <Save size={15} /> Lưu Cài Đặt Vận Hành
              </button>
              <button
                type="button"
                className="btn-tail-secondary"
                onClick={() => onPlayChime && onPlayChime()}
              >
                <Volume2 size={15} color="#4f46e5" /> Thử Chuông Chime Ngay
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
