import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
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

// Category breadcrumb mapping helper
const getCategoryBreadcrumb = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat === 'gear' || cat === 'gaming-gear' || cat === 'accessories') {
    return { label: 'Gaming Gear', path: '/category/gaming-gear' };
  }
  if (cat === 'monitors' || cat === 'monitor') {
    return { label: 'Màn Hình', path: '/category/monitors' };
  }
  if (cat === 'components' || cat === 'component') {
    return { label: 'Linh Kiện', path: '/category/components' };
  }
  if (cat === 'office' || cat === 'pc-office') {
    return { label: 'PC Văn Phòng', path: '/category/pc-office' };
  }
  if (cat === 'workstation' || cat === 'pc-workstation') {
    return { label: 'PC Workstation', path: '/category/pc-workstation' };
  }
  return { label: 'PC Gaming', path: '/category/pc-gaming' };
};

// Category smart default promotions
const getDefaultPromotions = (category) => {
  const cat = (category || '').toLowerCase();
  if (cat === 'gear' || cat === 'gaming-gear' || cat === 'accessories') {
    return [
      'Tặng lót chuột / kê tay cao cấp chính hãng',
      'Bảo hành 1 đổi 1 trong 30 ngày nếu có lỗi NSX',
      'Miễn phí giao hàng hỏa tốc nội thành',
    ];
  }
  if (cat === 'monitors' || cat === 'monitor') {
    return [
      'Tặng cáp DisplayPort / HDMI 2.1 chính hãng',
      'Bảo hành 1 đổi 1 trong 30 ngày (bao test điểm chết)',
      'Hỗ trợ cân màu màn hình chuyên nghiệp miễn phí',
    ];
  }
  if (cat === 'components' || cat === 'component') {
    return [
      'Hỗ trợ lắp đặt và vệ sinh tra keo tản nhiệt miễn phí',
      'Bảo hành chính hãng 1 đổi 1 siêu tốc',
      'Giảm thêm 5% khi mua kèm trọn bộ linh kiện',
    ];
  }
  return [
    'Upgrade lên SSD 1TB NVMe GEN4 thêm 500.000đ',
    'Upgrade lên RAM 64GB DDR5 Bus 6000MHz thêm 1.400.000đ',
    'Tặng voucher 500.000đ mua Màn hình Gaming 2K 180Hz',
  ];
};

// Combine all product items for lookup
const ALL_PRODUCTS = [
  ...HOT_DEALS_PCS,
  ...GAMING_PCS,
  ...OFFICE_PCS,
  ...COMPONENTS,
  ...MONITORS
];

// Smart accessory catalog pool for dynamic cross-sell recommendations
export const ACCESSORY_CATALOG = [
  {
    id: 'acc-monitor',
    type: 'monitor',
    category: 'Màn Hình',
    icon: Monitor,
    name: 'Màn hình Gaming Asus TUF VG279Q3A 27" IPS 180Hz 1ms',
    price: 4390000,
    originalPrice: 4990000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-keyboard',
    type: 'keyboard',
    category: 'Bàn Phím',
    icon: Keyboard,
    name: 'Bàn phím cơ AKKO 3087 v2 DS Switch Pink Hotswap RGB',
    price: 1290000,
    originalPrice: 1590000,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-mouse',
    type: 'mouse',
    category: 'Chuột Gaming',
    icon: Mouse,
    name: 'Chuột Không Dây Gaming Logitech G304 Lightspeed Wireless',
    price: 790000,
    originalPrice: 990000,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-headset',
    type: 'headset',
    category: 'Tai Nghe',
    icon: Headphones,
    name: 'Tai nghe Gaming HyperX Cloud III Black / Red 7.1 Surround',
    price: 2190000,
    originalPrice: 2690000,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-mousepad',
    type: 'mousepad',
    category: 'Lót Chuột Gaming',
    icon: Sparkles,
    name: 'Lót chuột Gaming RGB Size XXL 900x400x4mm Bo viền Led',
    price: 250000,
    originalPrice: 350000,
    image: 'https://images.unsplash.com/photo-1616588589596-193498877e8a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-arm',
    type: 'arm',
    category: 'Giá Treo Tay Nâng',
    icon: Monitor,
    name: 'Giá treo Arm NB-F80 Gas Spring công thái học 17-32 inch',
    price: 490000,
    originalPrice: 650000,
    image: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-thermal-paste',
    type: 'thermal_paste',
    category: 'Tản Nhiệt & Phụ Kiện',
    icon: Zap,
    name: 'Keo tản nhiệt cao cấp Arctic MX-4 4g Siêu Dẫn Nhiệt',
    price: 150000,
    originalPrice: 200000,
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-fan-case',
    type: 'fan',
    category: 'Fan Tản Nhiệt',
    icon: Zap,
    name: 'Bộ 3 Fan Led ARGB Vô Cực Kèm Hub Điều Khiển Sync Main',
    price: 450000,
    originalPrice: 600000,
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'acc-gpu-bracket',
    type: 'bracket',
    category: 'Phụ Kiện VGA',
    icon: ShieldCheck,
    name: 'Giá đỡ VGA chống xệ RGB Đồng Bộ Aura Sync Nhôm CNC',
    price: 180000,
    originalPrice: 250000,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
  }
];

