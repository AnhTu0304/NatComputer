import React, { useState, useEffect } from 'react';
import {
  Cpu, HardDrive, Layers, DollarSign, Boxes, Image as ImageIcon,
  Search, Globe, Check, CheckCircle2, AlertCircle, X, ArrowLeft,
  Save, Plus, Trash2, TrendingUp, UploadCloud, Tag, Eye, ChevronRight
} from 'lucide-react';

// Dynamic hardware specifications templates
export const CATEGORY_SPEC_TEMPLATES = {
  cpu: [
    { item: 'Socket', desc: 'LGA1700 / AM5', detail: 'Tương thích bo mạch chủ thế hệ mới' },
    { item: 'Số nhân / Số luồng', desc: '16 Nhân / 24 Luồng', detail: 'P-cores & E-cores kiến trúc lai' },
    { item: 'Xung nhịp cơ bản (Base Clock)', desc: '3.4 GHz', detail: 'Tần số xung mặc định' },
    { item: 'Xung nhịp tối đa (Boost Clock)', desc: '5.4 GHz', detail: 'Turbo Boost Max 3.0' },
    { item: 'Bộ nhớ đệm (Cache)', desc: '30MB Intel Smart Cache', detail: 'L3 Cache' },
    { item: 'TDP / Điện năng tiêu thụ', desc: '125W (Max 253W)', detail: 'Yêu cầu tản nhiệt nước AIO 240/360mm' },
    { item: 'Đồ họa tích hợp (iGPU)', desc: 'Intel UHD Graphics 770', detail: 'Hỗ trợ xuất hình 4K 60Hz' }
  ],
  gpu: [
    { item: 'GPU Chipset', desc: 'NVIDIA GeForce RTX 4070 Ti SUPER', detail: 'Kiến trúc Ada Lovelace' },
    { item: 'Dung lượng VRAM', desc: '16GB', detail: 'Xử lý mượt mà game 4K & AI render' },
    { item: 'Loại VRAM', desc: 'GDDR6X', detail: 'Tốc độ 21 Gbps' },
    { item: 'Memory Bus', desc: '256-bit', detail: 'Băng thông cực cao' },
    { item: 'Xung nhịp Boost', desc: '2670 MHz (OC Mode)', detail: 'Hiệu năng ép xung xuất xưởng' },
    { item: 'Công suất tiêu thụ (TDP)', desc: '285W', detail: 'Cổng cấp nguồn 16-pin 12VHPWR' },
    { item: 'Nguồn khuyến nghị (PSU)', desc: '750W trở lên', detail: 'Chuẩn ATX 3.0 khuyên dùng' },
    { item: 'Chiều dài card (Length)', desc: '305 mm', detail: 'Yêu cầu vỏ case hỗ trợ VGA dài' }
  ],
  ram: [
    { item: 'Dung lượng (Capacity)', desc: '32GB (2 x 16GB)', detail: 'Chạy Dual Channel tối ưu băng thông' },
    { item: 'Chuẩn RAM (Type)', desc: 'DDR5', detail: 'Thế hệ RAM tốc độ vượt trội' },
    { item: 'Tốc độ Bus (Speed)', desc: '6000 MHz', detail: 'Hỗ trợ Intel XMP 3.0 & AMD EXPO' },
    { item: 'Độ trễ (CAS Latency)', desc: 'CL30 (30-36-36-76)', detail: 'Độ trễ cực thấp cho gaming' },
    { item: 'Điện áp (Voltage)', desc: '1.35V', detail: 'Tiết kiệm điện năng và nhiệt độ mát' },
    { item: 'Hệ thống tản nhiệt & LED', desc: 'Nhôm xước tản nhiệt + LED ARGB Sync', detail: 'Đồng bộ qua phần mềm bo mạch chủ' }
  ],
  ssd: [
    { item: 'Dung lượng (Capacity)', desc: '1TB (1000GB)', detail: 'Lưu trữ hệ điều hành và game nặng' },
    { item: 'Chuẩn giao tiếp (Interface)', desc: 'PCIe Gen 4.0 x4, NVMe 2.0', detail: 'Tương thích PC và PS5' },
    { item: 'Kích thước (Form Factor)', desc: 'M.2 2280', detail: 'Dễ dàng lắp đặt trên mọi mainboard hiện đại' },
    { item: 'Tốc độ đọc tuần tự (Read)', desc: 'Lên đến 7450 MB/s', detail: 'Load game và file đồ họa tức thì' },
    { item: 'Tốc độ ghi tuần tự (Write)', desc: 'Lên đến 6900 MB/s', detail: 'Ghi chép dữ liệu dung lượng lớn cực nhanh' },
    { item: 'Độ bền ghi (TBW)', desc: '600 TBW', detail: 'Bảo hành chính hãng 5 năm' }
  ],
  motherboard: [
    { item: 'Socket', desc: 'LGA1700 / AM5', detail: 'Hỗ trợ vi xử lý thế hệ mới nhất' },
    { item: 'Chipset', desc: 'Intel Z790 / AMD B650', detail: 'Hỗ trợ ép xung CPU và RAM' },
    { item: 'Kích thước (Form Factor)', desc: 'ATX (30.5 cm x 24.4 cm)', detail: 'Đầy đủ cổng kết nối và tản nhiệt VRM' },
    { item: 'Chuẩn RAM hỗ trợ', desc: 'DDR5 Dual Channel', detail: 'Tối đa 192GB, Bus 7200+ MHz (OC)' },
    { item: 'Số khe cắm RAM', desc: '4 x DIMM Slots', detail: 'Gia cố kim loại chống nhiễu' },
    { item: 'Số khe M.2 NVMe', desc: '4 x M.2 PCIe Gen 4/Gen 5', detail: 'Kèm tản nhiệt nhôm tản nhiệt dày' },
    { item: 'Khe cắm mở rộng PCIe', desc: '1 x PCIe 5.0 x16, 2 x PCIe 4.0 x16', detail: 'Bọc giáp thép chịu lực card nặng' }
  ],
  psu: [
    { item: 'Công suất thực (Wattage)', desc: '850 Watts', detail: 'Dư dả cho RTX 4080 / 4090' },
    { item: 'Chứng nhận hiệu suất', desc: '80 Plus Gold (Hiệu suất > 90%)', detail: 'Tiết kiệm điện và giảm sinh nhiệt' },
    { item: 'Kiểu cáp (Modular)', desc: 'Full Modular', detail: 'Dễ đi dây gọn gàng cho case' },
    { item: 'Chuẩn nguồn (Form Factor)', desc: 'ATX 3.0 / PCIe 5.0 Native 16-pin', detail: 'Tích hợp cáp 12V-2x6 cho GPU mới' },
    { item: 'Tính năng bảo vệ', desc: 'OVP, OPP, SCP, OCP, UVP, OTP', detail: 'Tụ điện Nhật Bản chịu nhiệt 105°C' }
  ],
  case: [
    { item: 'Kích cỡ (Form Factor)', desc: 'Mid Tower', detail: 'Thiết kế bể cá panoramic kính cường lực 2 mặt' },
    { item: 'Hỗ trợ Mainboard', desc: 'E-ATX, ATX, Micro-ATX, Mini-ITX', detail: 'Tương thích mainboard cắm dây mặt sau (BTF/Project Zero)' },
    { item: 'Chiều dài GPU tối đa', desc: 'Lên đến 420 mm', detail: 'Lắp vừa mọi dòng card đồ họa khủng nhất' },
    { item: 'Chiều cao tản CPU tối đa', desc: 'Lên đến 180 mm', detail: 'Lắp vừa tản khí tháp đôi lớn' },
    { item: 'Hỗ trợ quạt tản & Rad', desc: 'Hỗ trợ Rad 360mm nóc & hông, gắn tối đa 9 quạt 120mm', detail: 'Luồng gió đối lưu cực tốt' }
  ],
  pc: [
    { item: 'Bộ vi xử lý (CPU)', desc: 'Intel Core i7-14700K (20 nhân / 28 luồng, up to 5.6 GHz)', detail: 'Bảo hành 36T' },
    { item: 'Bo mạch chủ (Mainboard)', desc: 'MSI MAG Z790 TOMAHAWK WIFI DDR5', detail: 'Bảo hành 36T' },
    { item: 'Bộ nhớ trong (RAM)', desc: 'Corsair Vengeance RGB 32GB (2x16GB) DDR5 6000MHz', detail: 'Bảo hành 36T' },
    { item: 'Card đồ họa (VGA)', desc: 'Gigabyte GeForce RTX 4070 Ti SUPER Gaming OC 16GB', detail: 'Bảo hành 36T' },
    { item: 'Ổ cứng lưu trữ (SSD)', desc: 'Kingston KC3000 1TB PCIe 4.0 NVMe M.2 (7000MB/s)', detail: 'Bảo hành 60T' },
    { item: 'Nguồn máy tính (PSU)', desc: 'Corsair RM850e 850W 80 Plus Gold ATX 3.0 PCIe 5.0', detail: 'Bảo hành 84T' },
    { item: 'Tản nhiệt (Cooler)', desc: 'Deepcool LT720 ARGB 360mm Liquid Cooler', detail: 'Bảo hành 36T' },
    { item: 'Vỏ máy tính (Case)', desc: 'Lian Li O11 Dynamic EVO RGB White kính cường lực', detail: 'Bảo hành 12T' }
  ],
  monitor: [
    { item: 'Kích thước màn hình', desc: '27 inch', detail: 'Không gian hiển thị chuẩn Esport' },
    { item: 'Độ phân giải', desc: '2K QHD (2560 x 1440)', detail: 'Hình ảnh sắc nét gấp 1.7 lần Full HD' },
    { item: 'Tần số quét (Refresh Rate)', desc: '180 Hz', detail: 'Chuyển động mượt mà, triệt tiêu xé hình' },
    { item: 'Tấm nền (Panel)', desc: 'Fast IPS', detail: 'Góc nhìn rộng 178° và màu sắc rực rỡ' },
    { item: 'Thời gian đáp ứng', desc: '1ms (GTG)', detail: 'Không bóng mờ trong game FPS' },
    { item: 'Độ phủ màu', desc: '99% sRGB, DCI-P3 95%, HDR400', detail: 'Phù hợp cả thiết kế đồ họa' }
  ],
  gear: [
    { item: 'Kết nối (Connectivity)', desc: '3 Modes: Wireless 2.4GHz / Bluetooth 5.2 / Type-C', detail: 'Độ trễ siêu thấp 1ms' },
    { item: 'Cảm biến / Switch', desc: 'Cảm biến quang học cao cấp 26.000 DPI / Switch 100M clicks', detail: 'Độ chính xác chuẩn xác từng pixel' },
    { item: 'Pin & Trọng lượng', desc: 'Pin sạc 80 giờ liên tục, Trọng lượng siêu nhẹ 55g', detail: 'Thoải mái sử dụng không mỏi tay' }
  ]
};

