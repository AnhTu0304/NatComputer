import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  Gift,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import CategoryCarousel from '../components/CategoryCarousel';
import { GAMING_PCS, HOT_DEALS_PCS, OFFICE_PCS, COMPONENTS, MONITORS } from '../data/catalogData';
import api from '../services/api';

gsap.registerPlugin(useGSAP);

// Combine all product items for lookup
const ALL_PRODUCTS = [
  ...HOT_DEALS_PCS,
  ...GAMING_PCS,
  ...OFFICE_PCS,
  ...COMPONENTS,
  ...MONITORS
];

// Sample accessory items for "Sản phẩm mua kèm"
const SAMPLE_ACCESSORIES = [
  {
    id: 'acc-monitor',
    category: 'Màn Hình',
    icon: Monitor,
    name: 'Màn hình Gaming Asus TUF VG279Q3A 27" IPS 180Hz 1ms',
    price: 4390000,
    originalPrice: 4990000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-keyboard',
    category: 'Bàn Phím',
    icon: Keyboard,
    name: 'Bàn phím cơ AKKO 3087 v2 DS Switch Pink Hotswap RGB',
    price: 1290000,
    originalPrice: 1590000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-mouse',
    category: 'Chuột Gaming',
    icon: Mouse,
    name: 'Chuột Không Dây Gaming Logitech G304 Lightspeed Wireless',
    price: 790000,
    originalPrice: 990000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-headset',
    category: 'Tai Nghe',
    icon: Headphones,
    name: 'Tai nghe Gaming HyperX Cloud III Black / Red 7.1 Surround',
    price: 2190000,
    originalPrice: 2690000,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
  },
];