// Smart recommendation algorithm based on product type & compatibility matrix
export const getRecommendedAddons = (product) => {
  if (!product) return ACCESSORY_CATALOG.slice(0, 4);

  const nameLower = (product.name || '').toLowerCase();
  const catLower = (product.category || '').toLowerCase();
  const idLower = (product.id || '').toLowerCase();

  // Detect current product type
  const isMonitor = catLower.includes('monitor') || nameLower.includes('màn hình') || idLower.includes('monitor') || idLower.includes('mon-');
  const isKeyboard = nameLower.includes('bàn phím') || nameLower.includes('keyboard') || idLower.includes('keyboard') || idLower.includes('kb');
  const isMouse = !isKeyboard && (nameLower.includes('chuột') || nameLower.includes('mouse'));
  const isHeadset = nameLower.includes('tai nghe') || nameLower.includes('headphone') || nameLower.includes('headset');
  const isComponent = catLower.includes('component') || nameLower.includes('vga') || nameLower.includes('rtx') || nameLower.includes('gtx') || nameLower.includes('rx ') || nameLower.includes('cpu') || nameLower.includes('mainboard') || nameLower.includes('ram') || nameLower.includes('nguồn') || nameLower.includes('card đồ họa');

  // Exclusion & Preference Matrix
  let excludedTypes = [];
  let preferredTypes = [];

  if (isKeyboard) {
    excludedTypes = ['keyboard'];
    preferredTypes = ['mousepad', 'mouse', 'headset', 'fan'];
  } else if (isMouse) {
    excludedTypes = ['mouse'];
    preferredTypes = ['mousepad', 'keyboard', 'headset', 'monitor'];
  } else if (isHeadset) {
    excludedTypes = ['headset'];
    preferredTypes = ['mousepad', 'keyboard', 'mouse', 'monitor'];
  } else if (isMonitor) {
    excludedTypes = ['monitor'];
    preferredTypes = ['arm', 'keyboard', 'mouse', 'headset'];
  } else if (isComponent) {
    excludedTypes = ['monitor'];
    preferredTypes = ['thermal_paste', 'fan', 'bracket', 'mousepad'];
  } else {
    // Default PC: Monitor + Keyboard + Mouse + Headset
    preferredTypes = ['monitor', 'keyboard', 'mouse', 'headset'];
  }

  // Filter out self and incompatible products
  const pool = ACCESSORY_CATALOG.filter(item => {
    if (item.id === product.id) return false;
    if (item.name.toLowerCase() === nameLower) return false;
    if (excludedTypes.includes(item.type)) return false;
    return true;
  });

  // Sort by recommendation priority
  const sorted = [...pool].sort((a, b) => {
    const idxA = preferredTypes.indexOf(a.type);
    const idxB = preferredTypes.indexOf(b.type);
    const scoreA = idxA !== -1 ? idxA : 99;
    const scoreB = idxB !== -1 ? idxB : 99;
    return scoreA - scoreB;
  });

  // 10% discount on combo accessories
  return sorted.slice(0, 4).map(item => {
    const comboPrice = Math.round((item.price * 0.90) / 1000) * 1000;
    return {
      ...item,
      comboPrice,
      originalPrice: item.originalPrice || item.price,
      comboSavings: (item.originalPrice || item.price) - comboPrice,
    };
  });
};

