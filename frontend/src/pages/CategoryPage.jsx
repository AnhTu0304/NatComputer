import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, useLocation, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  X,
  RotateCcw,
  CheckCircle2,
  Gift,
  ShoppingCart,
  Truck,
  RotateCcw as ReturnIcon,
  CreditCard,
  Headphones,
  ArrowRightLeft,
  Zap
} from 'lucide-react';
import { GAMING_PCS, HOT_DEALS_PCS, OFFICE_PCS, COMPONENTS, MONITORS } from '../data/catalogData';
import PcCompareModal from '../components/PcCompareModal';
import api from '../services/api';

gsap.registerPlugin(useGSAP);

const ALL_CAT_ITEMS = [
  ...HOT_DEALS_PCS,
  ...GAMING_PCS,
  ...OFFICE_PCS,
  ...COMPONENTS,
  ...MONITORS
];

const CATEGORY_META = {
  'gaming-gear': {
    title: 'GAMING GEAR CHÍNH HÃNG',
    breadcrumb: 'Gaming Gear',
    desc: 'Bàn phím cơ, Chuột gaming, Tai nghe chơi game, Ghế gaming, Tay cầm, Thiết bị Stream cao cấp từ các thương hiệu hàng đầu thế giới.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ GEAR' },
      { id: 'keyboard', label: 'BÀN PHÍM CƠ', filterKey: 'phím' },
      { id: 'mouse', label: 'CHUỘT GAMING', filterKey: 'chuột' },
      { id: 'headset', label: 'TAI NGHE CHƠI GAME', filterKey: 'tai nghe' },
      { id: 'chair', label: 'GHẾ GAMING', filterKey: 'ghế' },
      { id: 'controller', label: 'TAY CẦM CHƠI GAME', filterKey: 'tay cầm' },
      { id: 'stream', label: 'THIẾT BỊ STREAM & MIC', filterKey: 'stream' }
    ]
  },
  'gear': {
    title: 'GAMING GEAR CHÍNH HÃNG',
    breadcrumb: 'Gaming Gear',
    desc: 'Bàn phím cơ, Chuột gaming, Tai nghe chơi game, Ghế gaming, Tay cầm, Thiết bị Stream cao cấp từ các thương hiệu hàng đầu thế giới.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ GEAR' },
      { id: 'keyboard', label: 'BÀN PHÍM CƠ', filterKey: 'phím' },
      { id: 'mouse', label: 'CHUỘT GAMING', filterKey: 'chuột' },
      { id: 'headset', label: 'TAI NGHE CHƠI GAME', filterKey: 'tai nghe' },
      { id: 'chair', label: 'GHẾ GAMING', filterKey: 'ghế' },
      { id: 'controller', label: 'TAY CẦM CHƠI GAME', filterKey: 'tay cầm' },
      { id: 'stream', label: 'THIẾT BỊ STREAM & MIC', filterKey: 'stream' }
    ]
  },
  'pc-gaming': {
    title: 'PC GAMING',
    breadcrumb: 'PC Gaming',
    desc: 'Khám phá các bộ PC Gaming được tối ưu theo hiệu năng, ngân sách và nhu cầu sử dụng tại NAT Computer.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ PC' },
      { id: 'cheap', label: 'PC GAMING GIÁ RẺ' },
      { id: 'stream', label: 'PC STREAM GAME' },
      { id: 'premium', label: 'PC GAMING PREMIUM' },
      { id: 'core-ultra', label: 'PC CORE ULTRA' },
      { id: 'high-end', label: 'PC CAO CẤP' }
    ]
  },
  'gaming': {
    title: 'PC GAMING',
    breadcrumb: 'PC Gaming',
    desc: 'Khám phá các bộ PC Gaming được tối ưu theo hiệu năng, ngân sách và nhu cầu sử dụng tại NAT Computer.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ PC' },
      { id: 'cheap', label: 'PC GAMING GIÁ RẺ' },
      { id: 'stream', label: 'PC STREAM GAME' },
      { id: 'premium', label: 'PC GAMING PREMIUM' },
      { id: 'core-ultra', label: 'PC CORE ULTRA' },
      { id: 'high-end', label: 'PC CAO CẤP' }
    ]
  },
  'workstation': {
    title: 'PC WORKSTATION 2D 3D & AI',
    breadcrumb: 'PC Workstation',
    desc: 'Máy trạm chuyên dụng xử lý dựng hình 3DsMax, Render 4K/8K, Deep Learning AI, Unreal Engine 5 đỉnh cao.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ WORKSTATION' },
      { id: 'render', label: 'RENDER 3D / V-RAY', filterKey: 'render' },
      { id: 'ai', label: 'DEEP LEARNING AI', filterKey: 'ai' },
      { id: 'premiere', label: 'DỰNG PHIM 4K/8K', filterKey: 'film' },
      { id: 'threadripper', label: 'AMD THREADRIPPER', filterKey: 'threadripper' }
    ]
  },
  'pc-workstation': {
    title: 'PC WORKSTATION 2D 3D & AI',
    breadcrumb: 'PC Workstation',
    desc: 'Máy trạm chuyên dụng xử lý dựng hình 3DsMax, Render 4K/8K, Deep Learning AI, Unreal Engine 5 đỉnh cao.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ WORKSTATION' },
      { id: 'render', label: 'RENDER 3D / V-RAY', filterKey: 'render' },
      { id: 'ai', label: 'DEEP LEARNING AI', filterKey: 'ai' },
      { id: 'premiere', label: 'DỰNG PHIM 4K/8K', filterKey: 'film' },
      { id: 'threadripper', label: 'AMD THREADRIPPER', filterKey: 'threadripper' }
    ]
  },
  'pc-amd': {
    title: 'PC AMD GAMING & 3D V-CACHE',
    breadcrumb: 'PC AMD Gaming',
    desc: 'Dàn máy chiến game trang bị vi xử lý Ryzen 7000/9000 Series x3D tối ưu FPS cao nhất cho game thủ.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ AMD PC' },
      { id: 'ryzen5', label: 'RYZEN 5 7600', filterKey: '7600' },
      { id: 'ryzen7', label: 'RYZEN 7 7800X3D', filterKey: '7800x3d' },
      { id: 'ryzen9', label: 'RYZEN 7 9800X3D', filterKey: '9800x3d' },
      { id: 'radeon', label: 'RADEON RX 7000', filterKey: 'rx' }
    ]
  },
  'pc-mini': {
    title: 'PC MINI ITX NHỎ GỌN',
    breadcrumb: 'PC Mini',
    desc: 'Thiết kế ITX tinh xảo, tiết kiệm diện tích bàn làm việc nhưng sở hữu cấu hình mạnh mẽ đỉnh cao.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ PC MINI' },
      { id: 'itx-gaming', label: 'MINI ITX GAMING', filterKey: 'gaming' },
      { id: 'itx-office', label: 'MINI VĂN PHÒNG', filterKey: 'văn phòng' },
      { id: 'itx-white', label: 'MINI ALL WHITE RGB', filterKey: 'white' }
    ]
  },
  'office': {
    title: 'PC VĂN PHÒNG & DOANH NGHIỆP',
    breadcrumb: 'PC Văn Phòng',
    desc: 'Máy tính đồng bộ vận hành êm ái, tiết kiệm điện năng, tối ưu đa tác vụ văn phòng và kế toán bền bỉ 24/7.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ PC VĂN PHÒNG' },
      { id: 'i3', label: 'CORE I3 SLIM', filterKey: 'i3' },
      { id: 'i5', label: 'CORE I5 PRO', filterKey: 'i5' },
      { id: 'ketoan', label: 'HỌC TẬP / KẾ TOÁN', filterKey: 'văn phòng' }
    ]
  },
  'pc-office': {
    title: 'PC VĂN PHÒNG & DOANH NGHIỆP',
    breadcrumb: 'PC Văn Phòng',
    desc: 'Máy tính đồng bộ vận hành êm ái, tiết kiệm điện năng, tối ưu đa tác vụ văn phòng và kế toán bền bỉ 24/7.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ PC VĂN PHÒNG' },
      { id: 'i3', label: 'CORE I3 SLIM', filterKey: 'i3' },
      { id: 'i5', label: 'CORE I5 PRO', filterKey: 'i5' },
      { id: 'ketoan', label: 'HỌC TẬP / KẾ TOÁN', filterKey: 'văn phòng' }
    ]
  },
  'pc-ai': {
    title: 'PC AI - TRÍ TUỆ NHÂN TẠO & DEEP LEARNING',
    breadcrumb: 'PC AI Trí Tuệ Nhân Tạo',
    desc: 'Dàn máy cấu hình đa GPU phục vụ huấn luyện mô hình Large Language Models (LLM), Stable Diffusion, Data Science.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ PC AI' },
      { id: 'llm', label: 'LLM LOCAL SERVER', filterKey: 'llm' },
      { id: 'diffusion', label: 'STABLE DIFFUSION', filterKey: 'diffusion' },
      { id: 'multi-gpu', label: 'MULTI-GPU RTX 4090 / 5090', filterKey: '4090' }
    ]
  },
  'components': {
    title: 'LINH KIỆN MÁY TÍNH CHÍNH HÃNG',
    breadcrumb: 'Linh Kiện Máy Tính',
    desc: 'CPU, Card màn hình VGA, Bo mạch chủ Mainboard, Bộ nhớ RAM, Ổ cứng SSD, Nguồn máy tính, Tản nhiệt, Vỏ case.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ LINH KIỆN' },
      { id: 'vga', label: 'CARD MÀN HÌNH (VGA)', filterKey: 'vga' },
      { id: 'cpu', label: 'BỘ VI XỬ LÝ (CPU)', filterKey: 'cpu' },
      { id: 'ram', label: 'BỘ NHỚ RAM DDR5', filterKey: 'ram' },
      { id: 'ssd', label: 'Ổ CỨNG SSD M.2 NVME', filterKey: 'ssd' },
      { id: 'mainboard', label: 'BO MẠCH CHỦ', filterKey: 'mainboard' }
    ]
  },
  'monitors': {
    title: 'MÀN HÌNH MÁY TÍNH GAMING & ĐỒ HỌA',
    breadcrumb: 'Màn Hình Máy Tính',
    desc: 'Màn hình IPS, OLED, 144Hz - 240Hz sắc nét, chuẩn màu đồ họa phục vụ mọi nhu cầu giải trí và công việc.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ MÀN HÌNH' },
      { id: '2k-4k', label: 'MÀN HÌNH 2K / 4K', filterKey: '4k' },
      { id: '240hz', label: 'TẦN SỐ QUÉT 240HZ', filterKey: '240hz' },
      { id: 'ultrawide', label: 'MÀN HÌNH CONG ULTRAWIDE', filterKey: 'ultrawide' }
    ]
  },
  'pc-combo': {
    title: 'FULL BỘ PC KÈM MÀN HÌNH & GEAR TRỌN GÓI',
    breadcrumb: 'Full Bộ PC Kèm Màn Hình',
    desc: 'Combo trọn bộ máy tính kèm màn hình, bàn phím, chuột, lót chuột giá ưu đãi nhất.',
    subtabs: [
      { id: 'all', label: 'TẤT CẢ COMBO' },
      { id: 'combo-gaming', label: 'COMBO PC GAMING', filterKey: 'gaming' },
      { id: 'combo-office', label: 'COMBO PC VĂN PHÒNG', filterKey: 'office' }
    ]
  }
};

