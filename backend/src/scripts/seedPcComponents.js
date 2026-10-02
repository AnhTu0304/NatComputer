const fs = require('fs');
const path = require('path');
const { dbModule } = require('../config/dbHelper');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');

const NEW_CATEGORIES = [
  { id: 'cat_cpu', name: 'Vi xử lý (CPU)', slug: 'cpu', icon: 'Cpu' },
  { id: 'cat_mainboard', name: 'Bo mạch chủ (Mainboard)', slug: 'mainboard', icon: 'Layers' },
  { id: 'cat_ram', name: 'Bộ nhớ trong (RAM)', slug: 'ram', icon: 'Cpu' },
  { id: 'cat_vga', name: 'Card màn hình (VGA)', slug: 'vga', icon: 'Tv' },
  { id: 'cat_ssd', name: 'Ổ cứng lưu trữ (SSD / HDD)', slug: 'ssd', icon: 'HardDrive' },
  { id: 'cat_psu', name: 'Nguồn máy tính (PSU)', slug: 'psu', icon: 'Zap' },
  { id: 'cat_cooler', name: 'Tản nhiệt CPU / Nước AIO', slug: 'cooler', icon: 'Wind' },
  { id: 'cat_case', name: 'Vỏ thùng máy (Case)', slug: 'case', icon: 'Box' },
  { id: 'cat_monitors', name: 'Màn hình máy tính', slug: 'man-hinh', icon: 'Monitor' }
];

