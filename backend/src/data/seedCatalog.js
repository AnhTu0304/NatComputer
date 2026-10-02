/**
 * NAT COMPUTER COMPREHENSIVE SEED CATALOG (47 Real Products across 14 Categories)
 * Year: 2026 Edition
 * Features: Complete specifications, dual gallery images, market prices, and category mappings.
 */

const seedProducts = [
  // =========================================================================
  // 1. PC GAMING CAO CẤP (category: 'gaming') - 5 sản phẩm
  // =========================================================================
  {
    id: 'pc-gaming-ultra-4070ti',
    name: 'NAT GAMING BEAST 4070 Ti SUPER',
    category: 'gaming',
    price: 45900000,
    originalPrice: 49900000,
    rating: 4.9,
    badge: 'HOT SELLER',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
    description: 'Chiến mượt 100% các tựa game eSports & AAA 2K/4K max settings như Black Myth Wukong, Cyberpunk 2077, GTA V, Valorant.',
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D (8C/16T, Up to 5.0GHz)',
      gpu: 'NVIDIA GeForce RTX 4070 Ti SUPER 16GB GDDR6X',
      ram: '32GB DDR5 6000MHz RGB Corsair Vengeance',
      ssd: '1TB NVMe PCIe 4.0 (Tốc độ đọc 7000MB/s)',
      mainboard: 'MSI MAG B650 TOMAHAWK WIFI',
      psu: 'Corsair RM850e 850W 80 Plus Gold ATX 3.0',
      cooler: 'Thermalright Frozen Prism 360 ARGB Liquid',
      case_name: 'NZXT H9 Flow Dual Chamber Black',
      warranty: '36 Tháng Chính Hãng 1 Đổi 1',
      gallery: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80'
      ]
    }
  },
  {
    id: 'deal-ultra-7-5070',
    name: 'PC TTG GAMING LUXURY ULTRA 7 270K PLUS - RTX 5070',
    category: 'gaming',
    price: 67980000,
    originalPrice: 69900000,
    rating: 4.95,
    badge: 'DEAL HOT',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    description: 'Cấu hình đỉnh cao trang bị Intel Core Ultra 7 kết hợp RTX 5070 thế hệ mới nhất, mang lại hiệu năng đồ họa đột phá.',
    specs: {
      cpu: 'Intel Core Ultra 7 270K (20 Nhân, Up to 5.5GHz)',
      gpu: 'NVIDIA GeForce RTX 5070 12GB GDDR7 Next-Gen',
      ram: '32GB DDR5 6400MHz G.Skill Trident Z5 RGB',
      ssd: '1TB Samsung 990 PRO NVMe Gen4 (7450MB/s)',
      mainboard: 'MSI Z890 GAMING PLUS WIFI DDR5',
      psu: 'Corsair RM850x Shift 850W 80 Plus Gold',
      cooler: 'Deepcool LT720 360mm High-Performance AIO',
      case_name: 'Lian Li O11 Vision Chrome Panoramic',
      warranty: '36 Tháng Chính Hãng',
      gallery: [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
        'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-gaming-i5-4060',
    name: 'NAT GAMING ESPORTS I5 13400F / RTX 4060',
    category: 'gaming',
    price: 21990000,
    originalPrice: 24500000,
    rating: 4.85,
    badge: 'BEST VALUE',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    description: 'Cấu hình quốc dân chiến mượt mọi game Online Liên Minh, CS2, FO4, Valorant và GTA V mức thiết lập cao.',
    specs: {
      cpu: 'Intel Core i5-13400F (10 Nhân 16 Luồng, Up to 4.6GHz)',
      gpu: 'ASUS Dual GeForce RTX 4060 OC Edition 8GB GDDR6',
      ram: '16GB (2x8GB) DDR4 3200MHz Kingston Fury Beast',
      ssd: '512GB Kingston NV2 NVMe PCIe 4.0',
      mainboard: 'ASUS PRIME B760M-K DDR4',
      psu: 'Mik C650B 650W 80 Plus Bronze',
      cooler: 'Thermalright Assassin X 120 Refined SE ARGB',
      case_name: 'Xigmatek Aqua Ultra M-ATX 3 Fan ARGB',
      warranty: '36 Tháng Tận Nơi',
      gallery: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-gaming-i9-4090-liquid',
    name: 'NAT TITAN GAMING I9 14900KS / RTX 4090 24GB LIQUID',
    category: 'gaming',
    price: 115000000,
    originalPrice: 125000000,
    rating: 5.0,
    badge: 'ULTIMATE FLAGSHIP',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
    description: 'Cỗ máy chơi game mạnh nhất hành tinh với tản nhiệt nước Custom cao cấp, quái vật RTX 4090 24GB cân mọi game 4K 144Hz Ray Tracing.',
    specs: {
      cpu: 'Intel Core i9-14900KS Special Edition 6.2GHz',
      gpu: 'ASUS ROG Matrix Platinum GeForce RTX 4090 24GB',
      ram: '64GB (2x32GB) DDR5 7200MHz G.Skill Trident Z5 RGB',
      ssd: '2TB Samsung 990 PRO NVMe Gen4 (7450MB/s)',
      mainboard: 'ASUS ROG MAXIMUS Z790 HERO',
      psu: 'Seasonic Prime TX-1300 1300W Titanium ATX 3.0',
      cooler: 'EKWB Custom Water Cooling Hard-Tube Loop',
      case_name: 'Lian Li V3000 Plus Super Tower',
      warranty: '36 Tháng VIP 1 Đổi 1 Tại Nhà',
      gallery: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-gaming-r5-4060ti',
    name: 'NAT CYBER GAMING RYZEN 5 7600 / RTX 4060 Ti 8GB',
    category: 'gaming',
    price: 26500000,
    originalPrice: 28900000,
    rating: 4.86,
    badge: 'POPULAR CHOICE',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
    description: 'Nền tảng AM5 DDR5 thời thượng, card RTX 4060 Ti hỗ trợ DLSS 3 Frame Generation chiến mượt game AAA 2K sắc nét.',
    specs: {
      cpu: 'AMD Ryzen 5 7600 (6 Nhân 12 Luồng, Up to 5.1GHz)',
      gpu: 'Gigabyte GeForce RTX 4060 Ti EAGLE OC 8GB',
      ram: '32GB (2x16GB) DDR5 5600MHz Kingston Fury',
      ssd: '1TB Kioxia Exceria Plus G3 NVMe Gen4',
      mainboard: 'Gigabyte B650M GAMING PLUS WIFI',
      psu: 'Deepcool PK750D 750W 80 Plus Bronze',
      cooler: 'ID-Cooling SE-207-XT Black Dual Tower',
      case_name: 'Montech Air 100 ARGB Black',
      warranty: '36 Tháng Chính Hãng',
      gallery: [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 2. PC AMD GAMING V-CACHE (category: 'pc-amd') - 3 sản phẩm
  // =========================================================================
  {
    id: 'deal-ryzen-7-9800x3d',
    name: 'PC TTG AMD GAMING LUXURY RYZEN 7 9800X3D',
    category: 'pc-amd',
    price: 72500000,
    originalPrice: 75900000,
    rating: 4.96,
    badge: 'AMD BEST GAMING',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
    description: 'Vua chơi game thế hệ mới Ryzen 7 9800X3D với công nghệ 2nd Gen 3D V-Cache mở khóa hệ số nhân hoàn toàn, FPS cực đại không đối thủ.',
    specs: {
      cpu: 'AMD Ryzen 7 9800X3D (8C/16T, 104MB Cache, 5.2GHz)',
      gpu: 'Sapphire Nitro+ AMD Radeon RX 7900 XTX Vapor-X 24GB',
      ram: '32GB (2x16GB) DDR5 6000MHz CL30 G.Skill Flare X5',
      ssd: '2TB WD Black SN850X NVMe PCIe Gen4 (7300MB/s)',
      mainboard: 'ASUS ROG STRIX X670E-F GAMING WIFI',
      psu: 'MSI MAG A1000G PCIE5 1000W 80 Plus Gold',
      cooler: 'NZXT Kraken Elite 360 RGB LCD Display',
      case_name: 'Phanteks NV5 Black ARGB Panoramic',
      warranty: '36 Tháng Toàn Bộ Linh Kiện',
      gallery: [
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-amd-phoenix-7500f',
    name: 'NAT AMD PHOENIX RYZEN 5 7500F / RX 6700 XT 12GB',
    category: 'pc-amd',
    price: 19890000,
    originalPrice: 22000000,
    rating: 4.8,
    badge: 'BUDGET CHAMPION',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    description: 'Bộ đôi AM5 hiệu năng giá rẻ xuất sắc với 12GB VRAM thoải mái kéo texture game nặng ở độ phân giải Full HD / 2K mượt mà.',
    specs: {
      cpu: 'AMD Ryzen 5 7500F (6 Nhân 12 Luồng, 5.0GHz)',
      gpu: 'AMD Radeon RX 6700 XT 12GB GDDR6 (Tri-Fan)',
      ram: '16GB (2x8GB) DDR5 5200MHz Lexar Ares',
      ssd: '512GB Kingston NV2 NVMe M.2 2280',
      mainboard: 'ASRock B650M-HDV/M.2 DDR5',
      psu: 'FSP HV PRO 650W 80 Plus Bronze',
      cooler: 'Thermalright Peerless Assassin 120 SE',
      case_name: 'Xigmatek Endorphin M ARGB Black',
      warranty: '36 Tháng Chính Hãng',
      gallery: [
        'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-amd-threadripper-7995wx',
    name: 'NAT AMD THREADRIPPER PRO 7995WX EXTREME 96 CORES',
    category: 'pc-amd',
    price: 210000000,
    originalPrice: 225000000,
    rating: 5.0,
    badge: 'MONSTER POWER',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
    description: 'Siêu máy trạm 96 nhân 192 luồng AMD Threadripper PRO 7995WX, xử lý render phim trường Hollywood, mô phỏng khí động học và biên dịch code cực lớn.',
    specs: {
      cpu: 'AMD Ryzen Threadripper PRO 7995WX (96 Nhân 192 Luồng)',
      gpu: 'Dual NVIDIA RTX 4090 24GB NVLink Ready (48GB VRAM)',
      ram: '256GB (8x32GB) DDR5 4800MHz ECC Registered 8-Channel',
      ssd: '4TB (2x2TB) Samsung 990 PRO RAID 0 (14000MB/s)',
      mainboard: 'ASUS Pro WS WRX90E-SAGE SE (sTR5)',
      psu: 'Super Flower Leadex Titanium 2000W',
      cooler: 'SilverStone IceMyst 420 TR5 AIO Liquid Cooler',
      case_name: 'Thermaltake Core W200 Super Tower',
      warranty: '36 Tháng Tận Nơi 24/7',
      gallery: [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 3. PC WORKSTATION ĐỒ HỌA 3D / RENDER (category: 'workstation') - 4 sản phẩm
  // =========================================================================
  {
    id: 'ws-pro-i9-14900k-4080s',
    name: 'NAT WORKSTATION PRO I9 14900K / 64GB DDR5 / RTX 4080 SUPER 16GB',
    category: 'workstation',
    price: 69900000,
    originalPrice: 74900000,
    rating: 4.94,
    badge: 'PRO 3D RENDER',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
    description: 'Chuyên dụng dựng hình 3DsMax, Maya, Blender, Render Vray, Corona, Lumion và dựng phim 4K/8K Premiere, After Effects mượt mà.',
    specs: {
      cpu: 'Intel Core i9-14900K (24 Nhân 32 Luồng, Up to 6.0GHz)',
      gpu: 'PNY GeForce RTX 4080 SUPER 16GB XLR8 Gaming VERTO',
      ram: '64GB (2x32GB) DDR5 6000MHz Kingston Fury Beast Black',
      ssd: '2TB Kingston KC3000 PCIe 4.0 NVMe (7000MB/s)',
      mainboard: 'ASUS ProArt Z790-CREATOR WIFI',
      psu: 'Super Flower Leadex VII Gold 1000W ATX 3.0',
      cooler: 'Deepcool LT720 360mm High-Performance AIO',
      case_name: 'Fractal Design Meshify 2 XL Black Solid',
      warranty: '36 Tháng 1 Đổi 1',
      gallery: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80'
      ]
    }
  },
  {
    id: 'ws-dual-xeon-a5000',
    name: 'NAT DUAL XEON PLATINUM 8280 / 128GB ECC / RTX A5000 24GB',
    category: 'workstation',
    price: 89000000,
    originalPrice: 96000000,
    rating: 4.97,
    badge: 'SERVER CLASS',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    description: 'Máy trạm 2 CPU Xeon Platinum tổng 56 nhân 112 luồng, RAM ECC sửa lỗi tự động, card đồ họa chuyên nghiệp NVIDIA RTX A5000 bền bỉ 24/7.',
    specs: {
      cpu: 'Dual Intel Xeon Platinum 8280 (56 Nhân 112 Luồng, 77MB Cache)',
      gpu: 'Leadtek NVIDIA RTX A5000 24GB GDDR6 ECC',
      ram: '128GB (4x32GB) DDR4 2933MHz ECC Registered',
      ssd: '2TB Samsung PM9A1 NVMe PCIe Gen4 (OEM 980 Pro)',
      mainboard: 'Supermicro X11DAi-N Dual Socket LGA3647',
      psu: 'Corsair HX1200 1200W 80 Plus Platinum',
      cooler: 'Dual Noctua NH-U14S DX-3647 Silent Coolers',
      case_name: 'Phanteks Enthoo Pro 2 Server Edition',
      warranty: '36 Tháng Bảo Hành Vàng',
      gallery: [
        'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80'
      ]
    }
  },
  {
    id: 'ws-architecture-r9-7950x',
    name: 'NAT ARCHITECTURE RYZEN 9 7950X / 64GB / RTX 4070 Ti SUPER',
    category: 'workstation',
    price: 52900000,
    originalPrice: 56500000,
    rating: 4.91,
    badge: 'ARCHITECTURE PRO',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
    description: 'Tối ưu cho kiến trúc sư và kỹ sư xây dựng chạy Revit, AutoCAD, Sketchup, D5 Render và Enscape thời gian thực cực nhanh.',
    specs: {
      cpu: 'AMD Ryzen 9 7950X (16 Nhân 32 Luồng, Up to 5.7GHz)',
      gpu: 'MSI GeForce RTX 4070 Ti SUPER 16GB VENTUS 3X',
      ram: '64GB (2x32GB) DDR5 6000MHz Corsair Vengeance',
      ssd: '1TB Samsung 980 PRO NVMe PCIe 4.0',
      mainboard: 'MSI MAG X670E TOMAHAWK WIFI',
      psu: 'Seasonic Focus GX-850 850W Gold',
      cooler: 'Thermalright Frozen Horizon 360 Black',
      case_name: 'Antec P20C High-Airflow Mid-Tower',
      warranty: '36 Tháng Tận Nơi',
      gallery: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80'
      ]
    }
  },
  {
    id: 'ws-studio-creator-i7-14700k',
    name: 'NAT STUDIO CREATOR I7 14700K / 32GB / RTX 4070 12GB',
    category: 'workstation',
    price: 38500000,
    originalPrice: 41900000,
    rating: 4.88,
    badge: 'CONTENT CREATOR',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    description: 'Lựa chọn số 1 cho các Studio sáng tạo nội dung YouTube, TikTok, chỉnh sửa ảnh Photoshop, Lightroom và dựng video CapCut/Premiere 4K.',
    specs: {
      cpu: 'Intel Core i7-14700K (20 Nhân 28 Luồng, Up to 5.6GHz)',
      gpu: 'Gigabyte GeForce RTX 4070 WINDFORCE OC 12GB',
      ram: '32GB (2x16GB) DDR5 5600MHz Kingston Fury',
      ssd: '1TB Kioxia Exceria Plus G3 NVMe Gen4',
      mainboard: 'ASUS TUF GAMING B760-PLUS WIFI DDR5',
      psu: 'Corsair CX750M 750W 80 Plus Bronze',
      cooler: 'Thermalright Frost Commander 140 Dual Tower',
      case_name: 'Montech Air 903 MAX White',
      warranty: '36 Tháng Toàn Diện',
      gallery: [
        'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 4. PC VĂN PHÒNG & DOANH NGHIỆP (category: 'office') - 3 sản phẩm
  // =========================================================================
  {
    id: 'pc-office-pro-i5-12400',
    name: 'NAT OFFICE PRO I5 12400 / 16GB RAM / 512GB NVMe / 550W',
    category: 'office',
    price: 9490000,
    originalPrice: 10900000,
    rating: 4.85,
    badge: 'BEST FOR WORK',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    description: 'Máy tính đồng bộ văn phòng cao cấp, xử lý mượt mà hàng trăm tab Chrome, Excel kế toán bảng tính nặng và phần mềm ERP quản lý kho.',
    specs: {
      cpu: 'Intel Core i5-12400 (6 Nhân 12 Luồng, Up to 4.4GHz, Đồ họa UHD 730)',
      gpu: 'Intel UHD Graphics 730 Tích Hợp (Hỗ trợ 3 Màn Hình 4K)',
      ram: '16GB DDR4 3200MHz Kingston Fury Black',
      ssd: '512GB Kingston NV2 NVMe M.2 2280',
      mainboard: 'ASUS PRIME H610M-K D4 Bền Bỉ',
      psu: 'Antec Atom V550 550W Công Suất Thực',
      cooler: 'Intel Stock Cooler Êm Ái',
      case_name: 'Xigmatek XAS-20 Văn Phòng Lịch Sự',
      warranty: '24 Tháng 1 Đổi 1 Tại Chỗ',
      gallery: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-office-slim-i3-12100',
    name: 'NAT OFFICE SLIM I3 12100 / 8GB RAM / 256GB SSD Siêu Bền',
    category: 'office',
    price: 6890000,
    originalPrice: 7990000,
    rating: 4.8,
    badge: 'TIẾT KIỆM ĐIỆN',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    description: 'Giải pháp kinh tế cho trường học, bệnh viện, cơ quan hành chính và nhân viên văn phòng nhập liệu với độ ổn định 10 năm không hỏng vặt.',
    specs: {
      cpu: 'Intel Core i3-12100 (4 Nhân 8 Luồng, Up to 4.3GHz)',
      gpu: 'Intel UHD Graphics 730',
      ram: '8GB DDR4 3200MHz Crucial Micron',
      ssd: '256GB SSD Lexar NS100 Sata 3 (550MB/s)',
      mainboard: 'MSI PRO H610M-E DDR4',
      psu: 'Aigo VK450 450W Ổn Định',
      cooler: 'Intel Box Original',
      case_name: 'Vỏ Case Văn Phòng Nhỏ Gọn Siêu Bền',
      warranty: '24 Tháng Chính Hãng',
      gallery: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-office-enterprise-i7-13700',
    name: 'NAT ENTERPRISE CORE I7 13700 / 32GB / 1TB NVMe Gen4',
    category: 'office',
    price: 17900000,
    originalPrice: 19900000,
    rating: 4.92,
    badge: 'DOANH NGHIỆP',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80',
    description: 'Cỗ máy văn phòng cấp quản lý, giám đốc và phòng tài chính chứng khoán, xử lý dữ liệu Big Data, Macro VBA siêu tốc độ.',
    specs: {
      cpu: 'Intel Core i7-13700 (16 Nhân 24 Luồng, Up to 5.2GHz)',
      gpu: 'Intel UHD Graphics 770 Cao Cấp',
      ram: '32GB (2x16GB) DDR4 3200MHz Corsair Vengeance LPX',
      ssd: '1TB Samsung 980 NVMe PCIe 3.0 (3500MB/s)',
      mainboard: 'ASUS PRIME B760M-A WIFI DDR4',
      psu: 'Cooler Master Elite V4 600W 80 Plus',
      cooler: 'Thermalright Assassin King 120 SE White',
      case_name: 'Cooler Master Silencio S400 Cách Âm Tuyệt Đối',
      warranty: '36 Tháng Bảo Hành Doanh Nghiệp',
      gallery: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 5. PC MINI NHỎ GỌN ITX (category: 'pc-mini') - 3 sản phẩm
  // =========================================================================
  {
    id: 'pc-mini-itx-gaming-7800x3d',
    name: 'NAT MINI ITX GAMING RYZEN 7 7800X3D / RTX 4070 DUAL',
    category: 'pc-mini',
    price: 41500000,
    originalPrice: 45000000,
    rating: 4.93,
    badge: 'ITX TINH TẾ',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80',
    description: 'Cỗ máy chơi game mạnh mẽ nằm gọn trong thể tích chỉ 11 Lít, xách tay đi du lịch hoặc đặt gọn gàng cạnh TV phòng khách.',
    specs: {
      cpu: 'AMD Ryzen 7 7800X3D (8 Nhân 16 Luồng, 3D V-Cache)',
      gpu: 'ASUS Dual GeForce RTX 4070 EVO OC 12GB GDDR6X',
      ram: '32GB (2x16GB) DDR5 6000MHz Corsair Vengeance ITX',
      ssd: '1TB Samsung 990 PRO NVMe Gen4',
      mainboard: 'ASUS ROG STRIX B650E-I GAMING WIFI Mini-ITX',
      psu: 'Corsair SF750 750W 80 Plus Platinum SFX Nhỏ Gọn',
      cooler: 'Thermalright AXP90-X47 Full Copper Low Profile',
      case_name: 'FormD T1 V2.1 Nhôm Anode Đen Cao Cấp (9.95L)',
      warranty: '36 Tháng Tận Tâm',
      gallery: [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-mini-cube-i5-14400-4060',
    name: 'NAT MINI CUBE I5 14400 / RTX 4060 ITX VỎ NHÔM PHAY',
    category: 'pc-mini',
    price: 23900000,
    originalPrice: 25900000,
    rating: 4.87,
    badge: 'NHỎ GỌN ĐẸP',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    description: 'Thiết kế dạng hộp Cube nhôm CNC tinh xảo, hiệu năng cân mượt mọi game và đồ họa với kích thước chỉ bằng chiếc hộp giày.',
    specs: {
      cpu: 'Intel Core i5-14400 (10 Nhân 16 Luồng, Up to 4.7GHz)',
      gpu: 'Gigabyte GeForce RTX 4060 D6 8GB Mini-ITX',
      ram: '16GB DDR5 5600MHz Kingston Fury Beast',
      ssd: '512GB Kingston KC3000 PCIe 4.0 NVMe',
      mainboard: 'MSI MPG B760I EDGE WIFI DDR5',
      psu: 'FSP Dagger Pro 650W SFX Gold',
      cooler: 'Noctua NH-L9i-17xx Siêu Êm Ái',
      case_name: 'Jonsbo T8 Plus Nhôm Kính Cường Lực Có Quai Xách',
      warranty: '36 Tháng Chính Hãng',
      gallery: [
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-mini-nuc-8845hs',
    name: 'NAT NUC MINI DESKTOP RYZEN 7 8845HS / RADEON 780M',
    category: 'pc-mini',
    price: 13500000,
    originalPrice: 15000000,
    rating: 4.89,
    badge: 'SIÊU NHỎ BỎ TÚI',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    description: 'Kích thước siêu nhỏ chỉ 13x13cm nhưng trang bị CPU Ryzen AI 8000 Series 8 nhân 16 luồng, đồ họa Radeon 780M chiến mượt eSports.',
    specs: {
      cpu: 'AMD Ryzen 7 8845HS (8C/16T, 5.1GHz, NPU 38 TOPS AI)',
      gpu: 'AMD Radeon 780M RDNA 3 Integrated Graphics',
      ram: '32GB DDR5 5600MHz Dual Channel SODIMM',
      ssd: '1TB M.2 2280 NVMe PCIe 4.0',
      mainboard: 'Custom Mini PC Motherboard (WiFi 6E + BT 5.3 + Dual 2.5G LAN)',
      psu: 'Adapter 120W Type-C Power Delivery',
      cooler: 'Tản nhiệt buồng hơi Vapor Chamber + Quạt Turbo',
      case_name: 'Vỏ Hợp Kim Nhôm Cắt CNC Liền Khối 0.8L',
      warranty: '24 Tháng Đổi Mới',
      gallery: [
        'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 6. PC AI - TRÍ TUỆ NHÂN TẠO (category: 'ai') - 3 sản phẩm
  // =========================================================================
  {
    id: 'pc-ai-deep-learning-3x4090',
    name: 'NAT AI DEEP LEARNING TRIPLE RTX 4090 72GB VRAM / XEON W9',
    category: 'ai',
    price: 280000000,
    originalPrice: 299000000,
    rating: 5.0,
    badge: 'AI SUPERCOMPUTER',
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80',
    description: 'Trạm huấn luyện mô hình ngôn ngữ lớn LLM (Llama 3, Mistral), Stable Diffusion XL và Deep Learning chuyên sâu với 72GB VRAM tốc độ cao.',
    specs: {
      cpu: 'Intel Xeon w9-3495X (56 Nhân 112 Luồng, 105MB Cache)',
      gpu: '3x NVIDIA GeForce RTX 4090 24GB Blower Edition (Tổng 72GB VRAM)',
      ram: '256GB (8x32GB) DDR5 4800MHz ECC Registered RDIMM',
      ssd: '4TB (2x2TB) Samsung 990 PRO NVMe Gen4 RAID',
      mainboard: 'ASUS Pro WS W790E-SAGE SE',
      psu: 'Dual Corsair AX1600i Titanium (Tổng 3200W)',
      cooler: 'Custom Water Loop 3 Két Nước 480mm Đồng Nguyên Khối',
      case_name: 'Mountain Jade Super AI Server Chassis',
      warranty: '36 Tháng Hỗ Trợ Kỹ Thuật AI 24/7',
      gallery: [
        'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-ai-dual-4080s-9950x',
    name: 'NAT AI WORKSTATION RYZEN 9 9950X / DUAL RTX 4080 SUPER 32GB VRAM',
    category: 'ai',
    price: 128000000,
    originalPrice: 135000000,
    rating: 4.98,
    badge: 'AI RESEARCHER',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    description: 'Tối ưu cho doanh nghiệp và viện nghiên cứu Fine-tune mô hình AI, chạy inference tự động hóa và xử lý thị giác máy tính Computer Vision.',
    specs: {
      cpu: 'AMD Ryzen 9 9950X (16 Nhân 32 Luồng, Kiến trúc Zen 5, Up to 5.7GHz)',
      gpu: 'Dual ASUS TUF Gaming RTX 4080 SUPER 16GB (Tổng 32GB VRAM)',
      ram: '128GB (4x32GB) DDR5 6000MHz Kingston Fury Beast',
      ssd: '2TB Samsung 990 PRO NVMe PCIe 4.0',
      mainboard: 'ASUS ProArt X670E-CREATOR WIFI',
      psu: 'Corsair HX1500i 1500W 80 Plus Platinum',
      cooler: 'EKWB AIO Nucleus CR360 Dark',
      case_name: 'Fractal Design Torrent Black Solid Dual GPU',
      warranty: '36 Tháng Tận Nơi Toàn Quốc',
      gallery: [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-ai-developer-i9-14900k-4090',
    name: 'NAT AI DEVELOPER STUDIO I9 14900K / RTX 4090 24GB AI ACCEL',
    category: 'ai',
    price: 92000000,
    originalPrice: 98000000,
    rating: 4.96,
    badge: 'AI DEV CHOICE',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
    description: 'Trạm lập trình trí tuệ nhân tạo cá nhân, hỗ trợ PyTorch, TensorFlow, CUDA toolkit, chạy song song Docker container mượt mà.',
    specs: {
      cpu: 'Intel Core i9-14900K (24 Nhân 32 Luồng, 6.0GHz)',
      gpu: 'MSI GeForce RTX 4090 SUPRIM X 24GB GDDR6X',
      ram: '64GB (2x32GB) DDR5 6400MHz G.Skill Ripjaws S5',
      ssd: '2TB Kingston KC3000 PCIe 4.0 (7000MB/s)',
      mainboard: 'MSI MEG Z790 ACE DDR5',
      psu: 'MSI MEG Ai1300P PCIE5 1300W Platinum',
      cooler: 'Arctic Liquid Freezer III 360 A-RGB',
      case_name: 'Lian Li O11 Dynamic EVO XL Black',
      warranty: '36 Tháng Bảo Hành Siêu Tốc',
      gallery: [
        'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 7. PC GIẢ LẬP ẢO HÓA (category: 'virtualization') - 3 sản phẩm
  // =========================================================================
  {
    id: 'pc-virtualization-dual-xeon-2696v4',
    name: 'NAT DUAL XEON E5-2696v4 44 NHÂN 88 LUỒNG / 128GB ECC / GTX 1660 Ti',
    category: 'virtualization',
    price: 18500000,
    originalPrice: 21000000,
    rating: 4.88,
    badge: 'CHẠY 40 TAB NOX',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    description: 'Chuyên dụng cày game giả lập Android (NoxPlayer, LDPlayer) chạy 35-45 tab mượt mà, render đồ họa 24/7 cày coin, treo tool MMO bền bỉ.',
    specs: {
      cpu: 'Dual Intel Xeon E5-2696 v4 (44 Nhân 88 Luồng, 110MB Cache)',
      gpu: 'NVIDIA GeForce GTX 1660 Ti 6GB GDDR6 (Nhiều Cổng Xuất)',
      ram: '128GB (4x32GB) DDR4 ECC Registered Bus 2400',
      ssd: '512GB NVMe M.2 Tốc Độ Cao',
      mainboard: 'Huananzhi X99 Dual F8D Plus Bền Bỉ',
      psu: 'Sama 750W 80 Plus Gold Công Suất Thực',
      cooler: 'Dual Tản Khí 6 Ống Đồng Led RGB',
      case_name: 'Vỏ Case E-ATX Kính Cường Lực Kèm 6 Fan Led',
      warranty: '24 Tháng Toàn Bộ Linh Kiện',
      gallery: [
        'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-virtualization-dual-xeon-8176',
    name: 'NAT DUAL XEON PLATINUM 8176 56 NHÂN 112 LUỒNG / 256GB ECC / RTX 3060 12GB',
    category: 'virtualization',
    price: 34900000,
    originalPrice: 38000000,
    rating: 4.95,
    badge: 'CHẠY 70+ TAB NOX',
    image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80',
    description: 'Dàn máy cày MMO khủng nhất hiện nay, gánh mượt 60-80 cửa sổ giả lập mượt mà không giật lag, dung lượng 256GB RAM thoải mái đa nhiệm.',
    specs: {
      cpu: 'Dual Intel Xeon Platinum 8176 (56 Nhân 112 Luồng, 77MB Cache)',
      gpu: 'NVIDIA GeForce RTX 3060 12GB GDDR6 (12GB VRAM Cân Tab)',
      ram: '256GB (8x32GB) DDR4 ECC Registered Bus 2666',
      ssd: '1TB NVMe PCIe Gen4 Tốc Độ 5000MB/s',
      mainboard: 'Mainboard Dual LGA3647 Workstation Server',
      psu: 'Xigmatek Thor T1000 1000W 80 Plus Gold',
      cooler: 'Dual Tản Tháp Đôi 14cm 8 Ống Đồng Tản Siêu Mát',
      case_name: 'Server Case E-ATX Khí Động Học Cực Mát',
      warranty: '24 Tháng 1 Đổi 1',
      gallery: [
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80'
      ]
    }
  },
  {
    id: 'pc-virtualization-r9-7900-64gb',
    name: 'NAT MULTI-INSTANCE RYZEN 9 7900 / 64GB DDR5 / RTX 4060 8GB',
    category: 'virtualization',
    price: 28900000,
    originalPrice: 31500000,
    rating: 4.9,
    badge: 'CÔNG NGHỆ MỚI',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
    description: 'Sử dụng kiến trúc Zen 4 tiến trình 5nm tiết kiệm điện năng chỉ 65W, mát mẻ, chạy giả lập và máy ảo VMware/VirtualBox cực mượt 24/7.',
    specs: {
      cpu: 'AMD Ryzen 9 7900 (12 Nhân 24 Luồng, 5.4GHz, TDP 65W)',
      gpu: 'ASUS Dual GeForce RTX 4060 8GB GDDR6',
      ram: '64GB (2x32GB) DDR5 5600MHz Kingston Fury Beast',
      ssd: '1TB Kingston KC3000 Gen4 (7000MB/s)',
      mainboard: 'MSI PRO B650M-A WIFI DDR5',
      psu: 'MSI MAG A750GL 750W 80 Plus Gold',
      cooler: 'Thermalright Phantom Spirit 120 SE',
      case_name: 'Montech Air 903 Base Black',
      warranty: '36 Tháng Chính Hãng',
      gallery: [
        'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 8. FULL BỘ PC KÈM MÀN HÌNH (category: 'pc-combo') - 3 sản phẩm
  // =========================================================================
  {
    id: 'combo-gaming-i5-12400f-144hz',
    name: 'FULL BỘ PC GAMING I5 12400F + MÀN HÌNH 24" IPS 144Hz + PHÍM CHUỘT RGB',
    category: 'pc-combo',
    price: 16990000,
    originalPrice: 19500000,
    rating: 4.92,
    badge: 'TRỌN GÓI SIÊU HỜI',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    description: 'Trọn gói chỉ việc cắm điện là dùng! Gồm case PC I5 12400F / GTX 1660 Super, màn hình Gaming 24 inch 144Hz IPS và bộ phím chuột cơ RGB cực ngầu.',
    specs: {
      cpu: 'Intel Core i5-12400F (6C/12T, 4.4GHz)',
      gpu: 'NVIDIA GeForce GTX 1660 Super 6GB GDDR6',
      ram: '16GB DDR4 3200MHz RGB',
      ssd: '512GB NVMe M.2 Tốc Độ Cao',
      mainboard: 'ASUS H610M-K D4',
      monitors: 'Màn hình Gaming 24 Inch IPS 144Hz 1ms Chân Đế V',
      gear: 'Bàn phím cơ Blue Switch RGB + Chuột Gaming 7200 DPI + Lót chuột 80x30cm',
      warranty: '36 Tháng Case PC / 24 Tháng Màn Hình',
      gallery: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'
      ]
    }
  },
  {
    id: 'combo-office-i3-12100-22inch',
    name: 'FULL BỘ PC VĂN PHÒNG I3 12100 + MÀN HÌNH 22" BẢO VỆ MẮT + PHÍM CHUỘT',
    category: 'pc-combo',
    price: 8990000,
    originalPrice: 10500000,
    rating: 4.86,
    badge: 'TRỌN BỘ CÔNG SỞ',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
    description: 'Giải pháp hoàn hảo đồng bộ cho bàn làm việc, bảo vệ thị lực chống ánh sáng xanh, đi kèm bộ phím chuột văn phòng êm ái chống ồn.',
    specs: {
      cpu: 'Intel Core i3-12100 (4C/8T, 4.3GHz)',
      gpu: 'Intel UHD Graphics 730 Tích Hợp',
      ram: '8GB DDR4 3200MHz',
      ssd: '256GB SSD Siêu Tốc',
      mainboard: 'H610M Bền Bỉ',
      monitors: 'Màn hình 22 Inch FHD 75Hz Công nghệ chống nháy Flicker-Free',
      gear: 'Bộ bàn phím chuột Logitech Silent không dây chính hãng',
      warranty: '24 Tháng Bảo Hành Tận Nhà',
      gallery: [
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80'
      ]
    }
  },
  {
    id: 'combo-esports-pro-13400f-4060-2k',
    name: 'FULL BỘ ESPORTS PRO I5 13400F / RTX 4060 + MÀN HÌNH 27" 2K 180Hz G-SYNC',
    category: 'pc-combo',
    price: 29500000,
    originalPrice: 33500000,
    rating: 4.96,
    badge: 'COMBO GAME THỦ',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    description: 'Bộ máy hoàn chỉnh chuẩn tuyển thủ eSports, màn hình 27 inch 2K Fast-IPS 180Hz hiển thị siêu mượt mà không bóng mờ, chiến game đỉnh cao.',
    specs: {
      cpu: 'Intel Core i5-13400F (10 Nhân 16 Luồng)',
      gpu: 'NVIDIA GeForce RTX 4060 8GB GDDR6',
      ram: '32GB DDR4 3200MHz RGB',
      ssd: '1TB NVMe PCIe 4.0',
      mainboard: 'B760M Gaming Wifi',
      monitors: 'Màn hình Gaming 27 Inch 2K QHD Fast-IPS 180Hz G-Sync Compatible',
      gear: 'Bàn phím cơ DareU EK87 + Chuột DareU EM901X Không Dây Có Dock Sạc',
      warranty: '36 Tháng Trọn Gói',
      gallery: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80'
      ]
    }
  },

  // =========================================================================
  // 9. LINH KIỆN MÁY TÍNH (category: 'components') - 6 sản phẩm
  // =========================================================================
  {
    id: 'vga-asus-rog-strix-rtx-4090-24gb',
    name: 'Card Đồ Họa ASUS ROG Strix GeForce RTX 4090 24GB GDDR6X OC Edition',
    category: 'components',
    price: 54900000,
    originalPrice: 58900000,
    rating: 4.98,
    badge: 'ĐỈNH CAO VGA',
    image: 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?w=800&q=80',
    description: 'Vua của card đồ họa với khung tản nhiệt đúc nguyên khối, quạt Axial-tech thế hệ mới và phase nguồn siêu bền, chiến game 4K không đối thủ.',
    specs: {
      gpu: 'NVIDIA AD102 (16384 Nhân CUDA)',
      vram: '24GB GDDR6X 384-bit (1008 GB/s)',
      boost_clock: '2640 MHz (OC Mode)',
      power_connectors: '1x 16-pin 12VHPWR',
      recommended_psu: '1000W Hoặc Cao Hơn',
      warranty: '36 Tháng Chính Hãng ASUS'
    }
  },
  {
    id: 'cpu-amd-ryzen-7-7800x3d',
    name: 'Vi Xử Lý AMD Ryzen 7 7800X3D (8C/16T, Up to 5.0GHz, 104MB Cache)',
    category: 'components',
    price: 10490000,
    originalPrice: 11900000,
    rating: 4.97,
    badge: 'VUA CHƠI GAME',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&q=80',
    description: 'CPU chơi game được săn đón nhất thế giới nhờ công nghệ bộ nhớ đệm xếp chồng 3D V-Cache độc quyền, tối ưu FPS tối đa cho game thủ.',
    specs: {
      cpu: '8 Nhân 16 Luồng (Zen 4)',
      base_clock: '4.2 GHz / Boost 5.0 GHz',
      l3_cache: '96MB 3D V-Cache (Tổng 104MB Cache)',
      socket: 'AM5 (Hỗ trợ DDR5 + PCIe 5.0)',
      tdp: '120W',
      warranty: '36 Tháng Chính Hãng AMD'
    }
  },
  {
    id: 'mb-msi-mag-z790-tomahawk-wifi',
    name: 'Bo Mạch Chủ MSI MAG Z790 TOMAHAWK WIFI DDR5',
    category: 'components',
    price: 7890000,
    originalPrice: 8500000,
    rating: 4.9,
    badge: 'CHIP SET Z790',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=800&q=80',
    description: 'Nền tảng vững chắc cho CPU Intel Gen 13/14 với dàn VRM 16+1+1 phase 90A SPS, 4 khe M.2 PCIe 4.0 kèm tản nhiệt Shield Frozr cực mát.',
    specs: {
      chipset: 'Intel Z790 LGA1700',
      ram_support: '4x DDR5 Up to 7200+(OC) MHz, Max 192GB',
      storage: '4x M.2 PCIe 4.0 x4 + 7x SATA 6G',
      networking: 'Intel 2.5Gbps LAN + Wi-Fi 6E + Bluetooth 5.3',
      warranty: '36 Tháng Chính Hãng MSI'
    }
  },
  {
    id: 'ram-corsair-dominator-titanium-32gb',
    name: 'RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz Black',
    category: 'components',
    price: 4690000,
    originalPrice: 5200000,
    rating: 4.95,
    badge: 'RAM CAO CẤP',
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
    description: 'Đỉnh cao thiết kế RAM Corsair với nắp trên tháo rời tùy biến, chip nhớ tuyển chọn thủ công và công nghệ tản nhiệt DHX độc quyền.',
    specs: {
      capacity: '32GB (2 x 16GB)',
      speed: 'DDR5 6000MHz CL30-36-36-76',
      voltage: '1.40V (Hỗ trợ Intel XMP 3.0 & AMD EXPO)',
      rgb: '11 Đèn LED CAPELLIX Siêu Sáng Tùy Chỉnh iCUE',
      warranty: 'Trọn Đời (Lifetime Warranty)'
    }
  },
  {
    id: 'ssd-samsung-990-pro-2tb',
    name: 'Ổ Cứng SSD Samsung 990 PRO 2TB NVMe PCIe 4.0 (7450MB/s)',
    category: 'components',
    price: 4590000,
    originalPrice: 5100000,
    rating: 4.96,
    badge: 'TỐC ĐỘ ĐỈNH CAO',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80',
    description: 'Ông vua tốc độ SSD NVMe Gen4 với tốc độ đọc tuần tự lên đến 7450MB/s, kiểm soát nhiệt thông minh giúp vận hành mát mẻ và bền bỉ.',
    specs: {
      capacity: '2TB (2000GB)',
      read_speed: 'Up to 7,450 MB/s',
      write_speed: 'Up to 6,900 MB/s',
      controller: 'Samsung Pascal Controller',
      tbw: '1,200 TBW',
      warranty: '60 Tháng (5 Năm) Chính Hãng'
    }
  },
  {
    id: 'psu-corsair-rm1000x-shift',
    name: 'Nguồn Máy Tính Corsair RM1000x Shift 1000W 80 Plus Gold ATX 3.0',
    category: 'components',
    price: 5490000,
    originalPrice: 6200000,
    rating: 4.93,
    badge: 'ATX 3.0 MỚI',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80',
    description: 'Thiết kế cổng cắm bên hông cách mạng giúp đi dây siêu gọn gàng, chuẩn ATX 3.0 và PCIe 5.0 sẵn sàng cấp nguồn cho card RTX 4090.',
    specs: {
      power: '1000 Watts',
      efficiency: '80 Plus Gold (Lên đến 92%)',
      modularity: 'Full Modular (Cổng cắm bên sườn case)',
      fan: '140mm FDB Zero RPM Siêu Yên Tĩnh',
      warranty: '120 Tháng (10 Năm) Chính Hãng Corsair'
    }
  },

  // =========================================================================
  // 10. MÀN HÌNH MÁY TÍNH (category: 'monitors') - 4 sản phẩm
  // =========================================================================
  {
    id: 'mon-asus-rog-pg27aqdm',
    name: 'Màn Hình ASUS ROG Swift OLED PG27AQDM 27" 2K 240Hz 0.03ms G-Sync',
    category: 'monitors',
    price: 22900000,
    originalPrice: 25900000,
    rating: 4.96,
    badge: 'OLED ĐỈNH CAO',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    description: 'Tấm nền OLED cao cấp với màu đen sâu thẳm tuyệt đối, tần số quét 240Hz thời gian phản hồi siêu tốc 0.03ms loại bỏ hoàn toàn bóng mờ.',
    specs: {
      size: '26.5 Inch Tỷ lệ 16:9',
      panel: 'OLED Chống Chói Độc Quyền',
      resolution: '2K QHD (2560 x 1440)',
      refresh_rate: '240Hz / 0.03ms (GTG)',
      color_gamut: 'DCI-P3 99%, Delta E < 2',
      ports: '2x HDMI 2.0, 1x DisplayPort 1.4, USB Hub',
      warranty: '24 Tháng Chính Hãng ASUS (Bảo hành cả Burn-in)'
    }
  },
  {
    id: 'mon-dell-ultrasharp-u2724d',
    name: 'Màn Hình Đồ Họa Dell UltraSharp U2724D 27" 2K IPS Black 120Hz 100% sRGB',
    category: 'monitors',
    price: 11290000,
    originalPrice: 12500000,
    rating: 4.95,
    badge: 'CHUẨN MÀU ĐỒ HỌA',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
    description: 'Màn hình đồ họa chuyên nghiệp đầu tiên trang bị công nghệ IPS Black cho tỷ lệ tương phản 2000:1, tần số quét 120Hz mượt mà êm mắt.',
    specs: {
      size: '27 Inch Viền Siêu Mỏng InfinityEdge',
      panel: 'IPS Black Chống Chói',
      resolution: '2K QHD (2560 x 1440)',
      refresh_rate: '120Hz / 5ms',
      color_gamut: '100% sRGB, 98% Display P3, Tương Phản 2000:1',
      ports: 'DisplayPort 1.4, HDMI, USB-C 15W, Cảm biến ánh sáng tự động',
      warranty: '36 Tháng Đổi Mới Tận Nơi Của Dell'
    }
  },
  {
    id: 'mon-samsung-odyssey-g7-32inch',
    name: 'Màn Hình Gaming Cong Samsung Odyssey G7 32" 2K 240Hz 1000R HDR600',
    category: 'monitors',
    price: 14500000,
    originalPrice: 16900000,
    rating: 4.91,
    badge: 'CONG 1000R',
    image: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&q=80',
    description: 'Độ cong hoàn hảo 1000R bao trọn tầm nhìn mắt người, tần số quét 240Hz kết hợp tấm nền VA QLED chấm lượng tử màu sắc rực rỡ.',
    specs: {
      size: '31.5 Inch Cong 1000R Hoàn Hảo',
      panel: 'VA QLED Chấm Lượng Tử HDR600',
      resolution: '2K WQHD (2560 x 1440)',
      refresh_rate: '240Hz / 1ms (GTG)',
      sync: 'G-Sync Compatible & FreeSync Premium Pro',
      warranty: '24 Tháng Chính Hãng Samsung'
    }
  },
  {
    id: 'mon-viewsonic-vx2479-180hz',
    name: 'Màn Hình Gaming Quốc Dân ViewSonic VX2479-HD-PRO 24" FHD IPS 180Hz 1ms',
    category: 'monitors',
    price: 2890000,
    originalPrice: 3450000,
    rating: 4.88,
    badge: 'GIÁ RẺ VÔ ĐỊCH',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
    description: 'Mẫu màn hình eSports ngon bổ rẻ nhất phân khúc với tấm nền Fast IPS 180Hz sắc nét, không viền 3 cạnh phù hợp mọi góc máy tính.',
    specs: {
      size: '23.8 Inch Tỷ Lệ 16:9',
      panel: 'SuperClear Fast IPS',
      resolution: 'Full HD (1920 x 1080)',
      refresh_rate: '180Hz / 1ms MPRT',
      features: 'HDR10, FreeSync, Lọc Ánh Sáng Xanh Bảo Vệ Mắt',
      warranty: '36 Tháng 1 Đổi 1'
    }
  },

  // =========================================================================
  // 11. GAMING GEAR (category: 'gaming-gear') - 5 sản phẩm
  // =========================================================================
  {
    id: 'gear-kb-rog-azoth-75',
    name: 'Bàn Phím Cơ Không Dây ASUS ROG Azoth 75% OLED Gasket Mount Hot-Swap',
    category: 'gaming-gear',
    price: 5990000,
    originalPrice: 6800000,
    rating: 4.96,
    badge: 'CUSTOM BUILD',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80',
    description: 'Bàn phím cơ cao cấp tích hợp màn hình OLED 2 inch, đệm Gasket mount 3 lớp triệt tiêu âm thanh lạch cạch, switch ROG NX lube sẵn mượt mà.',
    specs: {
      layout: '75% Gasket Mount (81 Phím)',
      switch: 'ROG NX Snow Linear Switch (Đã lube krytox sẵn)',
      screen: 'Màn hình OLED 2 Inch Đa Năng Hiển Thị Thông Số',
      connectivity: 'SpeedNova 2.4GHz / Bluetooth 5.1 / Type-C',
      battery: 'Thời lượng pin lên đến 2000 giờ',
      warranty: '24 Tháng Chính Hãng ASUS'
    }
  },
  {
    id: 'gear-mouse-logitech-gpro-x-superlight2',
    name: 'Chuột Gaming Không Dây Logitech G Pro X Superlight 2 Wireless 60g 32K DPI',
    category: 'gaming-gear',
    price: 3490000,
    originalPrice: 3990000,
    rating: 4.97,
    badge: 'CHUỘT TUYỂN THỦ',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
    description: 'Vũ khí ưa chuộng của 80% tuyển thủ CS2 và Valorant thế giới, trọng lượng siêu nhẹ 60g, cảm biến HERO 2 và switch quang học lai LIGHTFORCE.',
    specs: {
      sensor: 'HERO 2 (100 - 32.000 DPI, 500+ IPS, 40G)',
      polling_rate: '4000Hz (Tốc độ báo cáo 0.25ms)',
      switches: 'LIGHTFORCE Hybrid Optical-Mechanical',
      weight: '60 grams Siêu Nhẹ',
      battery: 'Lên đến 95 giờ chơi liên tục',
      warranty: '24 Tháng Đổi Mới Toàn Quốc'
    }
  },
  {
    id: 'gear-headset-hyperx-cloud3-wireless',
    name: 'Tai Nghe Gaming Không Dây HyperX Cloud III Wireless Pin 120H DTS:X',
    category: 'gaming-gear',
    price: 3890000,
    originalPrice: 4400000,
    rating: 4.92,
    badge: 'PIN 120 GIỜ',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
    description: 'Huyền thoại tai nghe gaming tái sinh với thời lượng pin kỷ lục 120 giờ chỉ 1 lần sạc, đệm mút hoạt tính êm ái và âm thanh vòm DTS Headphone:X.',
    specs: {
      driver: 'Dynamic 53mm với nam châm Neodymium',
      spatial_audio: 'DTS Headphone:X Spatial Audio Vĩnh Viễn',
      microphone: 'Microphone 10mm Khử Ồn Có Đèn Báo Mute',
      connectivity: 'Wireless 2.4GHz Độ Trễ Siêu Thấp',
      battery: '120 Giờ Chơi Game',
      warranty: '24 Tháng Chính Hãng HyperX'
    }
  },
  {
    id: 'gear-controller-xbox-series-white',
    name: 'Tay Cầm Chơi Game Không Dây Microsoft Xbox Series X Robot White',
    category: 'gaming-gear',
    price: 1590000,
    originalPrice: 1850000,
    rating: 4.91,
    badge: 'TAY CẦM PC SỐ 1',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=800&q=80',
    description: 'Chuẩn tay cầm chơi game tốt nhất trên Windows PC, tương thích 100% game Steam, Epic, FO4, D-Pad cải tiến và cò rung haptic sống động.',
    specs: {
      connectivity: 'Xbox Wireless + Bluetooth + Cáp USB Type-C',
      compatibility: 'Windows 11/10, Xbox Series X/S, iOS, Android',
      features: 'Nút Share chuyên dụng, Bề mặt vân bám chống trơn trượt',
      warranty: '12 Tháng Chính Hãng Microsoft'
    }
  },
  {
    id: 'gear-stream-elgato-deck-mk2',
    name: 'Thiết Bị Stream Elgato Stream Deck MK.2 15 Phím LCD Tùy Biến',
    category: 'gaming-gear',
    price: 3690000,
    originalPrice: 4200000,
    rating: 4.94,
    badge: 'STREAM TOOL PRO',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
    description: 'Trợ thủ đắc lực của mọi Streamer và Content Creator với 15 phím LCD bấm chuyển cảnh OBS, mở app, chạy macro phím tắt chỉ với 1 chạm.',
    specs: {
      keys: '15 Phím Màn Hình LCD Màu Tùy Chỉnh Biểu Tượng',
      interface: 'USB 2.0 Type-C Tháo Rời',
      software_support: 'Elgato Stream Deck App, OBS Studio, Twitch, YouTube, Spotify',
      stand: 'Chân đế nghiêng 45 độ công thái học',
      warranty: '24 Tháng Chính Hãng Elgato'
    }
  },

  // =========================================================================
  // 12. LOA MÁY TÍNH (category: 'speakers') - 2 sản phẩm
  // =========================================================================
  {
    id: 'spk-razer-leviathan-v2-chroma',
    name: 'Loa Gaming Soundbar Razer Leviathan V2 Chroma Âm Thanh Vòm THX Spatial',
    category: 'speakers',
    price: 6290000,
    originalPrice: 6990000,
    rating: 4.9,
    badge: 'SOUNDBAR GAMING',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    description: 'Dàn âm thanh soundbar đặt dưới màn hình kèm loa siêu trầm Subwoofer uy lực, đèn LED gầm Razer Chroma RGB 18 vùng độc đáo.',
    specs: {
      frequency_response: '45 Hz – 20 kHz',
      audio_technology: 'THX Spatial Audio Giả Lập 7.1',
      drivers: '2x Full-Range, 2x Tweeter, 2x Passive Radiator + 1x Subwoofer Độc Lập',
      connectivity: 'Bluetooth 5.2 (Độ trễ thấp 60ms) + USB Audio PC',
      warranty: '24 Tháng Chính Hãng Razer'
    }
  },
  {
    id: 'spk-edifier-s880db-audiophile',
    name: 'Loa Vi Tính Edifier S880DB Hi-Res Audio Chuẩn Audiophile Vỏ Gỗ',
    category: 'speakers',
    price: 4890000,
    originalPrice: 5500000,
    rating: 4.93,
    badge: 'HI-RES AUDIO',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80',
    description: 'Cặp loa kiểm âm bàn làm việc vỏ gỗ sang trọng, chứng nhận Hi-Res Audio với chip giải mã DAC XMOS 24bit/192kHz âm thanh chi tiết từng nốt nhạc.',
    specs: {
      power_output: '88W RMS (12W x 2 Treble + 32W x 2 Bass)',
      dac_processor: 'XMOS XCore200 24-bit/192kHz',
      inputs: 'USB Audio, Optical, Coaxial, Bluetooth aptX, RCA AUX',
      casing: 'Vỏ gỗ tự nhiên sơn mờ sang trọng',
      warranty: '12 Tháng Chính Hãng Edifier'
    }
  },

  // =========================================================================
  // 13. CARD MẠNG KHÔNG DÂY (category: 'network') - 2 sản phẩm
  // =========================================================================
  {
    id: 'net-asus-pce-axe59bt-wifi6e',
    name: 'Card Mạng Không Dây ASUS PCE-AXE59BT PCIe WiFi 6E & Bluetooth 5.2 Băng Tần 6GHz',
    category: 'network',
    price: 1690000,
    originalPrice: 1990000,
    rating: 4.92,
    badge: 'WIFI 6E TỐC ĐỘ CAO',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    description: 'Nâng cấp mạng WiFi 6E thế hệ mới mở rộng băng tần 6GHz không nghẽn sóng, anten rời đế nam châm thu sóng cực khỏe, ping chơi game cực ổn định.',
    specs: {
      standards: 'IEEE 802.11 a/b/g/n/ac/ax (WiFi 6E)',
      speeds: 'Lên đến 2402 Mbps (6GHz) / 2402 Mbps (5GHz) / 574 Mbps (2.4GHz)',
      bluetooth: 'Bluetooth 5.2 Tốc Độ Cao',
      interface: 'PCI Express x1',
      security: 'Bảo mật chuẩn mới nhất WPA3',
      warranty: '36 Tháng Chính Hãng ASUS'
    }
  },
  {
    id: 'net-tplink-archer-tx20e-wifi6',
    name: 'Card Mạng TP-Link Archer TX20E PCIe WiFi 6 AX1800 Anten Kép Bluetooth 5.2',
    category: 'network',
    price: 690000,
    originalPrice: 850000,
    rating: 4.86,
    badge: 'GIÁ TỐT NHẤT',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&q=80',
    description: 'Giải pháp bắt wifi ổn định giá mềm cho máy bàn, trang bị 2 anten đa hướng khuếch đại tín hiệu, loại bỏ dây mạng rườm rà trong nhà.',
    specs: {
      standards: 'WiFi 6 (802.11ax/ac/n/a 5 GHz, 802.11ax/n/g/b 2.4 GHz)',
      speeds: '1201 Mbps trên băng tần 5GHz + 574 Mbps trên 2.4GHz',
      bluetooth: 'Bluetooth 5.2 Kết Nối Tai Nghe, Chuột Không Dây',
      antennas: '2x Anten Độ Lợi Cao Đa Hướng',
      warranty: '24 Tháng Chính Hãng TP-Link'
    }
  },

  // =========================================================================
  // 14. PHẦN MỀM BẢN QUYỀN (category: 'software') - 2 sản phẩm
  // =========================================================================
  {
    id: 'soft-win11-pro-fpp-usb',
    name: 'Hệ Điều Hành Microsoft Windows 11 Pro 64-bit Bản Quyền Vĩnh Viễn FPP',
    category: 'software',
    price: 3490000,
    originalPrice: 3990000,
    rating: 4.97,
    badge: 'BẢN QUYỀN VĨNH VIỄN',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    description: 'Hộp cài đặt USB chính hãng kèm Key kích hoạt bản quyền vĩnh viễn, được chuyển nhượng sang máy tính khác khi nâng cấp PC.',
    specs: {
      edition: 'Windows 11 Professional 64-bit',
      license_type: 'FPP (Full Packaged Product) - Chuyển máy thoải mái',
      support: 'Bảo mật BitLocker, Windows Sandbox, Hyper-V, Remote Desktop',
      updates: 'Cập nhật tính năng và bản vá bảo mật trọn đời từ Microsoft',
      warranty: 'Bản Quyền Vĩnh Viễn 100% Chính Hãng'
    }
  },
  {
    id: 'soft-office-home-business-2024',
    name: 'Bộ Phần Mềm Văn Phòng Microsoft Office Home & Business 2024 Bản Quyền Vĩnh Viễn',
    category: 'software',
    price: 4990000,
    originalPrice: 5500000,
    rating: 4.95,
    badge: 'OFFICE 2024 MỚI NHẤT',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80',
    description: 'Bộ ứng dụng văn phòng kinh điển không cần gia hạn thuê bao hàng năm: Word, Excel, PowerPoint, Outlook bản quyền trọn đời cho 1 PC hoặc Mac.',
    specs: {
      apps_included: 'Word 2024, Excel 2024, PowerPoint 2024, Outlook 2024, OneNote',
      device_count: '1 Thiết bị (Windows 11/10 hoặc macOS)',
      payment_type: 'Mua Một Lần - Sử Dụng Vĩnh Viễn',
      support: 'Hỗ trợ kỹ thuật chính hãng Microsoft trong 60 ngày đầu',
      warranty: 'Chính Hãng Microsoft'
    }
  }
];

module.exports = seedProducts;
