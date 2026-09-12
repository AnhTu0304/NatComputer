import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, X, ShieldAlert } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export default function AuthRequireNoticeModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const modalRef = useRef(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-notice-overlay" onClick={onClose}>
      <div ref={modalRef} className="auth-notice-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="auth-notice-close" onClick={onClose}>
          <X size={18} />
        </button>

        <div className="auth-notice-icon-box">
          <ShieldAlert size={36} color="#e22718" />
        </div>

        <h3 className="auth-notice-title">VUI LÒNG ĐĂNG NHẬP TÀI KHOẢN</h3>
        <p className="auth-notice-desc">
          Bạn cần đăng nhập hoặc tạo tài khoản <strong>NAT COMPUTER</strong> mới có thể thêm sản phẩm vào giỏ hàng và tiến hành thanh toán.
        </p>

        <div className="auth-notice-actions">
          <button
            type="button"
            className="btn btn-red btn-block hover-btn-effect"
            onClick={() => {
              onClose();
              navigate('/login');
            }}
          >
            <LogIn size={16} /> CHUYỂN SANG TRANG ĐĂNG NHẬP NGAY
          </button>
          <button
            type="button"
            className="btn btn-outline-dark btn-block"
            onClick={onClose}
          >
            Để sau (Tiếp tục xem)
          </button>
        </div>
      </div>
    </div>
  );
}