export default function ProductDetailPage({ productId: productIdProp, onAddToCart }) {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const rootRef = useRef(null);
  const mainImageRef = useRef(null);

  const [liveProducts, setLiveProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getProducts().then(res => {
      if (isMounted && res && res.products && res.products.length > 0) {
        setLiveProducts(res.products);
      }
    }).catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const combinedCatalog = liveProducts.length > 0 ? [...liveProducts, ...ALL_PRODUCTS] : ALL_PRODUCTS;

  // Determine current active product
  const targetId = paramId || productIdProp || 'deal-ultra-7-5070';
  const product = combinedCatalog.find(p => p.id === targetId) || HOT_DEALS_PCS[0];

  // Component state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedAccessories, setSelectedAccessories] = useState(['acc-monitor']);
  const [activeTab, setActiveTab] = useState('description');

  // Format currency helper
  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Gallery image list (uses main product image + alternate placeholders for demonstration)
  const galleryImages = [
    product.image,
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
  ];

  // Scroll to top on product change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
  }, [targetId]);

  // GSAP animation for image switch
  const handleSelectThumbnail = (index) => {
    if (index === selectedImageIndex) return;
    if (mainImageRef.current) {
      gsap.to(mainImageRef.current, {
        opacity: 0,
        scale: 0.98,
        duration: 0.15,
        onComplete: () => {
          setSelectedImageIndex(index);
          gsap.to(mainImageRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.25,
            ease: 'power2.out',
          });
        },
      });
    } else {
      setSelectedImageIndex(index);
    }
  };

  // Toggle combo accessory selection
  const handleToggleAccessory = (accId) => {
    setSelectedAccessories(prev =>
      prev.includes(accId) ? prev.filter(id => id !== accId) : [...prev, accId]
    );
  };

  // Calculate Combo Savings & Total
  const selectedAccObjects = SAMPLE_ACCESSORIES.filter(a => selectedAccessories.includes(a.id));
  const accessoriesTotal = selectedAccObjects.reduce((acc, curr) => acc + curr.price, 0);
  const accessoriesOriginalTotal = selectedAccObjects.reduce((acc, curr) => acc + curr.originalPrice, 0);
  const comboTotal = product.price + accessoriesTotal;
  const comboSavings = (product.originalPrice ? (product.originalPrice - product.price) : 0) + (accessoriesOriginalTotal - accessoriesTotal);

  const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasOriginalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const priceSavings = hasOriginalPrice ? product.originalPrice - product.price : 0;

  // Key specifications for summary
  const specsList = product.specifications || [
    `CPU Intel Core / AMD Ryzen Gaming thế hệ mới`,
    `Mainboard MSI / ASUS DDR5 High Performance`,
    `RAM 32GB RGB DDR5 Bus 6000MHz High Speed`,
    `SSD 1TB M.2 NVMe PCIe Gen4 x4 (Đọc 7000MB/s)`,
    `VGA NVIDIA GeForce RTX 5070 / RTX 4070 Ti SUPER 16GB`,
    `Nguồn 850W 80 Plus Gold ATX 3.0 Full Modular`,
  ];

  // Detailed tech specs table data
  const techTableRows = [
    { stt: 1, item: 'Bộ vi xử lý (CPU)', desc: specsList[0] || 'Intel Core Ultra / AMD Ryzen', qty: 1, warranty: '36 Tháng' },
    { stt: 2, item: 'Bo mạch chủ (Mainboard)', desc: specsList[1] || 'MSI / ASUS Gaming DDR5', qty: 1, warranty: '36 Tháng' },
    { stt: 3, item: 'Bộ nhớ RAM', desc: specsList[2] || '32GB (2x16GB) DDR5 Bus 6000MHz RGB', qty: 1, warranty: '36 Tháng' },
    { stt: 4, item: 'Ổ cứng SSD', desc: specsList[3] || '1TB M.2 NVMe PCIe Gen4 High Speed', qty: 1, warranty: '36 Tháng' },
    { stt: 5, item: 'Card màn hình (VGA)', desc: specsList[4] || 'NVIDIA GeForce RTX 12GB / 16GB GDDR7', qty: 1, warranty: '36 Tháng' },
    { stt: 6, item: 'Nguồn máy tính (PSU)', desc: specsList[5] || '850W 80 Plus Gold ATX 3.0', qty: 1, warranty: '36 Tháng' },
    { stt: 7, item: 'Tản nhiệt CPU', desc: 'Tản nhiệt nước AIO ARGB 360mm / Tản tháp đôi cao cấp', qty: 1, warranty: '24 Tháng' },
    { stt: 8, item: 'Vỏ máy tính (Case)', desc: 'Case Kính cường lực Gaming Premium 3D + 4 Fan ARGB', qty: 1, warranty: '12 Tháng' },
  ];

  return (
    <div ref={rootRef} className="pdp-root wrap">
      {/* ── 1. BREADCRUMB ── */}
      <nav className="pdp-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="pdp-bc-sep" />
        <Link to="/#pc-gaming">PC Gaming</Link>
        <ChevronRight size={14} className="pdp-bc-sep" />
        <span className="pdp-bc-active">{product.name}</span>
      </nav>

      {/* ── 2. MAIN PRODUCT AREA (Two Columns) ── */}
      <div className="pdp-main-grid">
        {/* Left Column — Gallery Carousel */}
        <div className="pdp-gallery-col">
          <div className="pdp-main-img-box">
            {product.badge && <span className="pdp-badge">{product.badge}</span>}
            <img
              ref={mainImageRef}
              src={galleryImages[selectedImageIndex]}
              alt={product.name}
              className="pdp-main-img"
            />
            {/* Gallery Carousel Nav Buttons */}
            <button
              className="pdp-gallery-nav pdp-gallery-prev"
              aria-label="Ảnh trước"
              onClick={() => handleSelectThumbnail((selectedImageIndex - 1 + galleryImages.length) % galleryImages.length)}
            >
              <ChevronLeft size={20} color="#000" />
            </button>
            <button
              className="pdp-gallery-nav pdp-gallery-next"
              aria-label="Ảnh sau"
              onClick={() => handleSelectThumbnail((selectedImageIndex + 1) % galleryImages.length)}
            >
              <ChevronRight size={20} color="#000" />
            </button>
            <span className="pdp-gallery-counter">{selectedImageIndex + 1} / {galleryImages.length}</span>
          </div>

          {/* Thumbnails */}
          <div className="pdp-thumb-row">
            {galleryImages.map((img, idx) => (
              <button
                key={idx}
                className={`pdp-thumb-btn ${idx === selectedImageIndex ? 'active' : ''}`}
                onClick={() => handleSelectThumbnail(idx)}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column — Product Information & Sticky Purchase Panel */}
        <div className="pdp-info-col">
          <div className="pdp-info-sticky">
            {/* Title */}
            <h1 className="pdp-title">{product.name}</h1>

            {/* Meta Row: Rating, Stock, Code */}
            <div className="pdp-meta-row">
              <span className="pdp-rating">★ 4.9 (128 đánh giá)</span>
              <span className="pdp-meta-divider">•</span>
              <span className="pdp-stock-tag">Còn hàng</span>
              <span className="pdp-meta-divider">•</span>
              <span className="pdp-sku">SKU: {product.id.toUpperCase()}</span>
            </div>

            {/* Pricing Box */}
            <div className="pdp-price-box">
              <div className="pdp-price-primary-row">
                <span className="pdp-price-current">{fmt(product.price)}</span>
                {hasOriginalPrice && (
                  <span className="pdp-price-old">{fmt(product.originalPrice)}</span>
                )}
                {discountPct > 0 && (
                  <span className="pdp-discount-badge">-{discountPct}%</span>
                )}
              </div>
              {hasOriginalPrice && (
                <div className="pdp-price-savings">
                  Tiết kiệm ngay: <strong>{fmt(priceSavings)}</strong>
                </div>
              )}
            </div>

            {/* Warranty Row */}
            <div className="pdp-warranty-row">
              <ShieldCheck size={18} className="pdp-warranty-icon" />
              <span>Bảo hành chính hãng: <strong>{product.warranty || '36 Tháng'}</strong> (1 đổi 1 trong 30 ngày)</span>
            </div>

            {/* Config Summary List */}
            <div className="pdp-config-box">
              <h3 className="pdp-box-title">Cấu hình tóm tắt</h3>
              <ul className="pdp-config-list">
                {specsList.slice(0, 6).map((spec, i) => (
                  <li key={i}>
                    <CheckCircle2 size={15} className="pdp-check-icon" />
                    <span>{spec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Promotion Area */}
            <div className="pdp-promo-box">
              <div className="pdp-promo-head">
                <Gift size={16} className="pdp-promo-icon" />
                <span>KHUYẾN MÃI KÈM THEO</span>
              </div>
              <ul className="pdp-promo-list">
                {(product.promotions || [
                  'Upgrade lên SSD 1TB NVMe GEN4 thêm 500.000đ',
                  'Upgrade lên RAM 64GB DDR5 Bus 6000MHz thêm 1.400.000đ',
                  'Tặng voucher 500.000đ mua Màn hình Gaming 2K 180Hz',
                ]).map((promo, idx) => (
                  <li key={idx}>
                    <span className="pdp-promo-bullet">•</span>
                    <span>{promo}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity Selector & Purchase Actions */}
            <div className="pdp-action-area">
              <div className="pdp-qty-row">
                <span className="pdp-qty-label">Số lượng:</span>
                <div className="pdp-qty-picker">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <div className="pdp-btn-group">
                <button
                  className="btn pdp-btn-buy-now"
                  onClick={() => {
                    const itemToBuy = { ...product, quantity };
                    onAddToCart?.(itemToBuy);
                    navigate('/checkout', { state: { directBuyItem: itemToBuy } });
                  }}
                >
                  <Zap size={18} />
                  <span>ĐẶT HÀNG MUA NGAY</span>
                </button>

                <button
                  className="btn pdp-btn-add-cart"
                  onClick={() => onAddToCart?.({ ...product, quantity })}
                >
                  <ShoppingCart size={18} />
                  <span>THÊM VÀO GIỎ</span>
                </button>
              </div>
            </div>

            {/* Installment Info */}
            <div className="pdp-installment-box">
              <div className="pdp-ins-title">Hỗ trợ trả góp 0% lãi suất</div>
              <p className="pdp-ins-desc">
                Trả trước chỉ từ <strong>{fmt(Math.round(product.price * 0.3))}</strong>. Thủ tục duyệt online nhanh trong 5 phút.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. BUY TOGETHER / ACCESSORIES COMBO ── */}
      <section className="pdp-combo-section">
        <div className="pdp-section-head">
          <h2 className="pdp-section-title">SẢN PHẨM MUA KÈM GIÁ TỐT</h2>
          <p className="pdp-section-sub">Chọn thêm phụ kiện cao cấp để tối ưu hóa góc máy với ưu đãi combo</p>
        </div>

        <div className="pdp-combo-grid">
          {SAMPLE_ACCESSORIES.map((acc) => {
            const isSelected = selectedAccessories.includes(acc.id);
            const Icon = acc.icon;

            return (
              <div
                key={acc.id}
                className={`pdp-acc-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleToggleAccessory(acc.id)}
              >
                <div className="pdp-acc-check">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                  />
                </div>
                <div className="pdp-acc-img-wrap">
                  <img src={acc.image} alt={acc.name} />
                </div>
                <div className="pdp-acc-cat">
                  <Icon size={14} />
                  <span>{acc.category}</span>
                </div>
                <h4 className="pdp-acc-name">{acc.name}</h4>
                <div className="pdp-acc-price">{fmt(acc.price)}</div>
              </div>
            );
          })}
        </div>

        {/* Combo Total Calculator Bar */}
        <div className="pdp-combo-bar">
          <div className="pdp-combo-info">
            <div>
              <span className="pdp-combo-label">Tổng tiền Combo:</span>
              <span className="pdp-combo-total-price">{fmt(comboTotal)}</span>
            </div>
            {comboSavings > 0 && (
              <span className="pdp-combo-savings">Tiết kiệm tổng cộng: {fmt(comboSavings)}</span>
            )}
          </div>

          <button
            className="btn btn-blue pdp-combo-buy-btn"
            onClick={() => {
              onAddToCart?.({ ...product, quantity });
              selectedAccObjects.forEach(acc => onAddToCart?.(acc));
            }}
          >
            MUA COMBO TIẾT KIỆM <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 4. PRODUCT DESCRIPTION & DETAILED SPECS TABS ── */}
      <section className="pdp-details-section">
        <div className="pdp-tabs-header">
          <button
            className={`pdp-tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            MÔ TẢ SẢN PHẨM
          </button>
          <button
            className={`pdp-tab-btn ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => setActiveTab('specs')}
          >
            THÔNG SỐ KỸ THUẬT CHI TIẾT
          </button>
        </div>

        <div className="pdp-tab-content">
          {activeTab === 'description' && (
            <div className="pdp-description-body">
              <h3>Đánh Giá Chi Tiết {product.name}</h3>
              <p>
                <strong>{product.name}</strong> là bộ máy tính Gaming cao cấp được tối ưu hiệu năng toàn diện bởi đội ngũ chuyên gia công nghệ tại <strong>NAT Computer</strong>. Đáp ứng hoàn hảo từ các tựa game Esport đỉnh cao như <em>CS2, Valorant, League of Legends</em> cho đến những tựa game AAA hạng nặng ở độ phân giải 2K/4K như <em>Cyberpunk 2077, Black Myth: Wukong, GTA VI ready</em>.
              </p>

              <div className="pdp-desc-highlight-grid">
                <div className="pdp-desc-card">
                  <Sparkles className="pdp-desc-icon" />
                  <h4>Sức Mạnh Đồ Họa Đột Phá</h4>
                  <p>Trang bị Card đồ họa NVIDIA RTX Series kiến trúc tiên tiến, hỗ trợ công nghệ Ray Tracing siêu thực & DLSS 3.5 giúp tăng khung hình mượt mà tuyệt đối.</p>
                </div>
                <div className="pdp-desc-card">
                  <Zap className="pdp-desc-icon" />
                  <h4>Bộ Vi Xử Lý Thế Hệ Mới</h4>
                  <p>CPU đa nhân đa luồng vượt trội, tốc độ xung nhịp cao giúp xử lý tác vụ gaming, livestream và thiết kế đồ họa nặng một cách trơn tru.</p>
                </div>
              </div>

              <h4>Hệ Thống Tản Nhiệt & Tính Thẩm Mỹ Cao</h4>
              <p>
                Toàn bộ linh kiện được lắp ráp tỉ mỉ trong Vỏ Case kính cường lực Gaming cao cấp, đi kèm hệ thống quạt ARGB đồng bộ màu sắc lộng lẫy và tản nhiệt nước AIO giữ nhiệt độ linh kiện luôn mát mẻ dưới 65°C trong những trận combat kéo dài.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="pdp-specs-table-wrap">
              <table className="pdp-specs-table">
                <thead>
                  <tr>
                    <th style={{ width: '60px' }}>STT</th>
                    <th>Thiết Bị / Linh Kiện</th>
                    <th>Mô Tả Chi Tiết Thông Số</th>
                    <th style={{ width: '80px', textAlign: 'center' }}>SL</th>
                    <th style={{ width: '120px', textAlign: 'center' }}>Bảo Hành</th>
                  </tr>
                </thead>
                <tbody>
                  {techTableRows.map(row => (
                    <tr key={row.stt}>
                      <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{row.stt}</td>
                      <td style={{ fontWeight: '700', color: 'var(--c-ink)' }}>{row.item}</td>
                      <td>{row.desc}</td>
                      <td style={{ textAlign: 'center' }}>{row.qty}</td>
                      <td style={{ textAlign: 'center', color: 'var(--c-green)', fontWeight: 'bold' }}>{row.warranty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ── 5. RELATED PRODUCTS CAROUSEL (HOMEPAGE DESIGN) ── */}
      <section className="pdp-related-section">
        <CategoryCarousel
          id="related-pcs"
          eyebrow="— GỢI Ý CẤU HÌNH TƯƠNG TỰ"
          title="SẢN PHẨM CÙNG CẤU HÌNH TƯƠNG TỰ"
          items={GAMING_PCS}
          onAddToCart={onAddToCart}
        />
      </section>
    </div>
  );
}