const COMPONENT_PRODUCTS = [
  // 1. CPU
  {
    id: 'comp_cpu_i9_14900k',
    name: 'CPU Intel Core i9 14900K (Up to 6.0GHz, 24 Nhân 32 Luồng, 36MB Cache)',
    category: 'cat_cpu',
    price: 15490000,
    originalPrice: 16990000,
    stockQuantity: 15,
    rating: 5.0,
    reviewsCount: 32,
    badge: 'Flagship',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
    description: 'Vi xử lý cao cấp nhất thế hệ 14 của Intel, tối ưu hóa cho gaming 4K và đồ họa chuyên nghiệp.',
    specs: { brand: 'Intel', socket: 'LGA1700', cores: '24 nhân / 32 luồng', clock: 'Up to 6.0GHz', tdp: 253, warranty: '36 Tháng' }
  },
  {
    id: 'comp_cpu_i7_14700k',
    name: 'CPU Intel Core i7 14700K (Up to 5.6GHz, 20 Nhân 28 Luồng, 33MB Cache)',
    category: 'cat_cpu',
    price: 10890000,
    originalPrice: 11990000,
    stockQuantity: 20,
    rating: 4.9,
    reviewsCount: 45,
    badge: 'Bán chạy',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
    description: 'Lựa chọn cân bằng đỉnh cao giữa gaming và render đồ họa.',
    specs: { brand: 'Intel', socket: 'LGA1700', cores: '20 nhân / 28 luồng', clock: 'Up to 5.6GHz', tdp: 125, warranty: '36 Tháng' }
  },
  {
    id: 'comp_cpu_i5_14600k',
    name: 'CPU Intel Core i5 14600K (Up to 5.3GHz, 14 Nhân 20 Luồng, 24MB Cache)',
    category: 'cat_cpu',
    price: 7690000,
    originalPrice: 8490000,
    stockQuantity: 25,
    rating: 4.9,
    reviewsCount: 60,
    badge: 'Hot',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
    description: 'Ông vua phân khúc tầm trung cho game thủ và streamer.',
    specs: { brand: 'Intel', socket: 'LGA1700', cores: '14 nhân / 20 luồng', clock: 'Up to 5.3GHz', tdp: 125, warranty: '36 Tháng' }
  },
  {
    id: 'comp_cpu_i5_13400f',
    name: 'CPU Intel Core i5 13400F (Up to 4.6GHz, 10 Nhân 16 Luồng, 20MB Cache)',
    category: 'cat_cpu',
    price: 4890000,
    originalPrice: 5390000,
    stockQuantity: 30,
    rating: 4.8,
    reviewsCount: 82,
    badge: 'Quốc dân',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
    description: 'CPU quốc dân cho các dàn PC Gaming tối ưu chi phí.',
    specs: { brand: 'Intel', socket: 'LGA1700', cores: '10 nhân / 16 luồng', clock: 'Up to 4.6GHz', tdp: 65, warranty: '36 Tháng' }
  },
  {
    id: 'comp_cpu_ryzen_7800x3d',
    name: 'CPU AMD Ryzen 7 7800X3D (Up to 5.0GHz, 8 Nhân 16 Luồng, 96MB 3D V-Cache)',
    category: 'cat_cpu',
    price: 10490000,
    originalPrice: 11500000,
    stockQuantity: 18,
    rating: 5.0,
    reviewsCount: 77,
    badge: 'Gaming #1',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
    description: 'CPU chơi game tốt nhất thế giới với công nghệ bộ nhớ đệm 3D V-Cache độc quyền.',
    specs: { brand: 'AMD', socket: 'AM5', cores: '8 nhân / 16 luồng', clock: 'Up to 5.0GHz', tdp: 120, warranty: '36 Tháng' }
  },
  {
    id: 'comp_cpu_ryzen_7600x',
    name: 'CPU AMD Ryzen 5 7600X (Up to 5.3GHz, 6 Nhân 12 Luồng, 32MB Cache)',
    category: 'cat_cpu',
    price: 5590000,
    originalPrice: 6200000,
    stockQuantity: 22,
    rating: 4.8,
    reviewsCount: 39,
    badge: 'Hiệu năng cao',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=400&q=80',
    description: 'Hiệu năng gaming ấn tượng trên nền tảng socket AM5 hiện đại.',
    specs: { brand: 'AMD', socket: 'AM5', cores: '6 nhân / 12 luồng', clock: 'Up to 5.3GHz', tdp: 105, warranty: '36 Tháng' }
  },

  // 2. MAINBOARD
  {
    id: 'comp_mb_asus_z790_hero',
    name: 'Mainboard ASUS ROG MAXIMUS Z790 HERO DDR5',
    category: 'cat_mainboard',
    price: 16990000,
    originalPrice: 18500000,
    stockQuantity: 8,
    rating: 5.0,
    reviewsCount: 15,
    badge: 'Cao cấp',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    description: 'Bo mạch chủ đầu bảng socket LGA1700 hỗ trợ ép xung cực hạn và chuẩn PCIe 5.0.',
    specs: { brand: 'ASUS', socket: 'LGA1700', chipset: 'Z790', formFactor: 'ATX', ramSlots: '4x DDR5', warranty: '36 Tháng' }
  },
  {
    id: 'comp_mb_msi_b760m_mortar',
    name: 'Mainboard MSI MAG B760M MORTAR WIFI DDR5',
    category: 'cat_mainboard',
    price: 4890000,
    originalPrice: 5290000,
    stockQuantity: 35,
    rating: 4.9,
    reviewsCount: 92,
    badge: 'Bán chạy',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    description: 'Bo mạch chủ M-ATX bền bỉ, tích hợp WiFi 6E và tản nhiệt VRM dày dặn.',
    specs: { brand: 'MSI', socket: 'LGA1700', chipset: 'B760', formFactor: 'Micro-ATX', ramSlots: '4x DDR5', warranty: '36 Tháng' }
  },
  {
    id: 'comp_mb_gigabyte_b760_d4',
    name: 'Mainboard GIGABYTE B760 GAMING X AX DDR4',
    category: 'cat_mainboard',
    price: 3890000,
    originalPrice: 4200000,
    stockQuantity: 40,
    rating: 4.8,
    reviewsCount: 48,
    badge: 'Tối ưu giá',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    description: 'Mainboard chuẩn ATX hỗ trợ RAM DDR4 tiết kiệm chi phí nâng cấp.',
    specs: { brand: 'GIGABYTE', socket: 'LGA1700', chipset: 'B760', formFactor: 'ATX', ramSlots: '4x DDR4', warranty: '36 Tháng' }
  },
  {
    id: 'comp_mb_asus_h610m_k',
    name: 'Mainboard ASUS PRIME H610M-K D4',
    category: 'cat_mainboard',
    price: 1950000,
    originalPrice: 2200000,
    stockQuantity: 50,
    rating: 4.7,
    reviewsCount: 110,
    badge: 'Tiết kiệm',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    description: 'Mainboard cơ bản cho Core i3 và i5 thế hệ 12/13/14.',
    specs: { brand: 'ASUS', socket: 'LGA1700', chipset: 'H610', formFactor: 'Micro-ATX', ramSlots: '2x DDR4', warranty: '36 Tháng' }
  },
  {
    id: 'comp_mb_msi_b650_gaming_plus',
    name: 'Mainboard MSI B650 GAMING PLUS WIFI AM5',
    category: 'cat_mainboard',
    price: 4590000,
    originalPrice: 4990000,
    stockQuantity: 28,
    rating: 4.9,
    reviewsCount: 53,
    badge: 'Khuyên dùng AMD',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    description: 'Bo mạch chủ chuyên game cho socket AMD AM5 (Ryzen 7000, 8000, 9000).',
    specs: { brand: 'MSI', socket: 'AM5', chipset: 'B650', formFactor: 'ATX', ramSlots: '4x DDR5', warranty: '36 Tháng' }
  },
  {
    id: 'comp_mb_gigabyte_x670e_aorus',
    name: 'Mainboard GIGABYTE X670E AORUS MASTER AM5',
    category: 'cat_mainboard',
    price: 13990000,
    originalPrice: 15500000,
    stockQuantity: 6,
    rating: 5.0,
    reviewsCount: 12,
    badge: 'Cao cấp AMD',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    description: 'Bo mạch chủ khủng cho game thủ ép xung Ryzen 9 hàng đầu.',
    specs: { brand: 'GIGABYTE', socket: 'AM5', chipset: 'X670E', formFactor: 'E-ATX', ramSlots: '4x DDR5', warranty: '36 Tháng' }
  },

  // 3. RAM
  {
    id: 'comp_ram_corsair_dominator_32gb',
    name: 'RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz White',
    category: 'cat_ram',
    price: 4690000,
    originalPrice: 5190000,
    stockQuantity: 25,
    rating: 5.0,
    reviewsCount: 30,
    badge: 'RGB Đỉnh cao',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
    description: 'Dòng RAM kiệt tác của Corsair với LED Capellix rực rỡ và bus 6000MHz cực nhanh.',
    specs: { brand: 'Corsair', type: 'DDR5', capacity: '32GB (2x16GB)', speed: '6000MHz', rgb: 'Có', warranty: '36 Tháng' }
  },
  {
    id: 'comp_ram_kingston_fury_32gb',
    name: 'RAM Kingston Fury Beast RGB 32GB (2x16GB) DDR5 5600MHz',
    category: 'cat_ram',
    price: 2890000,
    originalPrice: 3200000,
    stockQuantity: 40,
    rating: 4.9,
    reviewsCount: 68,
    badge: 'Bán chạy',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
    description: 'Hiệu năng ổn định tuyệt đối và tương thích tốt cả Intel XMP 3.0 và AMD EXPO.',
    specs: { brand: 'Kingston', type: 'DDR5', capacity: '32GB (2x16GB)', speed: '5600MHz', rgb: 'Có', warranty: '36 Tháng' }
  },
  {
    id: 'comp_ram_corsair_vengeance_32gb',
    name: 'RAM Corsair Vengeance 32GB (2x16GB) DDR5 5200MHz Black',
    category: 'cat_ram',
    price: 2450000,
    originalPrice: 2750000,
    stockQuantity: 30,
    rating: 4.8,
    reviewsCount: 42,
    badge: 'Tối giản',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
    description: 'Thiết kế tản nhiệt nhôm đen huyền bí, không LED, hiệu năng thuần túy.',
    specs: { brand: 'Corsair', type: 'DDR5', capacity: '32GB (2x16GB)', speed: '5200MHz', rgb: 'Không', warranty: '36 Tháng' }
  },
  {
    id: 'comp_ram_kingston_fury_16gb_d4',
    name: 'RAM Kingston Fury Beast 16GB (1x16GB) DDR4 3200MHz',
    category: 'cat_ram',
    price: 990000,
    originalPrice: 1190000,
    stockQuantity: 70,
    rating: 4.8,
    reviewsCount: 145,
    badge: 'Quốc dân',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
    description: 'RAM DDR4 giá tốt, dễ nâng cấp và bảo hành chính hãng 3 năm.',
    specs: { brand: 'Kingston', type: 'DDR4', capacity: '16GB (1x16GB)', speed: '3200MHz', rgb: 'Không', warranty: '36 Tháng' }
  },
  {
    id: 'comp_ram_gskill_trident_64gb',
    name: 'RAM G.SKILL Trident Z5 RGB 64GB (2x32GB) DDR5 6000MHz Black',
    category: 'cat_ram',
    price: 6290000,
    originalPrice: 6990000,
    stockQuantity: 12,
    rating: 5.0,
    reviewsCount: 19,
    badge: 'Workstation',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=400&q=80',
    description: 'Dung lượng khủng 64GB dành cho dựng phim 4K, đồ họa 3D và AI.',
    specs: { brand: 'G.SKILL', type: 'DDR5', capacity: '64GB (2x32GB)', speed: '6000MHz', rgb: 'Có', warranty: '36 Tháng' }
  },

  // 4. CARD ĐỒ HỌA (VGA)
  {
    id: 'comp_vga_rog_rtx4090',
    name: 'Card Màn Hình ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
    category: 'cat_vga',
    price: 54990000,
    originalPrice: 59900000,
    stockQuantity: 5,
    rating: 5.0,
    reviewsCount: 22,
    badge: 'Quái vật đồ họa',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Card đồ họa đỉnh nóc thế giới, chiến max setting mọi tựa game 4K Ray Tracing.',
    specs: { brand: 'ASUS', gpu: 'RTX 4090', vram: '24GB GDDR6X', psuReq: '850W - 1000W', warranty: '36 Tháng' }
  },
  {
    id: 'comp_vga_msi_rtx4070ti_super',
    name: 'Card Màn Hình MSI Gaming X Slim GeForce RTX 4070 Ti SUPER 16GB',
    category: 'cat_vga',
    price: 23490000,
    originalPrice: 25500000,
    stockQuantity: 14,
    rating: 4.9,
    reviewsCount: 38,
    badge: 'Hot Gaming',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: '16GB VRAM chuẩn mực cho đồ họa 2K - 4K và ứng dụng AI Stable Diffusion.',
    specs: { brand: 'MSI', gpu: 'RTX 4070 Ti SUPER', vram: '16GB GDDR6X', psuReq: '750W', warranty: '36 Tháng' }
  },
  {
    id: 'comp_vga_gigabyte_rtx4070_super',
    name: 'Card Màn Hình GIGABYTE GeForce RTX 4070 SUPER WINDFORCE OC 12GB',
    category: 'cat_vga',
    price: 16990000,
    originalPrice: 18500000,
    stockQuantity: 20,
    rating: 4.9,
    reviewsCount: 54,
    badge: 'Khuyên dùng',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Hiệu năng vượt trội RTX 3090 thế hệ trước với mức tiêu thụ điện năng tối ưu.',
    specs: { brand: 'GIGABYTE', gpu: 'RTX 4070 SUPER', vram: '12GB GDDR6X', psuReq: '650W', warranty: '36 Tháng' }
  },
  {
    id: 'comp_vga_asus_rtx4060_8gb',
    name: 'Card Màn Hình ASUS Dual GeForce RTX 4060 EVO OC 8GB GDDR6',
    category: 'cat_vga',
    price: 8490000,
    originalPrice: 9200000,
    stockQuantity: 45,
    rating: 4.8,
    reviewsCount: 110,
    badge: 'Bán chạy nhất',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Hỗ trợ DLSS 3 và Frame Generation, mang lại khung hình mượt mà tuyệt đối.',
    specs: { brand: 'ASUS', gpu: 'RTX 4060', vram: '8GB GDDR6', psuReq: '550W', warranty: '36 Tháng' }
  },
  {
    id: 'comp_vga_msi_rtx3060_12gb',
    name: 'Card Màn Hình MSI GeForce RTX 3060 VENTUS 2X 12G OC',
    category: 'cat_vga',
    price: 6990000,
    originalPrice: 7700000,
    stockQuantity: 30,
    rating: 4.8,
    reviewsCount: 88,
    badge: '12GB VRAM',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Lựa chọn xuất sắc cho các bạn làm đồ họa 3D kiến trúc cần dung lượng bộ nhớ lớn.',
    specs: { brand: 'MSI', gpu: 'RTX 3060', vram: '12GB GDDR6', psuReq: '550W', warranty: '36 Tháng' }
  },

  // 5. Ổ CỨNG (SSD / HDD)
  {
    id: 'comp_ssd_samsung_990pro_2tb',
    name: 'Ổ Cứng SSD Samsung 990 PRO 2TB PCIe Gen 4.0 x4 NVMe M.2',
    category: 'cat_ssd',
    price: 4890000,
    originalPrice: 5490000,
    stockQuantity: 20,
    rating: 5.0,
    reviewsCount: 42,
    badge: 'Tốc độ 7450MB/s',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
    description: 'SSD đỉnh cao tốc độ đọc 7450MB/s, ghi 6900MB/s cho hiệu suất làm việc tức thì.',
    specs: { brand: 'Samsung', capacity: '2TB', interface: 'PCIe Gen 4.0 NVMe', readSpeed: '7450 MB/s', warranty: '60 Tháng' }
  },
  {
    id: 'comp_ssd_samsung_980_1tb',
    name: 'Ổ Cứng SSD Samsung 980 1TB PCIe NVMe 3.0x4 M.2 2280',
    category: 'cat_ssd',
    price: 2150000,
    originalPrice: 2450000,
    stockQuantity: 35,
    rating: 4.9,
    reviewsCount: 79,
    badge: 'Bền bỉ',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
    description: 'Độ bền TBW cao, nhiệt độ hoạt động mát mẻ và tương thích rộng rãi.',
    specs: { brand: 'Samsung', capacity: '1TB', interface: 'PCIe Gen 3.0 NVMe', readSpeed: '3500 MB/s', warranty: '60 Tháng' }
  },
  {
    id: 'comp_ssd_kingston_nv2_1tb',
    name: 'Ổ Cứng SSD Kingston NV2 1TB PCIe 4.0 x4 NVMe M.2',
    category: 'cat_ssd',
    price: 1490000,
    originalPrice: 1750000,
    stockQuantity: 60,
    rating: 4.8,
    reviewsCount: 130,
    badge: 'Bán chạy nhất',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
    description: 'Dung lượng 1TB chuẩn Gen 4 giá cực hời cho mọi game thủ.',
    specs: { brand: 'Kingston', capacity: '1TB', interface: 'PCIe Gen 4.0 NVMe', readSpeed: '3500 MB/s', warranty: '36 Tháng' }
  },
  {
    id: 'comp_ssd_kingston_nv2_500gb',
    name: 'Ổ Cứng SSD Kingston NV2 500GB PCIe 4.0 x4 NVMe M.2',
    category: 'cat_ssd',
    price: 990000,
    originalPrice: 1150000,
    stockQuantity: 80,
    rating: 4.8,
    reviewsCount: 95,
    badge: 'Tiết kiệm',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
    description: 'Ổ đĩa khởi động hệ điều hành Windows siêu nhanh cho bộ máy giá rẻ.',
    specs: { brand: 'Kingston', capacity: '500GB', interface: 'PCIe Gen 4.0 NVMe', readSpeed: '3000 MB/s', warranty: '36 Tháng' }
  },
  {
    id: 'comp_hdd_wd_blue_2tb',
    name: 'Ổ Cứng HDD Western Digital Blue 2TB 3.5 inch 7200RPM 256MB Cache',
    category: 'cat_ssd',
    price: 1550000,
    originalPrice: 1750000,
    stockQuantity: 25,
    rating: 4.7,
    reviewsCount: 34,
    badge: 'Lưu trữ lớn',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=400&q=80',
    description: 'Giải pháp lưu trữ tài liệu ảnh, video dung lượng lớn an toàn và tiết kiệm.',
    specs: { brand: 'Western Digital', capacity: '2TB', interface: 'SATA 3 (6Gb/s)', speed: '7200 RPM', warranty: '24 Tháng' }
  },

  // 6. NGUỒN (PSU)
  {
    id: 'comp_psu_corsair_rm1000e',
    name: 'Nguồn Máy Tính Corsair RM1000e 1000W 80 Plus Gold Full Modular (ATX 3.0 / PCIe 5.0)',
    category: 'cat_psu',
    price: 4290000,
    originalPrice: 4790000,
    stockQuantity: 15,
    rating: 5.0,
    reviewsCount: 28,
    badge: 'ATX 3.0 Gold',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Chuẩn nguồn ATX 3.0 thế hệ mới kèm dây cáp 12VHPWR cấp điện trực tiếp cho RTX 4090/4080.',
    specs: { brand: 'Corsair', wattage: 1000, efficiency: '80 Plus Gold', modular: 'Full Modular', warranty: '84 Tháng' }
  },
  {
    id: 'comp_psu_seasonic_gx850',
    name: 'Nguồn Máy Tính Seasonic Focus GX-850 850W 80 Plus Gold',
    category: 'cat_psu',
    price: 3490000,
    originalPrice: 3890000,
    stockQuantity: 20,
    rating: 5.0,
    reviewsCount: 41,
    badge: 'Độ bền thép',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Thương hiệu nguồn danh tiếng số 1 thế giới với tụ điện 100% Nhật Bản.',
    specs: { brand: 'Seasonic', wattage: 850, efficiency: '80 Plus Gold', modular: 'Full Modular', warranty: '120 Tháng' }
  },
  {
    id: 'comp_psu_msi_a750gl',
    name: 'Nguồn Máy Tính MSI MAG A750GL PCIE5 750W 80 Plus Gold',
    category: 'cat_psu',
    price: 2490000,
    originalPrice: 2850000,
    stockQuantity: 35,
    rating: 4.9,
    reviewsCount: 65,
    badge: 'Bán chạy',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Nguồn 750W chuẩn PCIe 5.0 giá tốt nhất phân khúc Gold.',
    specs: { brand: 'MSI', wattage: 750, efficiency: '80 Plus Gold', modular: 'Full Modular', warranty: '60 Tháng' }
  },
  {
    id: 'comp_psu_corsair_cv650',
    name: 'Nguồn Máy Tính Corsair CV650 650W 80 Plus Bronze',
    category: 'cat_psu',
    price: 1490000,
    originalPrice: 1690000,
    stockQuantity: 50,
    rating: 4.8,
    reviewsCount: 89,
    badge: 'Quốc dân',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Nguồn 650W quốc dân cho các dàn máy trang bị RTX 4060 hoặc RTX 3060.',
    specs: { brand: 'Corsair', wattage: 650, efficiency: '80 Plus Bronze', modular: 'Non-Modular', warranty: '36 Tháng' }
  },
  {
    id: 'comp_psu_deepcool_pk550d',
    name: 'Nguồn Máy Tính DeepCool PK550D 550W 80 Plus Bronze',
    category: 'cat_psu',
    price: 990000,
    originalPrice: 1190000,
    stockQuantity: 60,
    rating: 4.7,
    reviewsCount: 75,
    badge: 'Giá rẻ',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Nguồn giá rẻ đạt chuẩn 80 Plus Bronze an toàn cho các bộ máy văn phòng và gaming cơ bản.',
    specs: { brand: 'DeepCool', wattage: 550, efficiency: '80 Plus Bronze', modular: 'Non-Modular', warranty: '36 Tháng' }
  },

  // 7. TẢN NHIỆT (Cooler)
  {
    id: 'comp_cooler_deepcool_lt720',
    name: 'Tản Nhiệt Nước DeepCool LT720 360mm ARGB Liquid Cooler White',
    category: 'cat_cooler',
    price: 3190000,
    originalPrice: 3590000,
    stockQuantity: 20,
    rating: 5.0,
    reviewsCount: 46,
    badge: 'Top Hiệu Năng',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Bơm nước thế hệ thứ 4 tản nhiệt cực êm và mát cho Core i7, i9.',
    specs: { brand: 'DeepCool', type: 'Tản nước AIO 360mm', fanRpm: '2250 RPM', rgb: 'ARGB', warranty: '36 Tháng' }
  },
  {
    id: 'comp_cooler_corsair_h150i_lcd',
    name: 'Tản Nhiệt Nước Corsair iCUE H150i ELITE LCD XT 360mm Black',
    category: 'cat_cooler',
    price: 6590000,
    originalPrice: 7200000,
    stockQuantity: 10,
    rating: 5.0,
    reviewsCount: 21,
    badge: 'Màn hình LCD',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Trang bị màn hình LCD IPS 2.1 inch hiển thị ảnh GIF và nhiệt độ thời gian thực.',
    specs: { brand: 'Corsair', type: 'Tản nước AIO 360mm (Có LCD)', fanRpm: '2100 RPM', rgb: 'iCUE RGB', warranty: '60 Tháng' }
  },
  {
    id: 'comp_cooler_thermalright_pa120',
    name: 'Tản Nhiệt Khí Thermalright Peerless Assassin 120 SE ARGB',
    category: 'cat_cooler',
    price: 850000,
    originalPrice: 1050000,
    stockQuantity: 50,
    rating: 4.9,
    reviewsCount: 140,
    badge: 'Vua tản khí',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Tản nhiệt khí 2 tháp 6 ống đồng hiệu năng đè bẹp nhiều mẫu tản nước giá gấp đôi.',
    specs: { brand: 'Thermalright', type: 'Tản nhiệt khí 2 tháp', fans: '2x 120mm ARGB', tdpSupport: '240W', warranty: '24 Tháng' }
  },
  {
    id: 'comp_cooler_thermalright_aqua240',
    name: 'Tản Nhiệt Nước Thermalright Aqua Elite 240 ARGB V3 Black',
    category: 'cat_cooler',
    price: 1390000,
    originalPrice: 1650000,
    stockQuantity: 30,
    rating: 4.8,
    reviewsCount: 58,
    badge: 'AIO Giá tốt',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Tản nước 240mm gọn gàng, đèn ARGB sync bo mạch chủ.',
    specs: { brand: 'Thermalright', type: 'Tản nước AIO 240mm', fanRpm: '1500 RPM', rgb: 'ARGB', warranty: '24 Tháng' }
  },

  // 8. VỎ CASE
  {
    id: 'comp_case_lianli_o11_evo',
    name: 'Vỏ Case Lian Li O11 Dynamic EVO Black (Kính Cường Lực Hai Mặt)',
    category: 'cat_case',
    price: 3890000,
    originalPrice: 4290000,
    stockQuantity: 15,
    rating: 5.0,
    reviewsCount: 37,
    badge: 'Huyền thoại Showroom',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Case máy tính đẹp nhất để phô diễn toàn bộ linh kiện và tản nhiệt nước Custom.',
    specs: { brand: 'Lian Li', formFactor: 'ATX / E-ATX', glass: 'Kính 2 mặt', gpuLength: '422mm', warranty: '12 Tháng' }
  },
  {
    id: 'comp_case_nzxt_h9_flow',
    name: 'Vỏ Case NZXT H9 Flow Matte Black (Kính Panorama Không Cột)',
    category: 'cat_case',
    price: 4190000,
    originalPrice: 4600000,
    stockQuantity: 12,
    rating: 4.9,
    reviewsCount: 26,
    badge: 'Panorama',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Góc nhìn không góc chết với thiết kế kính liền mạch độc bản của NZXT.',
    specs: { brand: 'NZXT', formFactor: 'Mid-Tower ATX', glass: 'Panorama Liền Mạch', gpuLength: '435mm', warranty: '24 Tháng' }
  },
  {
    id: 'comp_case_montech_sky_two',
    name: 'Vỏ Case Montech Sky Two Black (Kèm Sẵn 4 Quạt ARGB PWM)',
    category: 'cat_case',
    price: 1990000,
    originalPrice: 2250000,
    stockQuantity: 28,
    rating: 4.8,
    reviewsCount: 63,
    badge: 'Kèm 4 Fan',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Thiết kế bể cá hiện đại, tặng kèm sẵn 4 quạt ARGB cánh ngược cực mát.',
    specs: { brand: 'Montech', formFactor: 'ATX', glass: 'Bể cá kính cong', fansIncluded: '4x ARGB', warranty: '12 Tháng' }
  },
  {
    id: 'comp_case_xigmatek_aqua_m',
    name: 'Vỏ Case Xigmatek Aqua M Lite 3GF (Kèm Sẵn 3 Quạt RGB)',
    category: 'cat_case',
    price: 890000,
    originalPrice: 1090000,
    stockQuantity: 40,
    rating: 4.7,
    reviewsCount: 92,
    badge: 'Ngon Bổ Rẻ',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=400&q=80',
    description: 'Mẫu case bể cá M-ATX nhỏ gọn đáng mua nhất phân khúc dưới 1 triệu.',
    specs: { brand: 'Xigmatek', formFactor: 'Micro-ATX', glass: 'Kính 2 mặt', fansIncluded: '3x RGB', warranty: '12 Tháng' }
  },

  // 9. MÀN HÌNH (Monitor)
  {
    id: 'comp_mon_lg_27gr95qe',
    name: 'Màn Hình LG UltraGear 27GR95QE-B 27 inch 2K QHD OLED 240Hz 0.03ms',
    category: 'cat_monitors',
    price: 19900000,
    originalPrice: 22900000,
    stockQuantity: 10,
    rating: 5.0,
    reviewsCount: 25,
    badge: 'OLED 240Hz',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    description: 'Tấm nền OLED chân thực tương phản vô cực và tần số quét 240Hz chuẩn Esports.',
    specs: { brand: 'LG', size: '27 inch', resolution: '2K QHD (2560x1440)', panel: 'OLED', refreshRate: '240Hz', warranty: '24 Tháng' }
  },
  {
    id: 'comp_mon_samsung_g5_27',
    name: 'Màn Hình Gaming Samsung Odyssey G5 G50D 27 inch 2K QHD IPS 180Hz 1ms',
    category: 'cat_monitors',
    price: 5490000,
    originalPrice: 6200000,
    stockQuantity: 25,
    rating: 4.9,
    reviewsCount: 73,
    badge: 'Bán chạy',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    description: 'Màn hình IPS phẳng độ phân giải 2K sắc nét, hỗ trợ chân đế nâng hạ xoay dọc.',
    specs: { brand: 'Samsung', size: '27 inch', resolution: '2K QHD (2560x1440)', panel: 'IPS', refreshRate: '180Hz', warranty: '24 Tháng' }
  },
  {
    id: 'comp_mon_viewsonic_2758',
    name: 'Màn Hình ViewSonic VX2758A-2K-PRO 27 inch 2K IPS 170Hz 1ms',
    category: 'cat_monitors',
    price: 4490000,
    originalPrice: 4990000,
    stockQuantity: 30,
    rating: 4.8,
    reviewsCount: 52,
    badge: 'Quốc dân 2K',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    description: 'Độ chuẩn màu 100% sRGB phù hợp cả chơi game lẫn chỉnh sửa ảnh chuyên nghiệp.',
    specs: { brand: 'ViewSonic', size: '27 inch', resolution: '2K QHD (2560x1440)', panel: 'Fast IPS', refreshRate: '170Hz', warranty: '36 Tháng' }
  },
  {
    id: 'comp_mon_aoc_24g2sp',
    name: 'Màn Hình AOC 24G2SP 23.8 inch Full HD IPS 165Hz 1ms',
    category: 'cat_monitors',
    price: 3190000,
    originalPrice: 3600000,
    stockQuantity: 50,
    rating: 4.8,
    reviewsCount: 115,
    badge: 'Vua phân khúc',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
    description: 'Màn hình Gaming 165Hz quốc dân cho sinh viên và game thủ FPS.',
    specs: { brand: 'AOC', size: '23.8 inch', resolution: 'Full HD (1920x1080)', panel: 'IPS', refreshRate: '165Hz', warranty: '36 Tháng' }
  }
];

