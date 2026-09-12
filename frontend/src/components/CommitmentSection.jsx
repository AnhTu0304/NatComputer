import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShieldCheck, RefreshCw, BadgeCheck, Truck } from 'lucide-react';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const COMMITMENTS = [
  {
    icon: ShieldCheck,
    title: 'BẢO HÀNH TẬN NƠI',
    desc: 'Bảo hành lên tới 36 tháng, kỹ thuật viên hỗ trợ tận nhà 24/7.',
  },
  {
    icon: RefreshCw,
    title: 'ĐỔI TRẢ 1-1 TRONG 30 NGÀY',
    desc: 'Lỗi do nhà sản xuất đổi mới hoàn toàn, không qua trung gian.',
  },
  {
    icon: BadgeCheck,
    title: 'CHÍNH HÃNG 100%',
    desc: 'Nhập khẩu chính ngạch, có đầy đủ hóa đơn VAT và bảo hành quốc tế.',
  },
  {
    icon: Truck,
    title: 'GIAO HÀNG HỎA TỐC',
    desc: 'Miễn phí giao nội thành trong 2 giờ, hỗ trợ lắp đặt trọn gói.',
  },
];

export default function CommitmentSection() {
  const rootRef = useRef(null);

  useGSAP(() => {
    gsap.from('.cm-head', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 85%' },
      y: 24, opacity: 0, duration: 0.6, ease: 'power2.out',
    });
    gsap.from('.cm-item', {
      scrollTrigger: { trigger: rootRef.current, start: 'top 80%' },
      y: 28, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
    });
  }, { scope: rootRef });

  return (
    <section id="commitment" ref={rootRef} className="cm-section">
      <div className="wrap">
        <div className="cm-head section-head">
          <div className="section-eyebrow">
            <div className="eyebrow-line" />
            <span className="t-label muted">— CAM KẾT VỚI KHÁCH HÀNG</span>
          </div>
        </div>

        <div className="cm-grid">
          {COMMITMENTS.map(c => (
            <div key={c.title} className="cm-item anim-t">
              <c.icon size={28} color="var(--c-blue)" strokeWidth={1.5} />
              <h3 className="t-title ink" style={{ margin: 'var(--sp-md) 0 6px', fontSize: 15 }}>{c.title}</h3>
              <p className="t-body-s muted">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}