// Helper to format currency
const fmt = (v) => {
  if (!v || isNaN(v)) return '0 ₫';
  return Number(v).toLocaleString('vi-VN') + ' ₫';
};

// Helper to generate slug from Vietnamese string
const slugify = (text) => {
  return (text || '')
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

export default function ProductEditor({
  initialData,
  categories = [],
  onSave,
  onCancel,
  isEditing = false
}) {
  // Master form state
  const [formData, setFormData] = useState({
    // Section 1: Basic Information
    name: '',
    sku: '',
    brand: '',
    category: 'gaming',
    productType: 'pc', // pc, component, gear, monitor
    shortDescription: '',
    description: '',

    // Section 2: Media
    image: '',
    gallery: [],

    // Section 3: Pricing
    price: '',
    originalPrice: '',
    costPrice: '',
    discount: 0,
    tax: 10, // 10% VAT

    // Section 4: Inventory
    stock: 25,
    minStock: 5,
    warehouse: 'Kho Tổng Hà Nội',
    allowBackorder: false,
    stockStatus: 'healthy',

    // Section 5: Technical Specifications
    specsRows: CATEGORY_SPEC_TEMPLATES.pc,

    // Section 6: SEO
    seoTitle: '',
    metaDescription: '',
    slug: '',

    // Section 7: Status
    status: 'Published', // Published, Draft, Archived
    badge: 'HOT SELLER',
    isFeatured: true
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [activeCategoryKey, setActiveCategoryKey] = useState('pc');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Sync initialData if editing
  useEffect(() => {
    if (initialData) {
      let initialSpecs = CATEGORY_SPEC_TEMPLATES.pc;
      if (Array.isArray(initialData.specs) && initialData.specs.length > 0) {
        initialSpecs = initialData.specs.map(s => ({
          item: s.item || '',
          desc: s.desc || '',
          detail: s.detail || '',
          warranty: s.warranty || ''
        }));
      }

      const generatedSlug = slugify(initialData.name || '');

      setFormData({
        name: initialData.name || '',
        sku: initialData.sku || ('SKU-' + (initialData.id || Math.floor(1000 + Math.random() * 9000))),
        brand: initialData.brand || 'NAT Computer',
        category: initialData.category || 'gaming',
        productType: initialData.productType || 'pc',
        shortDescription: initialData.shortDescription || initialData.description?.slice(0, 150) || '',
        description: initialData.description || '',

        image: initialData.image || '',
        gallery: Array.isArray(initialData.gallery) ? initialData.gallery : [initialData.image].filter(Boolean),

        price: initialData.price !== undefined ? initialData.price : '',
        originalPrice: initialData.originalPrice !== undefined ? initialData.originalPrice : (initialData.price || ''),
        costPrice: initialData.costPrice || Math.round((initialData.price || 0) * 0.78),
        discount: initialData.originalPrice && initialData.price ? Math.max(0, Math.round(((initialData.originalPrice - initialData.price) / initialData.originalPrice) * 100)) : 0,
        tax: initialData.tax !== undefined ? initialData.tax : 10,

        stock: initialData.stock !== undefined ? initialData.stock : 25,
        minStock: initialData.minStock || 5,
        warehouse: initialData.warehouse || 'Kho Tổng Hà Nội',
        allowBackorder: Boolean(initialData.allowBackorder),
        stockStatus: (initialData.stock > 10 ? 'healthy' : (initialData.stock > 0 ? 'low' : 'out')),

        specsRows: initialSpecs,

        seoTitle: initialData.seoTitle || `${initialData.name || ''} - Chính Hãng Giá Tốt | NAT Computer`,
        metaDescription: initialData.metaDescription || `Mua ngay ${initialData.name || ''} chính hãng bảo hành dài hạn, giá ưu đãi cực sốc tại NAT Computer. Giao hàng toàn quốc siêu tốc.`,
        slug: initialData.slug || generatedSlug,

        status: initialData.status || 'Published',
        badge: initialData.badge || 'HOT SELLER',
        isFeatured: initialData.isFeatured !== undefined ? initialData.isFeatured : true
      });

      // Detect spec key
      const cat = String(initialData.category || '').toLowerCase();
      if (CATEGORY_SPEC_TEMPLATES[cat]) {
        setActiveCategoryKey(cat);
      }
    }
  }, [initialData]);

  // Real-time Margin & Profit Calculations
  const sellingNum = parseFloat(formData.price) || 0;
  const originalNum = parseFloat(formData.originalPrice) || 0;
  const costNum = parseFloat(formData.costPrice) || 0;

  const grossProfit = sellingNum - costNum;
  const profitMargin = sellingNum > 0 ? ((grossProfit / sellingNum) * 100) : 0;
  const discountPercent = originalNum > sellingNum ? Math.round(((originalNum - sellingNum) / originalNum) * 100) : 0;

  // Handle Field Change
  const handleChange = (field, value) => {
    setIsDirty(true);
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto generate slug if name changed and slug not manually tailored
      if (field === 'name') {
        updated.slug = slugify(value);
        if (!prev.seoTitle || prev.seoTitle.includes(prev.name)) {
          updated.seoTitle = `${value} - Chính Hãng Giá Tốt | NAT Computer`;
        }
      }

      // Auto update stock status
      if (field === 'stock') {
        const num = parseInt(value, 10) || 0;
        updated.stockStatus = num > (prev.minStock || 10) ? 'healthy' : (num > 0 ? 'low' : 'out');
      }

      return updated;
    });
  };

  // Switch specs template
  const handleApplySpecTemplate = (key) => {
    if (CATEGORY_SPEC_TEMPLATES[key]) {
      setActiveCategoryKey(key);
      setFormData(prev => ({
        ...prev,
        specsRows: [...CATEGORY_SPEC_TEMPLATES[key]]
      }));
      setIsDirty(true);
    }
  };

  // Specs Rows Actions
  const handleSpecRowChange = (index, field, val) => {
    setIsDirty(true);
    setFormData(prev => {
      const next = [...prev.specsRows];
      next[index] = { ...next[index], [field]: val };
      return { ...prev, specsRows: next };
    });
  };

  const handleAddSpecRow = () => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      specsRows: [
        ...prev.specsRows,
        { item: '', desc: '', detail: '', warranty: '36 Tháng' }
      ]
    }));
  };

  const handleRemoveSpecRow = (index) => {
    setIsDirty(true);
    setFormData(prev => ({
      ...prev,
      specsRows: prev.specsRows.filter((_, i) => i !== index)
    }));
  };

  // Gallery Actions
  const handleAddGalleryImage = (e) => {
    e.preventDefault();
    if (!newGalleryUrl.trim()) return;
    setFormData(prev => ({
      ...prev,
      gallery: [...prev.gallery, newGalleryUrl.trim()]
    }));
    setNewGalleryUrl('');
    setIsDirty(true);
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  const handleSetMainImage = (url) => {
    setFormData(prev => ({
      ...prev,
      image: url
    }));
    setIsDirty(true);
  };

  // Reorder Gallery
  const handleMoveGallery = (index, direction) => {
    setFormData(prev => {
      const list = [...prev.gallery];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return { ...prev, gallery: list };
    });
    setIsDirty(true);
  };

  // Submit Handler
  const handleSubmit = async (targetStatus) => {
    if (!formData.name.trim()) {
      alert('Vui lòng nhập Tên sản phẩm');
      return;
    }
    if (!formData.price || isNaN(formData.price)) {
      alert('Vui lòng nhập Giá bán hợp lệ');
      return;
    }

    setIsSubmitting(true);
    try {
      const validSpecs = (formData.specsRows || []).filter(
        r => (r.item && r.item.trim()) || (r.desc && r.desc.trim())
      );

      const payload = {
        ...formData,
        status: targetStatus || formData.status,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice || formData.price),
        costPrice: parseFloat(formData.costPrice || 0),
        stock: parseInt(formData.stock, 10) || 0,
        specs: validSpecs,
        image: formData.image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80'
      };

      if (onSave) {
        await onSave(payload, targetStatus === 'Published');
      }
      setIsDirty(false);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Có lỗi xảy ra khi lưu sản phẩm. Vui lòng kiểm tra lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="product-editor-container">
      {/* Top Header Bar */}
      <div className="editor-top-nav">
        <div className="nav-left">
          <button type="button" className="btn-back-link" onClick={onCancel}>
            <ArrowLeft size={16} /> Quay lại danh sách
          </button>
          <div className="header-meta">
            <h2>{isEditing ? `Chỉnh sửa: ${formData.name || 'Sản phẩm'}` : 'Tạo Sản Phẩm & Cấu Hình Mới'}</h2>
            <p className="subtitle">
              {isEditing ? `Mã SKU: ${formData.sku || 'N/A'} • ID: #${initialData?.id || ''}` : 'Thiết lập đầy đủ thông số kỹ thuật, hình ảnh, giá vốn và tồn kho'}
            </p>
          </div>
        </div>

        <div className="nav-right">
          <span className={`status-pill pill-${formData.status.toLowerCase()}`}>
            {formData.status === 'Published' && <CheckCircle2 size={13} />}
            {formData.status === 'Draft' && <AlertCircle size={13} />}
            {formData.status}
          </span>
          {isDirty && <span className="dirty-badge">Chưa lưu thay đổi</span>}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="editor-two-col-layout">
        {/* ======================================================== */}
        {/* LEFT COLUMN (65%): Content, Media, Dynamic Specs, SEO    */}
        {/* ======================================================== */}
        <div className="editor-col-main">

          {/* SECTION 1 — BASIC INFORMATION */}
          <div className="editor-card">
            <div className="card-header">
              <div className="header-icon"><Cpu size={18} /></div>
              <div>
                <h3>Section 1 — Thông Tin Cơ Bản (Basic Information)</h3>
                <p>Tên hiển thị, phân loại linh kiện và mô tả chuyên sâu</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group">
                <label>Tên Sản Phẩm / Dàn PC <span className="req">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="VD: Dàn PC Gaming Ultra RTX 4080 / Intel Core i7-14700K"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="form-row-3">
                <div className="form-group">
                  <label>Mã SKU Sản Phẩm</label>
                  <div className="input-with-action">
                    <input
                      type="text"
                      placeholder="VD: PC-ULTRA-4080"
                      value={formData.sku}
                      onChange={(e) => handleChange('sku', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-inner-action"
                      onClick={() => handleChange('sku', 'SKU-' + Math.floor(100000 + Math.random() * 900000))}
                      title="Tạo mã SKU ngẫu nhiên"
                    >
                      Tạo mã
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Thương Hiệu / Hãng (Brand)</label>
                  <input
                    type="text"
                    placeholder="VD: ASUS, MSI, Intel, Gigabyte, NAT"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Phân Loại (Product Type)</label>
                  <select
                    value={formData.productType}
                    onChange={(e) => handleChange('productType', e.target.value)}
                  >
                    <option value="pc">🖥️ PC Lắp Ráp Nguyên Bộ</option>
                    <option value="component">⚙️ Linh Kiện Phần Cứng Rời</option>
                    <option value="gear">🖱️ Gaming Gear & Phụ Kiện</option>
                    <option value="monitor">📺 Màn Hình Đồ Họa / Gaming</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Danh Mục Phân Phối (Category)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      handleChange('category', newCat);
                      // Suggest spec template if exists
                      if (CATEGORY_SPEC_TEMPLATES[newCat]) {
                        handleApplySpecTemplate(newCat);
                      }
                    }}
                  >
                    {categories.length > 0 ? (
                      categories.map(c => (
                        <option key={c.id} value={c.slug || c.id}>{c.name}</option>
                      ))
                    ) : (
                      <>
                        <option value="gaming">PC Gaming</option>
                        <option value="workstation">PC Đồ Họa / Workstation</option>
                        <option value="office">PC Văn Phòng & Doanh Nghiệp</option>
                        <option value="cpu">Bộ Vi Xử Lý (CPU)</option>
                        <option value="gpu">Card Màn Hình (VGA / GPU)</option>
                        <option value="ram">Bộ Nhớ Trong (RAM)</option>
                        <option value="ssd">Ổ Cứng Thể Rắn (SSD / HDD)</option>
                        <option value="motherboard">Bo Mạch Chủ (Mainboard)</option>
                        <option value="psu">Nguồn Máy Tính (PSU)</option>
                        <option value="case">Vỏ Thùng Máy (Case)</option>
                        <option value="monitors">Màn Hình (Monitors)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label>Mô Tả Ngắn (Short Description)</label>
                  <input
                    type="text"
                    placeholder="Tóm tắt 1 câu nổi bật để hiển thị trên thẻ card sản phẩm..."
                    value={formData.shortDescription}
                    onChange={(e) => handleChange('shortDescription', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Mô Tả Chi Tiết & Chính Sách Hậu Mãi (Full Description)</label>
                <textarea
                  rows="3"
                  placeholder="Mô tả cấu hình, hiệu năng chiến game AAA, khả năng tản nhiệt, hỗ trợ nâng cấp và dịch vụ bảo hành tận nơi của NAT Computer..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SECTION 2 — PRODUCT MEDIA */}
          <div className="editor-card">
            <div className="card-header">
              <div className="header-icon"><ImageIcon size={18} /></div>
              <div>
                <h3>Section 2 — Hình Ảnh & Media Sản Phẩm (Product Media)</h3>
                <p>Ảnh đại diện chất lượng cao và bộ sưu tập đa góc chụp</p>
              </div>
            </div>

            <div className="card-body">
              {/* Main Image URL */}
              <div className="form-group">
                <label>Ảnh Đại Diện Chính (Main Image URL)</label>
                <div className="media-main-grid">
                  <div className="main-img-preview-box">
                    {formData.image ? (
                      <img src={formData.image} alt="Main Preview" />
                    ) : (
                      <div className="placeholder-box">
                        <UploadCloud size={32} />
                        <span>Chưa có ảnh chính</span>
                      </div>
                    )}
                  </div>
                  <div className="main-img-inputs">
                    <input
                      type="text"
                      placeholder="Dán link ảnh trực tiếp (VD: https://images.unsplash.com/...)"
                      value={formData.image}
                      onChange={(e) => handleChange('image', e.target.value)}
                    />
                    <div className="dropzone-hint">
                      💡 Mẹo: Nên sử dụng ảnh có nền trắng hoặc studio trong suốt (PNG/WebP, tỷ lệ 1:1, tối thiểu 800x800px).
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="gallery-section">
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>
                  Bộ Sưu Tập Thư Viện Ảnh (Gallery - {formData.gallery.length} ảnh)
                </label>

                {/* Add new photo URL bar */}
                <div className="add-gallery-bar">
                  <input
                    type="text"
                    placeholder="Nhập URL ảnh góc chụp phụ (mặt sau, cổng kết nối, nội thất LED)..."
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                  />
                  <button type="button" className="btn-add-gallery" onClick={handleAddGalleryImage}>
                    <Plus size={15} /> Thêm ảnh
                  </button>
                </div>

                {/* Gallery Items with Reorder & Delete */}
                <div className="gallery-thumbnails-grid">
                  {formData.gallery.map((imgUrl, idx) => (
                    <div key={idx} className={`thumb-card ${formData.image === imgUrl ? 'is-main' : ''}`}>
                      <img src={imgUrl} alt={`Gallery ${idx + 1}`} />
                      {formData.image === imgUrl && <span className="main-tag">Ảnh Chính</span>}
                      <div className="thumb-actions">
                        {idx > 0 && (
                          <button type="button" onClick={() => handleMoveGallery(idx, -1)} title="Chuyển sang trái">
                            ←
                          </button>
                        )}
                        {idx < formData.gallery.length - 1 && (
                          <button type="button" onClick={() => handleMoveGallery(idx, 1)} title="Chuyển sang phải">
                            →
                          </button>
                        )}
                        <button type="button" onClick={() => handleSetMainImage(imgUrl)} title="Đặt làm ảnh chính">
                          ⭐
                        </button>
                        <button type="button" className="btn-del-thumb" onClick={() => handleRemoveGalleryImage(idx)} title="Xóa ảnh này">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {formData.gallery.length === 0 && (
                    <div className="gallery-empty-state">
                      Chưa có ảnh thư viện nào. Dán URL ở trên để thêm hình ảnh đa góc chụp.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 5 — TECHNICAL SPECIFICATIONS (DYNAMIC) */}
          <div className="editor-card">
            <div className="card-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div className="header-icon"><Layers size={18} /></div>
                <div>
                  <h3>Section 5 — Thông Số Kỹ Thuật (Technical Specifications)</h3>
                  <p>Bộ thông số động tương thích chuẩn linh kiện máy tính</p>
                </div>
              </div>

              {/* Template quick pills */}
              <div className="specs-template-pills">
                <span className="pill-label">Mẫu nhanh:</span>
                {['cpu', 'gpu', 'ram', 'ssd', 'motherboard', 'psu', 'case', 'pc'].map(k => (
                  <button
                    key={k}
                    type="button"
                    className={`spec-pill-btn ${activeCategoryKey === k ? 'active' : ''}`}
                    onClick={() => handleApplySpecTemplate(k)}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-body">
              <div className="specs-matrix-table">
                <div className="specs-matrix-header">
                  <div>Tên Thông Số / Linh Kiện</div>
                  <div>Giá Trị Kỹ Thuật (Thông số chi tiết)</div>
                  <div>Ghi Chú / Tính Năng</div>
                  <div>Bảo Hành</div>
                  <div></div>
                </div>

                <div className="specs-matrix-rows">
                  {(formData.specsRows || []).map((row, idx) => (
                    <div key={idx} className="spec-row-item">
                      <div>
                        <input
                          type="text"
                          placeholder="VD: Socket, Xung nhịp..."
                          value={row.item || ''}
                          onChange={(e) => handleSpecRowChange(idx, 'item', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="VD: LGA1700, 5.4 GHz Turbo..."
                          value={row.desc || ''}
                          onChange={(e) => handleSpecRowChange(idx, 'desc', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Ghi chú chi tiết..."
                          value={row.detail || ''}
                          onChange={(e) => handleSpecRowChange(idx, 'detail', e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="36 Tháng"
                          value={row.warranty || '36 Tháng'}
                          onChange={(e) => handleSpecRowChange(idx, 'warranty', e.target.value)}
                        />
                      </div>
                      <div>
                        <button
                          type="button"
                          className="btn-remove-row"
                          onClick={() => handleRemoveSpecRow(idx)}
                          title="Xóa dòng thông số này"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="specs-footer-action">
                  <button type="button" className="btn-add-spec-row" onClick={handleAddSpecRow}>
                    <Plus size={15} /> + Thêm Dòng Thông Số Tùy Chỉnh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 6 — SEO OPTIMIZATION */}
          <div className="editor-card">
            <div className="card-header">
              <div className="header-icon"><Globe size={18} /></div>
              <div>
                <h3>Section 6 — Tối Ưu SEO & Đường Dẫn (Search Engine Optimization)</h3>
                <p>Tiêu chuẩn hiển thị trên Google Search và chia sẻ mạng xã hội</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>SEO Title (Tiêu Đề Trang Tìm Kiếm)</label>
                  <span className="char-count">{formData.seoTitle.length} / 60 ký tự</span>
                </div>
                <input
                  type="text"
                  placeholder="Tiêu đề hiển thị trên Google..."
                  value={formData.seoTitle}
                  onChange={(e) => handleChange('seoTitle', e.target.value)}
                />
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label>Meta Description (Mô Tả Ngắn Tìm Kiếm)</label>
                  <span className="char-count">{formData.metaDescription.length} / 160 ký tự</span>
                </div>
                <textarea
                  rows="2"
                  placeholder="Mô tả hấp dẫn kích thích click khi xuất hiện trên kết quả tìm kiếm..."
                  value={formData.metaDescription}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Đường Dẫn Thân Thiện (URL Slug)</label>
                <div className="slug-input-wrapper">
                  <span className="slug-prefix">https://natcomputer.vn/products/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', slugify(e.target.value))}
                  />
                </div>
              </div>

              {/* Google SERP Preview Box */}
              <div className="serp-preview-box">
                <div className="serp-header">🔍 Xem trước kết quả tìm kiếm Google (SERP Preview)</div>
                <div className="serp-url">https://natcomputer.vn › products › {formData.slug || 'san-pham'}</div>
                <div className="serp-title">{formData.seoTitle || formData.name || 'Tiêu đề sản phẩm'}</div>
                <div className="serp-desc">
                  {formData.metaDescription || formData.description?.slice(0, 150) || 'Mô tả tóm tắt sản phẩm máy tính và linh kiện PC tại NAT Computer...'}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN (35%): Status, Pricing & Margin, Inventory  */}
        {/* ======================================================== */}
        <div className="editor-col-sidebar">

          {/* SECTION 7 — STATUS & VISIBILITY */}
          <div className="editor-card">
            <div className="card-header">
              <div className="header-icon"><Tag size={18} /></div>
              <div>
                <h3>Section 7 — Trạng Thái Xuất Bản (Status)</h3>
                <p>Khả năng hiển thị và gắn tem bán chạy</p>
              </div>
            </div>

            <div className="card-body">
              <div className="status-radio-group">
                {[
                  { id: 'Published', label: 'Published (Công khai)', desc: 'Khách hàng có thể tìm thấy và đặt mua' },
                  { id: 'Draft', label: 'Draft (Bản nháp)', desc: 'Chỉ hiển thị cho quản trị viên' },
                  { id: 'Archived', label: 'Archived (Lưu trữ)', desc: 'Ẩn khỏi cửa hàng, ngưng kinh doanh' }
                ].map((s) => (
                  <label
                    key={s.id}
                    className={`status-radio-card ${formData.status === s.id ? 'active' : ''}`}
                    onClick={() => handleChange('status', s.id)}
                  >
                    <input
                      type="radio"
                      name="prod_status"
                      checked={formData.status === s.id}
                      onChange={() => {}}
                    />
                    <div>
                      <span className="status-title">{s.label}</span>
                      <span className="status-desc">{s.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="form-group" style={{ marginTop: '14px' }}>
                <label>Tem Nổi Bật (Promotional Badge)</label>
                <select
                  value={formData.badge}
                  onChange={(e) => handleChange('badge', e.target.value)}
                >
                  <option value="HOT SELLER">🔥 HOT SELLER</option>
                  <option value="BEST CHOICE">⭐ BEST CHOICE</option>
                  <option value="AI ULTRA POWER">⚡ AI ULTRA POWER</option>
                  <option value="GIẢM 30%">🏷️ GIẢM 30%</option>
                  <option value="NEW ARRIVAL">✨ MỚI VỀ</option>
                  <option value="">(Không gắn tem)</option>
                </select>
              </div>

              <div className="feature-toggle-row">
                <input
                  type="checkbox"
                  id="feat-chk"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                />
                <label htmlFor="feat-chk">Ghim sản phẩm nổi bật lên Trang chủ (Homepage)</label>
              </div>
            </div>
          </div>

          {/* SECTION 3 — PRICING & PROFIT MARGIN */}
          <div className="editor-card">
            <div className="card-header">
              <div className="header-icon"><DollarSign size={18} /></div>
              <div>
                <h3>Section 3 — Giá Bán & Lợi Nhuận (Pricing)</h3>
                <p>Tự động tính tỷ suất lợi nhuận Margin & Chiết khấu</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-group">
                <label>Giá Bán Khuyến Mãi (VND) <span className="req">*</span></label>
                <input
                  type="number"
                  required
                  placeholder="VD: 35900000"
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                />
                <span className="currency-preview">{fmt(formData.price)}</span>
              </div>

              <div className="form-group">
                <label>Giá Gốc Niêm Yết (VND)</label>
                <input
                  type="number"
                  placeholder="VD: 39900000"
                  value={formData.originalPrice}
                  onChange={(e) => handleChange('originalPrice', e.target.value)}
                />
                {discountPercent > 0 && (
                  <span className="discount-tag">Tiết kiệm {discountPercent}% cho khách hàng</span>
                )}
              </div>

              <div className="form-group">
                <label>Giá Vốn Nhập Kho (Cost Price VND)</label>
                <input
                  type="number"
                  placeholder="VD: 28000000"
                  value={formData.costPrice}
                  onChange={(e) => handleChange('costPrice', e.target.value)}
                />
                <span className="currency-preview">Vốn: {fmt(formData.costPrice)}</span>
              </div>

              <div className="form-group">
                <label>Thuế VAT (%)</label>
                <select
                  value={formData.tax}
                  onChange={(e) => handleChange('tax', Number(e.target.value))}
                >
                  <option value={0}>0% (Không chịu thuế)</option>
                  <option value={8}>8% (VAT Ưu đãi linh kiện)</option>
                  <option value={10}>10% (VAT Chuẩn)</option>
                </select>
              </div>

              {/* Live Profit Margin Metric Card */}
              <div className={`profit-calculator-card ${profitMargin >= 15 ? 'healthy' : (profitMargin >= 0 ? 'warning' : 'danger')}`}>
                <div className="calc-row">
                  <span className="calc-label">Lợi Nhuận Gộp (Gross Profit):</span>
                  <span className="calc-value">{fmt(grossProfit)}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">Tỷ Suất Lợi Nhuận (Margin):</span>
                  <span className="calc-value">{profitMargin.toFixed(1)}%</span>
                </div>
                <div className="margin-bar">
                  <div
                    className="margin-fill"
                    style={{ width: `${Math.min(100, Math.max(0, profitMargin * 2))}%` }}
                  />
                </div>
                <div className="calc-hint">
                  {profitMargin >= 15 ? '🟢 Biên lợi nhuận lý tưởng cho PC Hardware' :
                   profitMargin >= 0 ? '🟡 Biên lợi nhuận thấp, cần cân đối giá vốn' :
                   '🔴 Cảnh báo: Giá bán đang thấp hơn giá vốn (Lỗ)!'}
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4 — INVENTORY & WAREHOUSE */}
          <div className="editor-card">
            <div className="card-header">
              <div className="header-icon"><Boxes size={18} /></div>
              <div>
                <h3>Section 4 — Kho Hàng & Tồn Kho (Inventory)</h3>
                <p>Kiểm soát tồn kho và cơ sở chi nhánh</p>
              </div>
            </div>

            <div className="card-body">
              <div className="form-row-2">
                <div className="form-group">
                  <label>Số Lượng Tồn Kho</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Cảnh Báo Tối Thiểu</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minStock}
                    onChange={(e) => handleChange('minStock', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Chi Nhánh Kho Lưu Giữ (Warehouse)</label>
                <select
                  value={formData.warehouse}
                  onChange={(e) => handleChange('warehouse', e.target.value)}
                >
                  <option value="Kho Tổng Hà Nội">🏢 Kho Tổng Hà Nội (Trần Đại Nghĩa)</option>
                  <option value="Kho Hồ Chí Minh">🏬 Kho Hồ Chí Minh (Quận 10)</option>
                  <option value="Kho Đà Nẵng">🏪 Kho Đà Nẵng (Hải Châu)</option>
                  <option value="Kho Hub Cầu Giấy">📦 Kho Hub Express Cầu Giấy</option>
                </select>
              </div>

              <div className="feature-toggle-row">
                <input
                  type="checkbox"
                  id="backorder-chk"
                  checked={formData.allowBackorder}
                  onChange={(e) => handleChange('allowBackorder', e.target.checked)}
                />
                <label htmlFor="backorder-chk">Cho phép đặt trước khi hết hàng (Allow Backorder)</label>
              </div>

              {/* Stock status indicator pill */}
              <div className="stock-status-box">
                <span className="stock-status-label">Trạng thái kho hiện tại:</span>
                <span className={`stock-pill stock-${formData.stockStatus}`}>
                  {formData.stockStatus === 'healthy' && '🟢 Đủ Hàng An Toàn (>10)'}
                  {formData.stockStatus === 'low' && '🟠 Sắp Hết Hàng (Cần Nhập Thêm)'}
                  {formData.stockStatus === 'out' && '🔴 Hết Hàng'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* BOTTOM STICKY ACTION BAR                                 */}
      {/* ======================================================== */}
      <div className="sticky-action-dock">
        <div className="dock-left">
          <button type="button" className="btn-dock-cancel" onClick={onCancel}>
            Hủy Bỏ / Đóng
          </button>
          <span className="dock-dirty-text">
            {isDirty ? '⚠️ Bạn có thay đổi chưa lưu' : '✅ Mọi thay đổi đã được đồng bộ'}
          </span>
        </div>

        <div className="dock-right">
          <button
            type="button"
            className="btn-dock-draft"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Draft')}
          >
            Lưu Bản Nháp (Save Draft)
          </button>

          <button
            type="button"
            className="btn-dock-publish"
            disabled={isSubmitting}
            onClick={() => handleSubmit('Published')}
          >
            <Save size={16} />
            {isSubmitting ? 'Đang lưu vào CSDL...' : (isEditing ? 'Lưu Thay Đổi (Update Product)' : 'Lưu & Xuất Bản (Save & Publish)')}
          </button>
        </div>
      </div>
    </div>
  );
}
