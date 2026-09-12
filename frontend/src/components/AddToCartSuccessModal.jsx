import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Check } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export default function AddToCartSuccessModal({ isOpen, onClose }) {
  const modalRef = useRef(null);
  const iconRef = useRef(null);

  useGSAP(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.8, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'back.out(1.7)' }
      );
      if (iconRef.current) {
        gsap.fromTo(
          iconRef.current,
          { scale: 0.5, rotate: -20 },
          { scale: 1, rotate: 0, duration: 0.4, delay: 0.1, ease: 'elastic.out(1, 0.5)' }
        );
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="cart-success-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        className="cart-success-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Red/Orange Circular Checkmark Icon matching image */}
        <div ref={iconRef} className="cart-success-icon-wrap">
          <Check size={38} strokeWidth={3.5} color="#ff4d2d" />
        </div>

        {/* Success Message Text matching reference image */}
        <div className="cart-success-text">
          <p className="cart-success-line1">Thêm sản phẩm vào giỏ hàng</p>
          <p className="cart-success-line2">thành công!</p>
        </div>
      </div>
    </div>
  );
}
