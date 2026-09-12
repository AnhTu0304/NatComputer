import React, { useState, useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Mail,
  Loader2,
  QrCode,
  Copy,
  Check,
  Clock,
  Download,
  Building2,
  Lock
} from 'lucide-react';
import { generateVietQrUrl, DEFAULT_BANK_CONFIG } from '../utils/vietqr';
import { joinOrderRoom, leaveOrderRoom, onPaymentConfirmed } from '../services/socket';

gsap.registerPlugin(useGSAP);

export default function PaymentProcessingModal({
  paymentMethod = 'vietqr',
  paymentMethodLabel,
  customerEmail,
  orderId = '',
  totalAmount = 0,
  onComplete
}) {
  const modalRef = useRef(null);
  const progressBarRef = useRef(null);

  const isVietQr = paymentMethod === 'vietqr' || paymentMethod === 'bank' || !paymentMethodLabel || paymentMethodLabel.toLowerCase().includes('vietqr') || paymentMethodLabel.toLowerCase().includes('ngân hàng');

  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(10);
  const [copiedField, setCopiedField] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 mins countdown
  const [isLivePaid, setIsLivePaid] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Format VND currency
  const fmt = (v) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v || 0);

  // VietQR parameters for MBBank
  const bankConfig = DEFAULT_BANK_CONFIG;
  const cleanOrderId = orderId || `NAT-ORD-${Date.now().toString().slice(-6)}`;
  const memoText = `NAT ${cleanOrderId}`;

  const qrImageUrl = generateVietQrUrl({
    amount: totalAmount || 0,
    orderId: cleanOrderId,
    bankConfig
  });

  useGSAP(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
      );
    }
  }, { scope: modalRef });

  // Socket.io Realtime Listener for Live Payment Confirmation
  useEffect(() => {
    if (!cleanOrderId) return;
    joinOrderRoom(cleanOrderId);

    const unsubscribe = onPaymentConfirmed((data) => {
      if (data && (data.orderId === cleanOrderId || !data.orderId)) {
        setIsLivePaid(true);
        setPaymentDetails(data);
        setTimeout(() => {
          onComplete?.(data);
        }, 1500);
      }
    });

    return () => {
      unsubscribe();
      leaveOrderRoom(cleanOrderId);
    };
  }, [cleanOrderId, onComplete]);

  // Countdown timer for VietQR payment with cleanup (Vercel best practice)
  useEffect(() => {
    if (!isVietQr) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isVietQr]);

  // Non-VietQR animated progression fallback
  useEffect(() => {
    if (isVietQr) return;

    const t1 = setTimeout(() => {
      setProgressPercent(45);
      setCurrentStep(2);
    }, 800);

    const t2 = setTimeout(() => {
      setProgressPercent(85);
      setCurrentStep(3);
    }, 1800);

    const t3 = setTimeout(() => {
      setProgressPercent(100);
      setTimeout(() => {
        onComplete?.();
      }, 400);
    }, 2500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isVietQr, onComplete]);

  const handleCopy = useCallback((text, field) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedField(field);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  }, []);

  const formatMinutes = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="payment-processing-overlay">
      <div ref={modalRef} className={`payment-processing-card ${isVietQr ? 'vietqr-modal-card' : ''}`}>
        {isVietQr ? (
          /* 🏦 VIETQR MBBANK PAYMENT UI */
          <div className="vietqr-payment-container">
            {/* Header */}
            <div className="vietqr-modal-header">
              <div className="vietqr-badge-pill">
                <Building2 size={16} color="#1c69d4" />
                <span>MBBank NAPAS 24/7</span>
              </div>
              <div className="vietqr-countdown-box">
                <Clock size={14} color="#f59e0b" />
                <span>Đơn hết hạn sau: <strong>{formatMinutes(timeLeft)}</strong></span>
              </div>
            </div>

            <h3 className="processing-title" style={{ marginTop: '8px' }}>
              QUÉT MÃ VIETQR THANH TOÁN
            </h3>
            <p className="processing-sub" style={{ marginBottom: '16px' }}>
              Mở ứng dụng <strong>MBBank</strong> hoặc bất kỳ App Ngân hàng / Ví MoMo để quét mã thanh toán tự động.
            </p>

            <div className="vietqr-body-grid">
              {/* Left: Dynamic QR Image with MBBank Framing */}
              <div className="vietqr-image-frame">
                <div className="qr-image-wrapper">
                  <img
                    src={qrImageUrl}
                    alt={`VietQR MBBank ${bankConfig.accountNo}`}
                    className="vietqr-dynamic-img"
                  />
                </div>
                <div className="qr-security-note">
                  <Lock size={12} color="#16a34a" />
                  <span>Xác thực thanh toán bảo mật NAPAS</span>
                </div>
              </div>

              {/* Right: Bank Transfer Information Details with 1-Click Copy */}
              <div className="vietqr-details-table">
                {/* Bank Name */}
                <div className="vietqr-row">
                  <span className="row-label">Ngân hàng</span>
                  <span className="row-value font-bold">{bankConfig.bankName}</span>
                </div>

                {/* Account Number */}
                <div className="vietqr-row highlight-row">
                  <div className="row-meta">
                    <span className="row-label">Số tài khoản (STK)</span>
                    <strong className="row-value copyable-val">{bankConfig.accountNo}</strong>
                  </div>
                  <button
                    type="button"
                    className={`btn-copy-chip ${copiedField === 'stk' ? 'copied' : ''}`}
                    onClick={() => handleCopy(bankConfig.accountNo, 'stk')}
                    title="Sao chép số tài khoản"
                  >
                    {copiedField === 'stk' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedField === 'stk' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* Account Name */}
                <div className="vietqr-row">
                  <div className="row-meta">
                    <span className="row-label">Chủ tài khoản</span>
                    <strong className="row-value">{bankConfig.accountName}</strong>
                  </div>
                  <button
                    type="button"
                    className={`btn-copy-chip ${copiedField === 'name' ? 'copied' : ''}`}
                    onClick={() => handleCopy(bankConfig.accountName, 'name')}
                    title="Sao chép tên chủ tài khoản"
                  >
                    {copiedField === 'name' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedField === 'name' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* Total Amount */}
                <div className="vietqr-row highlight-row amount-row">
                  <div className="row-meta">
                    <span className="row-label">Số tiền cần thanh toán</span>
                    <strong className="row-value text-red">{fmt(totalAmount)}</strong>
                  </div>
                  <button
                    type="button"
                    className={`btn-copy-chip ${copiedField === 'amount' ? 'copied' : ''}`}
                    onClick={() => handleCopy(String(totalAmount), 'amount')}
                    title="Sao chép số tiền"
                  >
                    {copiedField === 'amount' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>

                {/* Order Memo */}
                <div className="vietqr-row highlight-row">
                  <div className="row-meta">
                    <span className="row-label">Nội dung chuyển khoản (bắt buộc)</span>
                    <strong className="row-value text-blue">{memoText}</strong>
                  </div>
                  <button
                    type="button"
                    className={`btn-copy-chip ${copiedField === 'memo' ? 'copied' : ''}`}
                    onClick={() => handleCopy(memoText, 'memo')}
                    title="Sao chép nội dung chuyển khoản"
                  >
                    {copiedField === 'memo' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedField === 'memo' ? 'Đã chép' : 'Sao chép'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Socket Payment Status Banner */}
            {isLivePaid ? (
              <div className="vietqr-live-paid-banner" style={{
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#16a34a'
              }}>
                <CheckCircle2 size={24} className="text-green-500 animate-bounce" />
                <div>
                  <strong style={{ display: 'block', fontSize: '15px' }}>
                    Đã Nhận Tiền Thành Công (Realtime Socket.io)!
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Mã GD: {paymentDetails?.transactionCode || 'MB-REALTIME'} • Đang hoàn tất đơn hàng...
                  </span>
                </div>
              </div>
            ) : (
              <div className="vietqr-realtime-listening" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '12px',
                color: '#64748b',
                marginBottom: '12px',
                padding: '6px 12px',
                background: '#f8fafc',
                borderRadius: '6px',
                border: '1px dashed #cbd5e1'
              }}>
                <span className="live-pulse-dot" style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e',
                  display: 'inline-block',
                  animation: 'pulse 1.5s infinite'
                }} />
                <span>Hệ thống đang tự động lắng nghe xác nhận từ MBBank qua Socket.io Realtime.</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="vietqr-actions-bar">
              <button
                type="button"
                className="btn btn-red btn-confirm-transferred hover-btn-effect"
                onClick={() => onComplete?.()}
              >
                <CheckCircle2 size={18} />
                <span>TÔI ĐÃ CHUYỂN KHOẢN THÀNH CÔNG</span>
              </button>
              <a
                href={qrImageUrl}
                target="_blank"
                rel="noreferrer"
                download={`VietQR_MBBank_${cleanOrderId}.png`}
                className="btn btn-outline-dark btn-download-qr"
              >
                <Download size={16} />
                <span>Tải ảnh mã QR</span>
              </a>
            </div>
          </div>
        ) : (
          /* 💳 STANDARD GATEWAY ANIMATION (MOMO, ZALOPAY, CARD, ETC.) */
          <>
            <div className="payment-spinner-container">
              <div className="payment-spinner-ring" />
              <Loader2 size={36} className="payment-spinner-icon" color="#1c69d4" />
            </div>

            <h3 className="processing-title">ĐANG XỬ LÝ THANH TOÁN</h3>
            <p className="processing-sub">
              Vui lòng không đóng trình duyệt. Hệ thống đang kết nối cổng thanh toán bảo mật.
            </p>

            <div className="payment-progress-wrapper">
              <div className="payment-progress-track">
                <div
                  ref={progressBarRef}
                  className="payment-progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="payment-progress-text">{progressPercent}%</span>
            </div>

            <div className="payment-steps-list">
              <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                <div className="step-ic-box">
                  {currentStep > 1 ? <CheckCircle2 size={16} color="#22c55e" /> : <ShieldCheck size={16} />}
                </div>
                <span>Xác thực thông tin đơn hàng &amp; cấu hình</span>
              </div>

              <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                <div className="step-ic-box">
                  {currentStep > 2 ? <CheckCircle2 size={16} color="#22c55e" /> : <CreditCard size={16} />}
                </div>
                <span>Kết nối thanh toán qua {paymentMethodLabel || 'Cổng thanh toán'}</span>
              </div>

              <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
                <div className="step-ic-box">
                  {progressPercent === 100 ? <CheckCircle2 size={16} color="#22c55e" /> : <Mail size={16} />}
                </div>
                <span>Khởi tạo hóa đơn &amp; gửi Email tới {customerEmail || 'khách hàng'}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
