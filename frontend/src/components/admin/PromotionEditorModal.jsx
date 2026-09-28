import React, { useState, useEffect } from 'react';
import {
  X, Tag, Percent, DollarSign, Truck, Gift, ShoppingBag,
  Calendar, Check, AlertCircle, Copy, Sparkles, Layers,
  Users, Info, ChevronRight, ShieldCheck, Clock
} from 'lucide-react';

const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

export default function PromotionEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  categories = [],
  products = []
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'percentage', // percentage | fixed | product | category | shipping | bundle
    value: 10,
    minOrder: 5000000,
    maxDiscount: 1500000,
    applicableCategory: 'ALL',
    applicableProduct: 'ALL',
    eligibility: 'ALL', // ALL | NEW | VIP | RETURNING
    usageLimit: 100,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    giftItemName: 'Chuột Gaming Không Dây Siêu Nhẹ 2.4G',
    description: ''
  });

  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        code: initialData.code || '',
        type: initialData.type || 'percentage',
        value: initialData.value ?? 10,
        minOrder: initialData.minOrder ?? 5000000,
        maxDiscount: initialData.maxDiscount ?? 1500000,
        applicableCategory: initialData.applicableCategory || 'ALL',
        applicableProduct: initialData.applicableProduct || 'ALL',
        eligibility: initialData.eligibility || 'ALL',
        usageLimit: initialData.usageLimit ?? 100,
        startDate: initialData.startDate || new Date().toISOString().slice(0, 10),
        endDate: initialData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        giftItemName: initialData.giftItemName || 'Chuột Gaming Không Dây Siêu Nhẹ 2.4G',
        description: initialData.description || ''
      });
    } else {
      setFormData({
        name: '',
        code: '',
        type: 'percentage',
        value: 10,
        minOrder: 5000000,
        maxDiscount: 1500000,
        applicableCategory: 'ALL',
        applicableProduct: 'ALL',
        eligibility: 'ALL',
        usageLimit: 100,
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        giftItemName: 'Chuột Gaming Không Dây Siêu Nhẹ 2.4G',
        description: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // Auto Generate random coupon code
  const handleGenerateCode = () => {
    const prefixes = ['NAT', 'DEAL', 'VIP', 'PC', 'GAMING'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const code = `${prefix}${randomSuffix}`;
    setFormData(prev => ({ ...prev, code }));
  };

  const handleCopyCode = () => {
    if (!formData.code) return;
    navigator.clipboard?.writeText(formData.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) return;

    // Determine initial status based on date
    const now = new Date().toISOString().slice(0, 10);
    let status = 'Active';
    if (formData.startDate > now) status = 'Scheduled';
    else if (formData.endDate < now) status = 'Expired';

    onSave({
      ...formData,
      code: formData.code.toUpperCase().trim(),
      status: initialData ? initialData.status : status
    });
    onClose();
  };

  // Preview discount text
  const getPreviewDiscountHeadline = () => {
    switch (formData.type) {
      case 'percentage':
        return `GIẢM ${formData.value || 0}%`;
      case 'fixed':
        return `GIẢM ${fmt(formData.value || 0)}`;
      case 'shipping':
        return 'MIỄN PHÍ VẬN CHUYỂN';
      case 'bundle':
        return 'TẶNG QUÀ LINH KIỆN PC';
      case 'product':
        return `GIẢM ${formData.value || 0}% CHO LINH KIỆN`;
      case 'category':
        return `GIẢM ${formData.value || 0}% TOÀN DANH MỤC`;
      default:
        return 'ƯU ĐÃI ĐẶC BIỆT';
    }
  };

  return (
    <div className="order-detail-backdrop" onClick={onClose}>
      <div className="promo-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="drawer-header-strip">
          <div className="drawer-title-group">
            <div className="order-number-title">
              <Tag size={20} color="#3b82f6" />
              <span>{isEditing ? 'Chỉnh Sửa Chương Trình Khuyến Mãi' : 'Tạo Chiến Dịch Khuyến Mãi & Voucher Mới'}</span>
            </div>
            <div className="order-meta-sub">
              <span>Hỗ trợ 6 hình thức chiết khấu và giả lập giao diện trực quan thời gian thực</span>
            </div>
          </div>
          <button type="button" className="btn-drawer-close" onClick={onClose} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: 2 Columns (Form Left + Live Customer Preview Right) */}
        <div className="promo-modal-body">
          {/* COLUMN 1: FORM CONFIGURATION */}
          <div className="promo-form-col">
            <form onSubmit={handleSubmit} className="tail-crud-form">
              {/* SECTION: BASIC INFO */}
              <div className="promo-form-section">
                <h4 className="promo-sec-title"><Tag size={15} /> THÔNG TIN CỐT LÕI</h4>
                <div className="form-input-box">
                  <label>Tên Chương Trình Khuyến Mãi *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: SIÊU DEAL MÙA HÈ - LẮP PC RTX 4070 GIẢM 10%"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-input-box">
                    <label>Mã Voucher (Coupon Code) *</label>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        type="text"
                        required
                        placeholder="VD: NATGAMING10"
                        style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      />
                      <button
                        type="button"
                        className="btn-tail-secondary"
                        onClick={handleGenerateCode}
                        title="Tạo mã ngẫu nhiên"
                        style={{ whiteSpace: 'nowrap', padding: '0 10px', fontSize: 11 }}
                      >
                        <Sparkles size={13} /> Tạo Mã
                      </button>
                    </div>
                  </div>

                  <div className="form-input-box">
                    <label>Loại Ưu Đãi (Promotion Type) *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="percentage">Phần trăm (%) - Percentage Discount</option>
                      <option value="fixed">Số tiền cố định (VNĐ) - Fixed Amount</option>
                      <option value="product">Giảm theo Linh kiện cụ thể - Product Discount</option>
                      <option value="category">Giảm theo Danh mục - Category Discount</option>
                      <option value="shipping">Miễn phí giao hàng - Free Shipping</option>
                      <option value="bundle">Mua kèm nhận quà - Buy X Get Y</option>
                    </select>
                  </div>
                </div>

                <div className="form-input-box">
                  <label>Mô Tả Ngắn Hiển Thị Khách Hàng</label>
                  <input
                    type="text"
                    placeholder="VD: Áp dụng cho đơn hàng linh kiện build PC từ 15 triệu đồng..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {/* SECTION: DISCOUNT VALUES & LIMITS */}
              <div className="promo-form-section">
                <h4 className="promo-sec-title"><DollarSign size={15} /> GIÁ TRỊ GIẢM & ĐIỀU KIỆN</h4>
                
                {formData.type === 'bundle' ? (
                  <div className="form-input-box">
                    <label>Tên Quà Tặng Linh Kiện (Gift Item) *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Tặng Chuột Gaming Logitech G102 hoặc Tai nghe RGB"
                      value={formData.giftItemName}
                      onChange={(e) => setFormData({ ...formData, giftItemName: e.target.value })}
                    />
                  </div>
                ) : formData.type !== 'shipping' ? (
                  <div className="form-grid-3">
                    <div className="form-input-box">
                      <label>
                        Mức Giảm ({formData.type === 'percentage' || formData.type === 'product' || formData.type === 'category' ? '%' : 'VNĐ'}) *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        placeholder={formData.type === 'percentage' ? '10' : '500000'}
                        value={formData.value}
                        onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Đơn Tối Thiểu (VNĐ)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="5000000"
                        value={formData.minOrder}
                        onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                      />
                    </div>
                    <div className="form-input-box">
                      <label>Giảm Tối Đa (VNĐ)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="1500000"
                        value={formData.maxDiscount}
                        onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="form-input-box">
                    <label>Đơn Hàng Tối Thiểu Để Miễn Phí Vận Chuyển (VNĐ)</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="5000000"
                      value={formData.minOrder}
                      onChange={(e) => setFormData({ ...formData, minOrder: Number(e.target.value) })}
                    />
                  </div>
                )}

                {/* Scope: Categories or Products */}
                {(formData.type === 'category' || formData.type === 'product') && (
                  <div className="form-grid-2" style={{ marginTop: 10 }}>
                    {formData.type === 'category' && (
                      <div className="form-input-box">
                        <label>Chọn Danh Mục Áp Dụng *</label>
                        <select
                          value={formData.applicableCategory}
                          onChange={(e) => setFormData({ ...formData, applicableCategory: e.target.value })}
                        >
                          <option value="ALL">Toàn Bộ Danh Mục Linh Kiện</option>
                          <option value="VGA">Card Màn Hình (VGA / GPU)</option>
                          <option value="CPU">Bộ Vi Xử Lý (CPU)</option>
                          <option value="RAM">Bộ Nhớ Trong (RAM DDR5/DDR4)</option>
                          <option value="SSD">Ổ Cứng Thể Rắn (SSD NVMe)</option>
                          <option value="MAINBOARD">Bo Mạch Chủ (Mainboard)</option>
                          <option value="PC_GAMING">Dàn Máy PC Gaming Lắp Sẵn</option>
                        </select>
                      </div>
                    )}

                    {formData.type === 'product' && (
                      <div className="form-input-box">
                        <label>Chọn Dòng Linh Kiện Cụ Thể *</label>
                        <select
                          value={formData.applicableProduct}
                          onChange={(e) => setFormData({ ...formData, applicableProduct: e.target.value })}
                        >
                          <option value="ALL">Tất cả sản phẩm chỉ định</option>
                          <option value="RTX4070">NVIDIA GeForce RTX 4070 SUPER</option>
                          <option value="RTX4090">ASUS ROG Strix GeForce RTX 4090</option>
                          <option value="I914900K">Intel Core i9-14900K High-End</option>
                          <option value="R7950X3D">AMD Ryzen 9 7950X3D</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SECTION: AUDIENCE & SCHEDULE */}
              <div className="promo-form-section">
                <h4 className="promo-sec-title"><Users size={15} /> ĐỐI TƯỢNG & THỜI HẠN</h4>
                <div className="form-grid-2">
                  <div className="form-input-box">
                    <label>Đối Tượng Khách Hàng (Eligibility)</label>
                    <select
                      value={formData.eligibility}
                      onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    >
                      <option value="ALL">Tất cả khách hàng (Public)</option>
                      <option value="NEW">Khách hàng mới đăng ký (New Customers)</option>
                      <option value="VIP">Hội viên VIP (Gold & Diamond VIP)</option>
                      <option value="RETURNING">Khách hàng thân thiết quay lại</option>
                    </select>
                  </div>

                  <div className="form-input-box">
                    <label>Giới Hạn Lượt Sử Dụng (Usage Limit)</label>
                    <input
                      type="number"
                      min="1"
                      placeholder="100"
                      value={formData.usageLimit}
                      onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-input-box">
                    <label>Ngày Bắt Đầu (Start Date)</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-input-box">
                    <label>Ngày Kết Thúc (End Date)</label>
                    <input
                      type="date"
                      required
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="promo-form-footer">
                <button type="button" className="btn-tail-secondary" onClick={onClose}>
                  Hủy Bỏ
                </button>
                <button type="submit" className="btn-tail-primary">
                  <Check size={15} /> {isEditing ? 'Lưu Cập Nhật Khuyến Mãi' : 'Kích Hoạt Chương Trình'}
                </button>
              </div>
            </form>
          </div>

          {/* COLUMN 2: LIVE CUSTOMER VOUCHER PREVIEW */}
          <div className="promo-preview-col">
            <div className="preview-sticky-wrap">
              <div className="preview-col-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={16} color="#3b82f6" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
                    GIAO DIỆN KHÁCH HÀNG (LIVE PREVIEW)
                  </span>
                </div>
                <span className="live-pulse-badge">LIVE SIMULATOR</span>
              </div>
              <p className="preview-col-sub">
                Hình ảnh voucher thực tế khách hàng sẽ thấy trên Storefront và giỏ thanh toán:
              </p>

              {/* STOREFRONT TICKET CARD */}
              <div className="customer-voucher-ticket">
                <div className="ticket-left">
                  <div className="ticket-badge-tag">
                    {formData.type === 'shipping' ? <Truck size={14} /> : (formData.type === 'bundle' ? <Gift size={14} /> : <Percent size={14} />)}
                    <span>{formData.type.toUpperCase()}</span>
                  </div>
                  <div className="ticket-headline">
                    {getPreviewDiscountHeadline()}
                  </div>
                  <div className="ticket-title-sub">
                    {formData.name || 'Tên chương trình khuyến mãi'}
                  </div>
                  <div className="ticket-terms-list">
                    <div>• Đơn tối thiểu: <strong>{fmt(formData.minOrder || 0)}</strong></div>
                    {formData.type === 'percentage' && (
                      <div>• Giảm tối đa: <strong>{fmt(formData.maxDiscount || 0)}</strong></div>
                    )}
                    {formData.type === 'bundle' && (
                      <div style={{ color: '#b45309' }}>• Quà tặng: <strong>{formData.giftItemName}</strong></div>
                    )}
                    <div>• Hạn dùng đến: <strong>{formData.endDate}</strong></div>
                  </div>
                </div>

                <div className="ticket-divider">
                  <div className="notch notch-top"></div>
                  <div className="dashed-line"></div>
                  <div className="notch notch-bottom"></div>
                </div>

                <div className="ticket-right">
                  <div className="ticket-code-label">MÃ GIẢM GIÁ</div>
                  <div className="ticket-code-display">
                    {formData.code || 'NAT_DEAL'}
                  </div>
                  <button
                    type="button"
                    className="btn-ticket-copy"
                    onClick={handleCopyCode}
                  >
                    {copiedCode ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedCode ? 'ĐÃ COPY' : 'SAO CHÉP'}</span>
                  </button>
                  <div className="ticket-brand-watermark">NAT COMPUTER</div>
                </div>
              </div>

              {/* Context Summary Cards */}
              <div className="preview-meta-panel">
                <div className="preview-meta-row">
                  <span className="meta-lbl"><Users size={13} /> Khách áp dụng:</span>
                  <strong className="meta-val">
                    {formData.eligibility === 'ALL' ? 'Mọi khách hàng' : (formData.eligibility === 'NEW' ? 'Khách mới đăng ký' : 'Khách VIP')}
                  </strong>
                </div>
                <div className="preview-meta-row">
                  <span className="meta-lbl"><ShoppingBag size={13} /> Phạm vi linh kiện:</span>
                  <strong className="meta-val">
                    {formData.type === 'category' ? `Danh mục ${formData.applicableCategory}` : (formData.type === 'product' ? 'Linh kiện chỉ định' : 'Toàn bộ cửa hàng')}
                  </strong>
                </div>
                <div className="preview-meta-row">
                  <span className="meta-lbl"><Clock size={13} /> Giới hạn phát hành:</span>
                  <strong className="meta-val">{formData.usageLimit} lượt sử dụng</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
