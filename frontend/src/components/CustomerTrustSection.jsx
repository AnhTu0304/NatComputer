import React, { useState } from 'react';
import {
  Truck,
  RotateCcw,
  CreditCard,
  Headphones,
  Plus,
  Minus
} from 'lucide-react';

const SATISFACTION_POLICIES = [
  {
    id: 1,
    title: '1. Liên hệ chăm sóc khách hàng dễ dàng',
    content: 'Quý khách có thể liên hệ trực tiếp qua Hotline 088.697.6868, Zalo Official NAT Computer hoặc live chat trên website để được chuyên viên kỹ thuật hỗ trợ 24/7 tức thì trong 30 giây.'
  },
  {
    id: 2,
    title: '2. Giao hàng nhanh trong 2 giờ mà không thu thêm phí',
    content: 'Áp dụng cho mọi đơn hàng máy tính PC và linh kiện trong khu vực nội thành. Đội ngũ kỹ thuật viên NAT Computer sẽ giao tận nơi, lắp ráp hoàn chỉnh và hướng dẫn sử dụng hoàn toàn miễn phí.'
  },
  {
    id: 3,
    title: '3. Miễn phí lên đời và trải nghiệm sản phẩm trong vòng 15 ngày',
    content: 'Khách hàng có quyền đổi sang bất kỳ dòng sản phẩm cấu hình cao hơn hoặc tương đương mà không mất bất kỳ chi phí khấu hao nào trong 15 ngày đầu sử dụng.'
  },
  {
    id: 4,
    title: '4. Cam kết thu cũ đổi mới trọn đời với tất cả các sản phẩm Gaming Gear và linh kiện máy tính',
    content: 'NAT Computer hỗ trợ chính sách trợ giá lên tới 20% khi quý khách có nhu cầu đổi cũ lấy mới linh kiện (VGA, CPU, Main, RAM, Màn hình, Gear), cam kết thủ tục nhanh gọn trong 15 phút.'
  },
  {
    id: 5,
    title: '5. Cho mượn sản phẩm miễn phí thay thế trong thời gian bảo hành tại NAT COMPUTER',
    content: 'Trong thời gian sản phẩm của quý khách được kiểm tra hoặc gửi hãng bảo hành, NAT Computer sẽ cho quý khách mượn ngay linh kiện/dàn máy tương đương để đảm bảo công việc và giải trí không bị gián đoạn.'
  }
];

export default function CustomerTrustSection({ className = '' }) {
  // Single-active accordion state: clicking one closes any other open item
  const [activePolicyId, setActivePolicyId] = useState(null);

  const togglePolicy = (id) => {
    setActivePolicyId(prev => (prev === id ? null : id));
  };

  return (
    <section className={`customer-trust-section wrap ${className}`}>
      {/* ── 1. 4 TRUST PILLARS (Tiêu Chuẩn Dịch Vụ) ── */}
      <div className="cart-trust-pillars-bar">
        <div className="trust-pillar-item">
          <div className="trust-pillar-icon">
            <Truck size={28} />
          </div>
          <div className="trust-pillar-text">
            <h4>GIAO HÀNG TOÀN QUỐC</h4>
            <p>Giao hàng trước, trả tiền sau COD</p>
          </div>
        </div>

        <div className="trust-pillar-item">
          <div className="trust-pillar-icon">
            <RotateCcw size={28} />
          </div>
          <div className="trust-pillar-text">
            <h4>ĐỔI TRẢ DỄ DÀNG</h4>
            <p>Đổi mới trong 30 ngày đầu</p>
          </div>
        </div>

        <div className="trust-pillar-item">
          <div className="trust-pillar-icon">
            <CreditCard size={28} />
          </div>
          <div className="trust-pillar-text">
            <h4>THANH TOÁN TIỆN LỢI</h4>
            <p>Trả tiền mặt, chuyển khoản, trả góp 0%</p>
          </div>
        </div>

        <div className="trust-pillar-item">
          <div className="trust-pillar-icon">
            <Headphones size={28} />
          </div>
          <div className="trust-pillar-text">
            <h4>HỖ TRỢ NHIỆT TÌNH</h4>
            <p>Tư vấn tổng đài miễn phí 24/7</p>
          </div>
        </div>
      </div>

      {/* ── 2. CAM KẾT 100% HÀI LÒNG (Single-Active Accordion) ── */}
      <div className="cart-satisfaction-section">
        <div className="satisfaction-header">
          <span className="satisfaction-eyebrow">Trải nghiệm mua sắm tại NAT COMPUTER</span>
          <h2 className="satisfaction-title">
            Cam Kết 100% <span>Hài Lòng</span>
          </h2>
        </div>

        <div className="satisfaction-accordion-card">
          {SATISFACTION_POLICIES.map((policy) => {
            const isOpen = activePolicyId === policy.id;
            return (
              <div
                key={policy.id}
                className={`policy-accordion-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="policy-accordion-btn"
                  onClick={() => togglePolicy(policy.id)}
                  aria-expanded={isOpen}
                >
                  <span className="policy-accordion-title">{policy.title}</span>
                  <span className={`policy-accordion-toggle-icon ${isOpen ? 'is-open' : ''}`}>
                    {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                  </span>
                </button>

                <div className={`policy-accordion-collapse ${isOpen ? 'expanded' : ''}`}>
                  <div className="policy-accordion-body">
                    <p>{policy.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