const CATEGORY_TABS = [
  { id: 'all', label: 'TẤT CẢ PC' },
  { id: 'cheap', label: 'PC GAMING GIÁ RẺ' },
  { id: 'stream', label: 'PC STREAM GAME' },
  { id: 'premium', label: 'PC GAMING PREMIUM' },
  { id: 'core-ultra', label: 'PC CORE ULTRA' },
  { id: 'high-end', label: 'PC CAO CẤP' },
];

const PRICE_RANGES = [
  { id: 'under-15m', label: 'Dưới 15 triệu', min: 0, max: 15000000, count: 48 },
  { id: '15m-25m', label: '15 triệu - 25 triệu', min: 15000000, max: 25000000, count: 124 },
  { id: '25m-35m', label: '25 triệu - 35 triệu', min: 25000000, max: 35000000, count: 103 },
  { id: 'above-35m', label: 'Trên 35 triệu', min: 35000000, max: 999000000, count: 87 },
];

const CPU_FILTERS = [
  { id: 'intel-i5', label: 'Intel Core i5', count: 96 },
  { id: 'intel-i7', label: 'Intel Core i7', count: 82 },
  { id: 'intel-ultra', label: 'Intel Core Ultra 7/9', count: 45 },
  { id: 'amd-ryzen7', label: 'AMD Ryzen 7 7800X3D/9800X3D', count: 54 },
];