async function seedData() {
  console.log('🔄 Bắt đầu nạp dữ liệu danh mục & linh kiện máy tính...');

  // 1. Cập nhật vào db.json
  const rawDb = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawDb);

  // Đảm bảo categories có đủ 9 nhóm linh kiện
  if (!db.categories) db.categories = [];
  NEW_CATEGORIES.forEach(newCat => {
    const idx = db.categories.findIndex(c => c.id === newCat.id);
    if (idx >= 0) {
      db.categories[idx] = { ...db.categories[idx], ...newCat };
    } else {
      db.categories.push(newCat);
    }
  });

  // Đảm bảo products có đủ các linh kiện
  if (!db.products) db.products = [];
  COMPONENT_PRODUCTS.forEach(comp => {
    const idx = db.products.findIndex(p => p.id === comp.id);
    if (idx >= 0) {
      db.products[idx] = { ...db.products[idx], ...comp };
    } else {
      db.products.push(comp);
    }
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  console.log(`✅ Đã nạp thành công ${NEW_CATEGORIES.length} danh mục và ${COMPONENT_PRODUCTS.length} linh kiện vào db.json.`);

  // 2. Đồng bộ sang PostgreSQL nếu kết nối được
  if (dbModule.getIsPostgresConnected()) {
    try {
      console.log('🔄 Đang đồng bộ linh kiện vào PostgreSQL...');
      for (const cat of NEW_CATEGORIES) {
        await dbModule.query(
          `INSERT INTO categories (id, name, slug, description)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, slug = EXCLUDED.slug`,
          [cat.id, cat.name, cat.slug, cat.name]
        );
      }

      for (const p of COMPONENT_PRODUCTS) {
        await dbModule.query(
          `INSERT INTO products (id, name, category_id, price, original_price, stock_quantity, rating, reviews_count, badge, image_url, description, specs_json)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           ON CONFLICT (id) DO UPDATE SET 
             name = EXCLUDED.name,
             category_id = EXCLUDED.category_id,
             price = EXCLUDED.price,
             original_price = EXCLUDED.original_price,
             stock_quantity = EXCLUDED.stock_quantity,
             specs_json = EXCLUDED.specs_json,
             image_url = EXCLUDED.image_url`,
          [
            p.id,
            p.name,
            p.category,
            p.price,
            p.originalPrice,
            p.stockQuantity,
            p.rating,
            p.reviewsCount,
            p.badge,
            p.image,
            p.description,
            JSON.stringify(p.specs)
          ]
        );
      }
      console.log('✅ Đã đồng bộ thành công sang PostgreSQL!');
    } catch (pgErr) {
      console.warn('⚠️ Lỗi khi đồng bộ vào PostgreSQL (bỏ qua nếu dùng JSON fallback):', pgErr.message);
    }
  }

  process.exit(0);
}

seedData().catch(err => {
  console.error('❌ Lỗi khi nạp dữ liệu:', err);
  process.exit(1);
});