export const SAMPLE_ACCESSORIES = ACCESSORY_CATALOG;

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

  // Dynamically compute recommended cross-sell accessories using compatibility matrix
  const recommendedAccessories = useMemo(() => {
    return getRecommendedAddons(product);
  }, [product]);

  const [selectedAccessories, setSelectedAccessories] = useState(() => {
    const initial = getRecommendedAddons(product);
    return initial.length > 0 ? [initial[0].id] : [];
  });

  // Sync selected accessory whenever product changes
  useEffect(() => {
    if (recommendedAccessories.length > 0) {
      setSelectedAccessories([recommendedAccessories[0].id]);
    } else {
      setSelectedAccessories([]);
    }
  }, [product.id, recommendedAccessories]);

  // Format currency helper
  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Dynamic gallery image list: Use product images array if available, otherwise single image
  const galleryImages = useMemo(() => {
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images.filter(Boolean);
    }
    const singleImg = product.image || product.image_url || product.img;
    return singleImg ? [singleImg] : [];
  }, [product]);

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
  const selectedAccObjects = recommendedAccessories.filter(a => selectedAccessories.includes(a.id));
  const accessoriesTotal = selectedAccObjects.reduce((acc, curr) => acc + (curr.comboPrice || curr.price), 0);
  const accessoriesOriginalTotal = selectedAccObjects.reduce((acc, curr) => acc + (curr.originalPrice || curr.price), 0);
  const comboTotal = product.price + accessoriesTotal;
  const comboSavings = (product.originalPrice ? (product.originalPrice - product.price) : 0) + (accessoriesOriginalTotal - accessoriesTotal);

  const hasOriginalPrice = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasOriginalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;
  const priceSavings = hasOriginalPrice ? product.originalPrice - product.price : 0;

  // Helper to format human-readable label from object key
  const formatSpecKey = (key) => {
    const keyMap = {
      cpu: 'Bộ vi xử lý (CPU)',
      gpu: 'Card đồ họa (VGA)',
      vga: 'Card đồ họa (VGA)',
      ram: 'Bộ nhớ RAM',
      ssd: 'Ổ cứng SSD',
      hdd: 'Ổ cứng HDD',
      mainboard: 'Bo mạch chủ (Mainboard)',
      mb: 'Bo mạch chủ (Mainboard)',
      psu: 'Nguồn máy tính (PSU)',
      power: 'Nguồn máy tính (PSU)',
      cooler: 'Tản nhiệt',
      case: 'Vỏ Case',
      casepc: 'Vỏ Case',
      monitor: 'Màn hình',
      screen: 'Màn hình',
      resolution: 'Độ phân giải',
      refreshrate: 'Tần số quét',
      panel: 'Tấm nền',
      sensor: 'Cảm biến (Sensor)',
      switch: 'Loại Switch',
      connection: 'Kết nối',
      weight: 'Trọng lượng',
      battery: 'Thời lượng pin',
      warranty: 'Bảo hành'
    };
    const lowerKey = key.toLowerCase();
    if (keyMap[lowerKey]) return keyMap[lowerKey];
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  // Detailed tech specs table data - dynamically resolved
  let techTableRows = [];

  if (Array.isArray(product.specs) && product.specs.length > 0) {
    // Array format: [{ item: '...', desc: '...', qty: 1, warranty: '36 Tháng' }]
    techTableRows = product.specs.map((row, idx) => ({
      stt: row.stt || idx + 1,
      item: row.item || row.label || row.name || `Thông số ${idx + 1}`,
      desc: row.desc || row.value || row.detail || 'Chính hãng',
      qty: row.qty ?? 1,
      warranty: row.warranty || product.warranty || '36 Tháng'
    }));
  } else if (product.specs && typeof product.specs === 'object' && Object.keys(product.specs).length > 0) {
    // Object dictionary format: { cpu: 'Core i7', gpu: 'RTX 4070', ... }
    techTableRows = Object.entries(product.specs).map(([k, v], idx) => ({
      stt: idx + 1,
      item: formatSpecKey(k),
      desc: typeof v === 'object' ? JSON.stringify(v) : String(v),
      qty: 1,
      warranty: product.warranty || '36 Tháng'
    }));
  } else if (Array.isArray(product.specifications) && product.specifications.length > 0) {
    // String array format: ['CPU: Intel...', 'RAM: 32GB...']
    techTableRows = product.specifications.map((spec, idx) => {
      const parts = spec.split(':');
      if (parts.length > 1) {
        return {
          stt: idx + 1,
          item: parts[0].trim(),
          desc: parts.slice(1).join(':').trim(),
          qty: 1,
          warranty: product.warranty || '36 Tháng'
        };
      }
      return {
        stt: idx + 1,
        item: `Thông số ${idx + 1}`,
        desc: spec,
        qty: 1,
        warranty: product.warranty || '36 Tháng'
      };
    });
  } else {
    // Fallback: only if PC show full rig breakdown, otherwise generic item info
    const isPC = !product.category || product.category === 'pc' || product.category === 'gaming';
    if (isPC) {
      techTableRows = [
        { stt: 1, item: 'Bộ vi xử lý (CPU)', desc: 'Intel Core Ultra / AMD Ryzen', qty: 1, warranty: '36 Tháng' },
        { stt: 2, item: 'Bo mạch chủ (Mainboard)', desc: 'MSI / ASUS Gaming DDR5', qty: 1, warranty: '36 Tháng' },
        { stt: 3, item: 'Bộ nhớ RAM', desc: '32GB (2x16GB) DDR5 Bus 6000MHz RGB', qty: 1, warranty: '36 Tháng' },
        { stt: 4, item: 'Ổ cứng SSD', desc: '1TB M.2 NVMe PCIe Gen4 High Speed', qty: 1, warranty: '36 Tháng' },
        { stt: 5, item: 'Card màn hình (VGA)', desc: 'NVIDIA GeForce RTX 12GB / 16GB GDDR7', qty: 1, warranty: '36 Tháng' },
        { stt: 6, item: 'Nguồn máy tính (PSU)', desc: '850W 80 Plus Gold ATX 3.0', qty: 1, warranty: '36 Tháng' },
        { stt: 7, item: 'Tản nhiệt CPU', desc: 'Tản nhiệt nước AIO ARGB 360mm / Tản tháp đôi cao cấp', qty: 1, warranty: '24 Tháng' },
        { stt: 8, item: 'Vỏ máy tính (Case)', desc: 'Case Kính cường lực Gaming Premium 3D + 4 Fan ARGB', qty: 1, warranty: '12 Tháng' },
      ];
    } else {
      techTableRows = [
        { stt: 1, item: 'Tên thiết bị', desc: product.name, qty: 1, warranty: product.warranty || '24 Tháng' },
        { stt: 2, item: 'Phân loại', desc: (product.category || 'Linh kiện').toUpperCase(), qty: 1, warranty: product.warranty || '24 Tháng' },
        { stt: 3, item: 'Tình trạng', desc: 'Mới 100% Fullbox Chính Hãng', qty: 1, warranty: product.warranty || '24 Tháng' }
      ];
    }
  }

  // Key specifications for summary box
  const specsList = Array.isArray(product.specifications) && product.specifications.length > 0
    ? product.specifications
    : techTableRows.map(r => `${r.item}: ${r.desc}`);

  const catBreadcrumb = getCategoryBreadcrumb(product.category);
  const catLower = (product.category || '').toLowerCase();
  const isGear = catLower === 'gear' || catLower === 'gaming-gear' || catLower === 'accessories';
  const isMonitor = catLower === 'monitors' || catLower === 'monitor';
  const isComponent = catLower === 'components' || catLower === 'component';

  const relatedItems = useMemo(() => {
    const sameCat = combinedCatalog.filter(
      item => item.id !== product.id && (item.category || '').toLowerCase() === catLower
    );
    if (sameCat.length >= 2) return sameCat;
    if (isGear) return SAMPLE_ACCESSORIES;
    if (isMonitor) return MONITORS;
    if (isComponent) return COMPONENTS;
    return GAMING_PCS;
  }, [product.id, catLower, combinedCatalog, isGear, isMonitor, isComponent]);

  const relatedMeta = useMemo(() => {
    if (isGear) {
      return { id: 'related-gear', eyebrow: '— GỢI Ý GAMING GEAR', title: 'SẢN PHẨM GEAR TƯƠNG TỰ' };
    }
    if (isMonitor) {
      return { id: 'related-monitors', eyebrow: '— GỢI Ý MÀN HÌNH', title: 'MÀN HÌNH CÙNG PHÂN KHÚC' };
    }
    if (isComponent) {
      return { id: 'related-components', eyebrow: '— GỢI Ý LINH KIỆN', title: 'LINH KIỆN MÁY TÍNH TƯƠNG TỰ' };
    }
    return { id: 'related-pcs', eyebrow: '— GỢI Ý CẤU HÌNH TƯƠNG TỰ', title: 'SẢN PHẨM CÙNG CẤU HÌNH TƯƠNG TỰ' };
  }, [isGear, isMonitor, isComponent]);

  return (
    <div ref={rootRef} className="pdp-root wrap">
      {/* ── 1. BREADCRUMB ── */}
      <nav className="pdp-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="pdp-bc-sep" />
        <Link to={catBreadcrumb.path}>{catBreadcrumb.label}</Link>
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
              src={galleryImages[selectedImageIndex] || product.image || product.image_url}
              alt={product.name}
              className="pdp-main-img"
            />
            {/* Gallery Carousel Nav Buttons (only when multiple images) */}
            {galleryImages.length > 1 && (
              <>
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
              </>
            )}
          </div>

          {/* Thumbnails (only when multiple images) */}
          {galleryImages.length > 1 && (
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
          )}
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

            {/* Product Description Box (Mô tả sản phẩm kết nối Database) */}
            {product.description && product.description.trim() ? (
              <div className="pdp-config-box pdp-desc-box">
                <h3 className="pdp-box-title">Mô tả sản phẩm</h3>
                <div className="pdp-desc-text-content">
                  {product.description.split('\n').filter(Boolean).map((para, idx) => (
                    <p key={idx} style={{ margin: '0 0 8px 0', fontSize: '13.5px', lineHeight: '1.6', color: '#475569' }}>
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Promotion Area */}
            <div className="pdp-promo-box">
              <div className="pdp-promo-head">
                <Gift size={16} className="pdp-promo-icon" />
                <span>KHUYẾN MÃI KÈM THEO</span>
              </div>
              <ul className="pdp-promo-list">
                {(product.promotions && product.promotions.length > 0
                  ? product.promotions
                  : getDefaultPromotions(product.category)
                ).map((promo, idx) => (
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
          {recommendedAccessories.map((acc) => {
            const isSelected = selectedAccessories.includes(acc.id);
            const Icon = acc.icon || Sparkles;

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
                <div className="pdp-acc-price-row">
                  <span className="pdp-acc-price">{fmt(acc.comboPrice || acc.price)}</span>
                  {acc.originalPrice && acc.originalPrice > (acc.comboPrice || acc.price) && (
                    <span className="pdp-acc-original-price">{fmt(acc.originalPrice)}</span>
                  )}
                </div>
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
              if (onAddToCart) {
                onAddToCart({ ...product, quantity });
                selectedAccObjects.forEach(acc => {
                  onAddToCart({
                    ...acc,
                    price: acc.comboPrice || acc.price,
                    quantity: 1,
                    isComboItem: true,
                    comboParentId: product.id
                  });
                });
              }
              navigate('/checkout');
            }}
          >
            MUA COMBO TIẾT KIỆM <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── 4. DETAILED SPECIFICATIONS (Thông Số Kỹ Thuật Chi Tiết) ── */}
      <section className="pdp-details-section">
        <div className="pdp-section-head" style={{ marginBottom: '20px' }}>
          <h2 className="pdp-section-title">THÔNG SỐ KỸ THUẬT CHI TIẾT</h2>
          <p className="pdp-section-sub">Bảng thông tin cấu hình phần cứng và thời hạn bảo hành chính hãng của {product.name}</p>
        </div>

        <div className="pdp-specs-table-wrap">
          <table className="pdp-specs-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>STT</th>
                <th>Thiết Bị / Thông Số</th>
                <th>Mô Tả Chi Tiết Thông Số</th>
                <th style={{ width: '80px', textAlign: 'center' }}>SL</th>
                <th style={{ width: '120px', textAlign: 'center' }}>Bảo Hành</th>
              </tr>
            </thead>
            <tbody>
              {techTableRows.length > 0 ? (
                techTableRows.map(row => (
                  <tr key={row.stt}>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{row.stt}</td>
                    <td style={{ fontWeight: '700', color: 'var(--c-ink)' }}>{row.item}</td>
                    <td>{row.desc}</td>
                    <td style={{ textAlign: 'center' }}>{row.qty}</td>
                    <td style={{ textAlign: 'center', color: 'var(--c-green)', fontWeight: 'bold' }}>{row.warranty}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                    Thông số kỹ thuật đang được cập nhật
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── 5. RELATED PRODUCTS CAROUSEL ── */}
      <section className="pdp-related-section">
        <CategoryCarousel
          id={relatedMeta.id}
          eyebrow={relatedMeta.eyebrow}
          title={relatedMeta.title}
          items={relatedItems}
          onAddToCart={onAddToCart}
        />
      </section>
    </div>
  );
}
