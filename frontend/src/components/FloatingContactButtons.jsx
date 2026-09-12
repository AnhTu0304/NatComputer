import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X } from 'lucide-react';

import messengerIcon from '../image/messengericon.png';
import zaloIcon from '../image/zaloicon.png';
import zaloQrImg from '../image/zalo-qr-code.png';

gsap.registerPlugin(useGSAP);

export default function FloatingContactButtons() {
  const containerRef = useRef(null);
  const modalRef = useRef(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  useGSAP(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.6,
        delay: 0.5,
        ease: 'back.out(1.7)',
      });
    }
  }, { scope: containerRef });

  useGSAP(() => {
    if (isQrModalOpen && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
      );
    }
  }, [isQrModalOpen]);

  return (
    <>
      <div ref={containerRef} className="floating-contact-wrap">
        {/* Messenger Button — Links directly to Facebook */}
        <a
          href="https://www.facebook.com/tu.ngo.358912"
          target="_blank"
          rel="noopener noreferrer"
          className="floating-btn floating-btn-messenger"
          title="Liên hệ Facebook"
          aria-label="Liên hệ Facebook"
        >
          <img src={messengerIcon} alt="Facebook Messenger" className="contact-icon-img" />
        </a>

        {/* Zalo Button — Opens Zalo QR Code Modal */}
        <button
          type="button"
          onClick={() => setIsQrModalOpen(true)}
          className="floating-btn floating-btn-zalo"
          title="Quét mã QR Zalo"
          aria-label="Quét mã QR Zalo"
        >
          <img src={zaloIcon} alt="Zalo" className="contact-icon-img" />
        </button>
      </div>

      {/* Zalo QR Code Modal Overlay */}
      {isQrModalOpen && (
        <div
          className="zalo-qr-overlay"
          onClick={() => setIsQrModalOpen(false)}
        >
          <div
            ref={modalRef}
            className="zalo-qr-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="zalo-qr-close"
              onClick={() => setIsQrModalOpen(false)}
              aria-label="Đóng"
            >
              <X size={20} color="#64748b" />
            </button>
            <img src={zaloQrImg} alt="Mã QR Zalo Tú" className="zalo-qr-img" />
          </div>
        </div>
      )}
    </>
  );
}