const GPU_FILTERS = [
  { id: 'rtx-4060', label: 'NVIDIA RTX 4060 8GB', count: 110 },
  { id: 'rtx-4070ti', label: 'NVIDIA RTX 4070 Ti SUPER 16GB', count: 68 },
  { id: 'rtx-5070', label: 'NVIDIA RTX 5070 / 5080 Series', count: 32 },
];

const RAM_FILTERS = [
  { id: 'ram-16g', label: '16GB DDR5', count: 72 },
  { id: 'ram-32g', label: '32GB DDR5 High Speed', count: 164 },
  { id: 'ram-64g', label: '64GB DDR5 RGB', count: 42 },
];

const POPOVER_WIDTH = 320;
const POPOVER_OFFSET_X = 28;
const POPOVER_OFFSET_Y = 0;

export default function CategoryPage({ onAddToCart }) {
  const { catId: paramCatId } = useParams();
  const location = useLocation();
  const rawPath = location.pathname.replace(/^\//, '').replace(/^category\//, '');
  const catId = paramCatId || (rawPath && rawPath !== 'category' && rawPath !== 'search' ? rawPath : null);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const navigate = useNavigate();
  const rootRef = useRef(null);

  // States
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCpus, setSelectedCpus] = useState([]);
  const [selectedGpus, setSelectedGpus] = useState([]);
  const [selectedRams, setSelectedRams] = useState([]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Cursor-following popover states
  const [activeItem, setActiveItem] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const hoverTimerRef = useRef(null);
  const closeTimerRef = useRef(null);

  const fmt = v => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);

  // Detect mobile
  useEffect(() => {
    const check = () =>
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Global mousemove for cursor-following popover
  const handleMouseMove = useCallback((e) => {
    if (isMobile) return;
    const pw = Math.min(POPOVER_WIDTH, window.innerWidth - 32);
    const approxH = 400;

    let x = e.clientX + POPOVER_OFFSET_X;
    let y = e.clientY + POPOVER_OFFSET_Y;

    if (x + pw + 8 > window.innerWidth) {
      x = e.clientX - pw - POPOVER_OFFSET_X;
    }
    if (y + approxH > window.innerHeight - 8) {
      y = window.innerHeight - approxH - 8;
    }
    if (y < 8) y = 8;

    setCursorPos({ x, y });
  }, [isMobile]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Hover card handlers
  const handleMouseEnterCard = (item) => {
    if (isMobile) return;
    clearTimeout(closeTimerRef.current);
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setActiveItem(item);
    }, 180);
  };

  const handleMouseLeaveCard = () => {
    if (isMobile) return;
    clearTimeout(hoverTimerRef.current);
    closeTimerRef.current = setTimeout(() => setActiveItem(null), 200);
  };

  // Compare state
  const [compareItems, setCompareItems] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleToggleCompare = (item) => {
    setCompareItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);
      if (exists) {
        return prev.filter((i) => i.id !== item.id);
      }
      if (prev.length >= 3) {
        alert('Bạn chỉ có thể so sánh tối đa 3 sản phẩm PC cùng lúc!');
        return prev;
      }
      return [...prev, item];
    });
  };

  const [liveProducts, setLiveProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;
    api.getProducts().then(res => {
      if (isMounted && res && res.products && res.products.length > 0) {
        setLiveProducts(res.products);
      }
    }).catch(() => {});

    api.getAdminCategories().then(res => {
      if (isMounted && res && res.categories && res.categories.length > 0) {
        setDbCategories(res.categories);
      }
    }).catch(() => {});

    return () => { isMounted = false; };
  }, []);

  const baseItems = liveProducts.length > 0 ? liveProducts : ALL_CAT_ITEMS;

  const targetSlug = (catId || 'gaming').toLowerCase();
  const metaFound = CATEGORY_META[targetSlug] || dbCategories.find(c => (c.slug || '').toLowerCase() === targetSlug || (c.id || '').toLowerCase() === targetSlug);

  const displayTitle = searchQuery
    ? `KẾT QUẢ TÌM KIẾM: "${searchQuery}"`
    : (metaFound?.title || metaFound?.name?.toUpperCase() || 'PC GAMING');

  const displayDesc = searchQuery
    ? `Tìm thấy các sản phẩm phù hợp với từ khóa "${searchQuery}" tại NAT Computer.`
    : (metaFound?.desc || metaFound?.description || 'Khám phá các cấu hình phần cứng tối ưu hiệu năng tại NAT Computer.');

  const displayBreadcrumb = searchQuery
    ? `Tìm kiếm: "${searchQuery}"`
    : (metaFound?.breadcrumb || metaFound?.name || 'PC Gaming');

  const currentTabs = metaFound?.subtabs || CATEGORY_TABS;

  // Filter products logic
  const subParam = searchParams.get('sub') || '';
  const brandParam = searchParams.get('brand') || '';

  const filteredProducts = baseItems.filter(item => {
    const lowerName = (item.name || '').toLowerCase();
    const specsStr = (item.specifications || []).join(' ').toLowerCase() + ' ' + JSON.stringify(item.specs || {}).toLowerCase();
    const itemCat = (item.category || item.category_id || '').toLowerCase();

    // Category URL param filter
    if (catId) {
      const targetCat = catId.toLowerCase();
      if (targetCat === 'gaming-gear' || targetCat === 'gear') {
        const isGear = itemCat.includes('gear') || itemCat.includes('gaming-gear') ||
          lowerName.includes('bàn phím') || lowerName.includes('phím cơ') || lowerName.includes('chuột') ||
          lowerName.includes('tai nghe') || lowerName.includes('ghế') || lowerName.includes('tay cầm') ||
          lowerName.includes('stream') || lowerName.includes('mic') || lowerName.includes('elgato') ||
          lowerName.includes('akko') || lowerName.includes('logitech') || lowerName.includes('hyperx');
        if (!isGear) return false;
      } else if (targetCat === 'pc-gaming' || targetCat === 'gaming') {
        const isGaming = ['gaming', 'pc-gaming'].includes(itemCat) || (lowerName.includes('gaming') && !lowerName.includes('ghế') && !lowerName.includes('tai nghe') && !lowerName.includes('chuột'));
        if (!isGaming) return false;
      } else if (targetCat === 'pc-workstation' || targetCat === 'workstation') {
        const isWorkstation = ['workstation', 'pc-workstation'].includes(itemCat) || lowerName.includes('workstation') || lowerName.includes('đồ họa') || lowerName.includes('render') || lowerName.includes('threadripper');
        if (!isWorkstation) return false;
      } else if (targetCat === 'pc-amd' || targetCat === 'amd') {
        const isAmd = ['pc-amd', 'amd'].includes(itemCat) || lowerName.includes('amd') || lowerName.includes('ryzen');
        if (!isAmd) return false;
      } else if (targetCat === 'pc-mini' || targetCat === 'mini') {
        const isMini = ['pc-mini', 'mini'].includes(itemCat) || lowerName.includes('mini') || lowerName.includes('itx');
        if (!isMini) return false;
      } else if (targetCat === 'pc-office' || targetCat === 'office') {
        const isOffice = ['office', 'pc-office'].includes(itemCat) || lowerName.includes('office') || lowerName.includes('văn phòng');
        if (!isOffice) return false;
      } else if (targetCat === 'pc-ai' || targetCat === 'ai') {
        const isAi = ['ai', 'pc-ai'].includes(itemCat) || lowerName.includes('ai') || lowerName.includes('deep learning');
        if (!isAi) return false;
      } else if (targetCat === 'components' || targetCat === 'linh-kien') {
        const isComp = ['components', 'linh-kien'].includes(itemCat) || lowerName.includes('linh kiện') || lowerName.includes('vga') || lowerName.includes('cpu') || lowerName.includes('ram') || lowerName.includes('ssd') || lowerName.includes('mainboard');
        if (!isComp) return false;
      } else if (targetCat === 'monitors' || targetCat === 'man-hinh') {
        const isMon = ['monitors', 'man-hinh'].includes(itemCat) || lowerName.includes('màn hình');
        if (!isMon) return false;
      } else if (targetCat === 'pc-combo' || targetCat === 'combo') {
        const isCombo = ['pc-combo', 'combo'].includes(itemCat) || lowerName.includes('combo') || lowerName.includes('full bộ');
        if (!isCombo) return false;
      } else if (targetCat === 'speakers' || targetCat === 'loa') {
        const isSpeaker = ['speakers', 'loa'].includes(itemCat) || lowerName.includes('loa') || lowerName.includes('soundbar');
        if (!isSpeaker) return false;
      } else if (targetCat === 'software' || targetCat === 'phan-mem') {
        const isSoft = ['software', 'phan-mem'].includes(itemCat) || lowerName.includes('windows') || lowerName.includes('office') || lowerName.includes('phần mềm');
        if (!isSoft) return false;
      } else if (targetCat === 'network' || targetCat === 'card-mang') {
        const isNet = ['network', 'card-mang'].includes(itemCat) || lowerName.includes('wifi') || lowerName.includes('card mạng');
        if (!isNet) return false;
      } else if (targetCat === 'virtualization' || targetCat === 'gia-lap') {
        const isVirt = ['virtualization', 'gia-lap'].includes(itemCat) || lowerName.includes('giả lập') || lowerName.includes('nox');
        if (!isVirt) return false;
      } else if (targetCat === 'hot-deals') {
        if (!item.badge?.includes('DEAL') && !item.badge?.includes('HOT') && itemCat !== 'hot-deals') return false;
      } else if (targetCat !== 'all' && itemCat !== targetCat && !itemCat.includes(targetCat)) {
        return false;
      }
    }

    // Sub-item filter from URL query param
    if (subParam) {
      const subLower = subParam.toLowerCase();
      if (!lowerName.includes(subLower) && !specsStr.includes(subLower)) return false;
    }

    // Brand filter from URL query param
    if (brandParam) {
      const brandLower = brandParam.toLowerCase();
      if (!lowerName.includes(brandLower) && !specsStr.includes(brandLower)) return false;
    }

    // Active Tab filter
    if (activeTab !== 'all') {
      const activeTabObj = currentTabs.find(t => t.id === activeTab);
      if (activeTabObj && activeTabObj.filterKey) {
        const fk = activeTabObj.filterKey.toLowerCase();
        if (!lowerName.includes(fk) && !specsStr.includes(fk)) return false;
      } else if (activeTab === 'cheap') {
        if (item.price > 25000000) return false;
      } else if (activeTab === 'premium' || activeTab === 'high-end') {
        if (item.price < 40000000) return false;
      } else if (activeTab === 'core-ultra') {
        if (!lowerName.includes('ultra') && !specsStr.includes('ultra')) return false;
      } else if (activeTab === 'stream') {
        if (!lowerName.includes('stream') && !specsStr.includes('stream') && !specsStr.includes('4070') && !specsStr.includes('4060')) return false;
      }
    }

    if (searchQuery && !lowerName.includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedPrice) {
      const range = PRICE_RANGES.find(r => r.id === selectedPrice);
      if (range && (item.price < range.min || item.price > range.max)) {
        return false;
      }
    }
    if (selectedCpus.length > 0) {
      const matchesCpu = selectedCpus.some(c => {
        if (c === 'intel-i5') return lowerName.includes('i5') || specsStr.includes('i5');
        if (c === 'intel-i7') return lowerName.includes('i7') || specsStr.includes('i7');
        if (c === 'intel-ultra') return lowerName.includes('ultra') || specsStr.includes('ultra');
        if (c === 'amd-ryzen7') return lowerName.includes('ryzen') || specsStr.includes('ryzen');
        return false;
      });
      if (!matchesCpu) return false;
    }
    if (selectedGpus.length > 0) {
      const matchesGpu = selectedGpus.some(g => {
        if (g === 'rtx-4060') return lowerName.includes('4060') || specsStr.includes('4060');
        if (g === 'rtx-4070ti') return lowerName.includes('4070') || specsStr.includes('4070');
        if (g === 'rtx-5070') return lowerName.includes('5070') || specsStr.includes('5070');
        return false;
      });
      if (!matchesGpu) return false;
    }
    if (selectedRams.length > 0) {
      const matchesRam = selectedRams.some(r => {
        if (r === 'ram-16g') return lowerName.includes('16gb') || specsStr.includes('16gb');
        if (r === 'ram-32g') return lowerName.includes('32gb') || specsStr.includes('32gb');
        if (r === 'ram-64g') return lowerName.includes('64gb') || specsStr.includes('64gb');
        return false;
      });
      if (!matchesRam) return false;
    }
    return true;
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedPrice(null);
    setSelectedCpus([]);
    setSelectedGpus([]);
    setSelectedRams([]);
    setActiveTab('all');
  };

  const handleCardClick = (item) => {
    navigate(`/product/${item.id}`);
  };

  const renderHighlightedText = (text) => {
    if (!text) return null;
    const parts = text.split(/(thêm\s+[\d\.,]+[\s]?(?:triệu|k|đ|vnđ)?)/gi);
    return parts.map((part, i) =>
      /thêm\s+[\d\.,]+[\s]?(?:triệu|k|đ|vnđ)?/i.test(part)
        ? <span key={i} className="highlight-red">{part}</span>
        : part
    );
  };

  const getSpecsList = (item) => {
    if (item.specifications?.length) return item.specifications;
    return [
      `CPU: ${item.specs?.cpu || 'Intel Core / AMD Ryzen'}`,
      `Mainboard: ${item.specs?.mainboard || 'MSI / ASUS DDR5'}`,
      `RAM: ${item.specs?.ram || '32GB High Speed DDR5'}`,
      `SSD: ${item.specs?.ssd || '1TB NVMe PCIe Gen4'}`,
      `VGA: ${item.specs?.gpu || 'NVIDIA GeForce RTX Series'}`,
    ];
  };

  const renderPreviewContent = (item) => {
    const hasOrig = item.originalPrice && item.originalPrice > item.price;
    const specs = getSpecsList(item).slice(0, 6);
    const promos = (item.promotions || [
      'Upgrade lên SSD 1TB NVMe GEN4 thêm 500K',
      'Upgrade lên RAM 64GB DDR5 thêm 1.400K',
    ]).slice(0, 4);

    return (
      <>
        <div className="ppv-header">
          <p className="ppv-cat">{item.categoryName || 'PC Gaming High Performance'}</p>
          <h3 className="ppv-title">{item.name}</h3>
        </div>
        <div className="ppv-body">
          <div className="ppv-price-block">
            <div>
              <span className="ppv-label">Giá bán</span>
              <div className="ppv-price">{fmt(item.price)}</div>
              {hasOrig && <div className="ppv-price-old">{fmt(item.originalPrice)}</div>}
            </div>
            <div className="ppv-divider" />
            <div>
              <span className="ppv-label">Bảo hành</span>
              <div className="ppv-warranty">{item.warranty || '36 Tháng'}</div>
            </div>
          </div>

          <div className="ppv-section">
            <div className="ppv-section-label">
              <span className="ppv-dot" />
              Cấu hình chính
            </div>
            <ul className="ppv-specs">
              {specs.map((s, i) => (
                <li key={i}>
                  <CheckCircle2 size={13} className="ppv-check" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {promos.length > 0 && (
            <div className="ppv-section ppv-section--promo">
              <div className="ppv-section-label">
                <span className="ppv-dot ppv-dot--red" />
                Khuyến mại kèm
              </div>
              <ul className="ppv-promos">
                {promos.map((p, i) => (
                  <li key={i}>
                    <Gift size={12} className="ppv-gift" />
                    <span>{renderHighlightedText(p)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div ref={rootRef} className="cat-page-root wrap">
      {/* ── 1. BREADCRUMB ── */}
      <nav className="cat-breadcrumb">
        <Link to="/">Trang chủ</Link>
        <ChevronRight size={14} className="cat-bc-sep" />
        <span className="cat-bc-active">
          {displayBreadcrumb}
        </span>
      </nav>

      {/* ── 2. CATEGORY HEADER ── */}
      <div className="cat-header-box">
        <div className="cat-header-info">
          <h1 className="cat-page-title">
            {displayTitle}
          </h1>
          <p className="cat-page-desc">
            {displayDesc}
          </p>
        </div>
        <div className="cat-count-badge">
          {filteredProducts.length} sản phẩm
        </div>
      </div>

      {/* ── 3. CATEGORY TABS ── */}
      <div className="cat-tabs-row">
        {currentTabs.map(tab => (
          <button
            key={tab.id}
            className={`cat-tab-pill ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── 4. MOBILE FILTER TOGGLE BAR ── */}
      <div className="cat-mobile-bar">
        <button
          className="btn btn-outline cat-mobile-filter-btn"
          onClick={() => setMobileFilterOpen(true)}
        >
          <Filter size={16} />
          <span>BỘ LỌC ({selectedPrice ? 1 : 0})</span>
        </button>
        <div className="cat-mobile-sort-wrap">
          <SlidersHorizontal size={16} />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="popular">Phổ biến nhất</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="bestseller">Bán chạy nhất</option>
          </select>
        </div>
      </div>

      {/* ── 5. MAIN CONTENT LAYOUT (Sidebar + Grid) ── */}
      <div className="cat-main-layout">
        {/* Left Column — Filter Sidebar */}
        <aside className={`cat-sidebar-col ${mobileFilterOpen ? 'mobile-open' : ''}`}>
          <div className="cat-sidebar-card">
            <div className="cat-sidebar-head">
              <h3>LỌC SẢN PHẨM</h3>
              {mobileFilterOpen ? (
                <button className="cat-mobile-close-btn" onClick={() => setMobileFilterOpen(false)}>
                  <X size={20} />
                </button>
              ) : (
                <button className="cat-reset-btn" onClick={handleResetFilters}>
                  <RotateCcw size={13} />
                  <span>Xóa bộ lọc</span>
                </button>
              )}
            </div>

            {/* Group 1: Khoảng Giá */}
            <div className="filter-group">
              <h4 className="filter-group-title">KHOẢNG GIÁ</h4>
              <div className="filter-options-list">
                {PRICE_RANGES.map(range => {
                  const isChecked = selectedPrice === range.id;
                  return (
                    <label key={range.id} className={`filter-checkbox-item ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => setSelectedPrice(isChecked ? null : range.id)}
                      />
                      <span className="chk-label">{range.label}</span>
                      <span className="chk-count">({range.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Group 2: Dòng CPU */}
            <div className="filter-group">
              <h4 className="filter-group-title">DÒNG CPU</h4>
              <div className="filter-options-list">
                {CPU_FILTERS.map((cpu) => {
                  const isChecked = selectedCpus.includes(cpu.id);
                  return (
                    <label key={cpu.id} className={`filter-checkbox-item ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedCpus((prev) =>
                            isChecked ? prev.filter((c) => c !== cpu.id) : [...prev, cpu.id]
                          )
                        }
                      />
                      <span className="chk-label">{cpu.label}</span>
                      <span className="chk-count">({cpu.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Group 3: Card Đồ Họa (GPU) */}
            <div className="filter-group">
              <h4 className="filter-group-title">CARD ĐỒ HỌA (GPU)</h4>
              <div className="filter-options-list">
                {GPU_FILTERS.map((gpu) => {
                  const isChecked = selectedGpus.includes(gpu.id);
                  return (
                    <label key={gpu.id} className={`filter-checkbox-item ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedGpus((prev) =>
                            isChecked ? prev.filter((g) => g !== gpu.id) : [...prev, gpu.id]
                          )
                        }
                      />
                      <span className="chk-label">{gpu.label}</span>
                      <span className="chk-count">({gpu.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Group 4: Dung Lượng RAM */}
            <div className="filter-group">
              <h4 className="filter-group-title">DUNG LƯỢNG RAM</h4>
              <div className="filter-options-list">
                {RAM_FILTERS.map((ram) => {
                  const isChecked = selectedRams.includes(ram.id);
                  return (
                    <label key={ram.id} className={`filter-checkbox-item ${isChecked ? 'checked' : ''}`}>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() =>
                          setSelectedRams((prev) =>
                            isChecked ? prev.filter((r) => r !== ram.id) : [...prev, ram.id]
                          )
                        }
                      />
                      <span className="chk-label">{ram.label}</span>
                      <span className="chk-count">({ram.count})</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {mobileFilterOpen && (
              <button
                className="btn btn-blue cat-mobile-apply-btn"
                onClick={() => setMobileFilterOpen(false)}
              >
                ÁP DỤNG BỘ LỌC
              </button>
            )}
          </div>
        </aside>

        {/* Right Column — Product Toolbar & Grid */}
        <main className="cat-grid-col">
          {/* Toolbar */}
          <div className="cat-toolbar">
            <div className="cat-toolbar-left">
              <span>Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm</span>
            </div>

            <div className="cat-toolbar-right">
              <div className="cat-sort-control">
                <span>Sắp xếp:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="price-asc">Giá tăng dần</option>
                  <option value="price-desc">Giá giảm dần</option>
                  <option value="bestseller">Bán chạy nhất</option>
                </select>
              </div>

              <div className="cat-view-toggles">
                <button
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Hiển thị dạng Lưới"
                >
                  <Grid size={16} />
                </button>
                <button
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="Hiển thị dạng Danh sách"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid / List */}
          {filteredProducts.length > 0 ? (
            <div className={`cat-products-grid ${viewMode === 'list' ? 'list-mode' : ''}`}>
              {filteredProducts.map(item => {
                const hasOrig = item.originalPrice && item.originalPrice > item.price;
                const disc = hasOrig ? Math.round((1 - item.price / item.originalPrice) * 100) : 0;

                return (
                  <div
                    key={item.id}
                    className="carousel-card"
                    onMouseEnter={() => handleMouseEnterCard(item)}
                    onMouseLeave={handleMouseLeaveCard}
                  >
                    <div className="carousel-card-img" onClick={() => handleCardClick(item)}>
                      <img src={item.image} alt={item.name} loading="lazy" />
                      {item.badge && <span className="carousel-card-badge">{item.badge}</span>}
                    </div>

                    <div className="carousel-card-body">
                      <h3
                        className="carousel-card-title"
                        title={item.name}
                        onClick={() => handleCardClick(item)}
                      >
                        {item.name}
                      </h3>

                      <div className="carousel-card-price-area">
                        <div className="price-primary-row">
                          <span className="price-current">{fmt(item.price)}</span>
                          {hasOrig && <span className="discount-badge">-{disc}%</span>}
                        </div>
                        {hasOrig && <div className="price-original">{fmt(item.originalPrice)}</div>}
                      </div>

                      <div className="carousel-card-footer">
                        <button
                          type="button"
                          className="btn-add-to-cart"
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart?.(item);
                          }}
                        >
                          <ShoppingCart size={14} />
                          THÊM VÀO GIỎ
                        </button>
                        <button
                          type="button"
                          className={`btn-compare-card ${compareItems.some((i) => i.id === item.id) ? 'active' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompare(item);
                          }}
                          title="So sánh cấu hình"
                        >
                          <ArrowRightLeft size={13} />
                          {compareItems.some((i) => i.id === item.id) ? 'Đã chọn' : 'So sánh'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="cat-empty-results">
              <h3>Không tìm thấy sản phẩm phù hợp</h3>
              <p>Rất tiếc, không có sản phẩm nào khớp với bộ lọc hiện tại của bạn.</p>
              <button className="btn btn-outline" onClick={handleResetFilters}>
                XÓA BỘ LỌC ĐỂ XEM TẤT CẢ
              </button>
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="cat-pagination">
              <button className="page-btn" disabled={currentPage <= 1}>‹</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">3</button>
              <button className="page-btn">4</button>
              <button className="page-btn">5</button>
              <button className="page-btn">Next ›</button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Compare Bar */}
      {compareItems.length > 0 && (
        <div className="floating-compare-bar">
          <div className="compare-bar-info">
            <ArrowRightLeft size={20} color="#38bdf8" />
            <span>Đã chọn <strong>{compareItems.length}/3</strong> sản phẩm để so sánh</span>
          </div>
          <div className="compare-bar-actions">
            <button
              type="button"
              className="btn btn-red btn-sm hover-btn-effect"
              onClick={() => setIsCompareOpen(true)}
            >
              SO SÁNH CẤU HÌNH NGAY
            </button>
            <button
              type="button"
              className="btn btn-outline-dark btn-sm text-white"
              onClick={() => setCompareItems([])}
            >
              Xóa
            </button>
          </div>
        </div>
      )}

      {/* PcCompareModal */}
      {isCompareOpen && (
        <PcCompareModal
          compareItems={compareItems}
          onClose={() => setIsCompareOpen(false)}
          onRemoveItem={(id) => setCompareItems((prev) => prev.filter((i) => i.id !== id))}
          onAddToCart={onAddToCart}
          onBuyNow={(item) => {
            onAddToCart?.(item);
            navigate('/checkout', { state: { directBuyItem: item } });
          }}
        />
      )}

      {/* ── 6. CURSOR-FOLLOWING SPEC HOVER PREVIEW POPOVER ── */}
      {!isMobile && activeItem && (
        <div
          className="ppv-container"
          style={{
            position: 'fixed',
            top: cursorPos.y,
            left: cursorPos.x,
            width: Math.min(POPOVER_WIDTH, window.innerWidth - 32),
            zIndex: 9999,
            pointerEvents: 'none',
            transition: 'top 0.08s linear, left 0.08s linear',
          }}
        >
          {renderPreviewContent(activeItem)}
        </div>
      )}

      {/* ── 7. SERVICE BENEFITS BAR (Full-Width) ── */}
      <section className="cart-benefits-bar" style={{ marginTop: 60 }}>
        <div className="benefit-col">
          <Truck size={24} className="b-icon" />
          <div>
            <h4>GIAO HÀNG TOÀN QUỐC</h4>
            <p>Giao hàng trước, kiểm tra trả tiền sau COD</p>
          </div>
        </div>
        <div className="benefit-col">
          <ReturnIcon size={24} className="b-icon" />
          <div>
            <h4>ĐỔI TRẢ DỄ DÀNG</h4>
            <p>Đổi mới 1:1 trong vòng 30 ngày đầu</p>
          </div>
        </div>
        <div className="benefit-col">
          <CreditCard size={24} className="b-icon" />
          <div>
            <h4>THANH TOÁN TIỆN LỢI</h4>
            <p>Tiền mặt, chuyển khoản & trả góp 0%</p>
          </div>
        </div>
        <div className="benefit-col">
          <Headphones size={24} className="b-icon" />
          <div>
            <h4>HỖ TRỢ NHIỆT TÌNH</h4>
            <p>Tư vấn kỹ thuật tổng đài miễn phí 24/7</p>
          </div>
        </div>
      </section>
    </div>
  );
}
