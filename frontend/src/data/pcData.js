export const FEATURED_PCS = [
  {
    id: "pc-ai-pro-4090",
    name: "NAT CYBER AI PRO 4090",
    category: "workstation",
    categoryName: "Workstation AI & Render",
    price: 89900000,
    originalPrice: 96500000,
    rating: 4.9,
    reviewsCount: 42,
    badge: "AI ULTRA POWER",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80",
    specs: {
      cpu: "Intel Core i9-14900KS",
      gpu: "NVIDIA RTX 4090 24GB GDDR6X",
      ram: "64GB DDR5 RGB 6000MHz",
      ssd: "2TB NVMe Gen4 High Speed",
      psu: "1000W 80 Plus Gold ATX 3.0",
      cooler: "AIO 360mm ARGB Liquid",
    },
    fps: {
      "Black Myth: Wukong (4K)": "115 FPS",
      "Cyberpunk 2077 (4K Ultra)": "128 FPS",
      "Stable Diffusion AI": "0.8s / Image",
    },
    model3d: {
      color: "pearl-white",
      fanRgb: "#06b6d4",
    }
  },
  {
    id: "pc-gaming-ultra-4070ti",
    name: "NAT GAMING BEAST 4070 Ti SUPER",
    category: "gaming",
    categoryName: "Gaming Extreme",
    price: 45900000,
    originalPrice: 49900000,
    rating: 4.85,
    reviewsCount: 88,
    badge: "HOT SELLER",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80",
    specs: {
      cpu: "AMD Ryzen 7 7800X3D",
      gpu: "NVIDIA RTX 4070 Ti SUPER 16GB",
      ram: "32GB DDR5 5600MHz RGB",
      ssd: "1TB NVMe Gen4",
      psu: "850W 80 Plus Gold",
      cooler: "Dual Tower ARGB Air Cooler",
    },
    fps: {
      "Black Myth: Wukong (2K)": "145 FPS",
      "Cyberpunk 2077 (2K RayTracing)": "130 FPS",
      "Valorant (1080p)": "620 FPS",
    },
    model3d: {
      color: "crystal-black",
      fanRgb: "#2563eb",
    }
  },
  {
    id: "pc-budget-gaming-4060",
    name: "NAT STREAMER VALUE 4060",
    category: "budget",
    categoryName: "Budget Master",
    price: 21900000,
    originalPrice: 24500000,
    rating: 4.8,
    reviewsCount: 156,
    badge: "BEST BUDGET",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    specs: {
      cpu: "Intel Core i5-13400F",
      gpu: "NVIDIA RTX 4060 8GB GDDR6",
      ram: "16GB DDR4 3200MHz",
      ssd: "512GB NVMe M.2",
      psu: "650W 80 Plus Bronze",
      cooler: "Single Tower ARGB Cooler",
    },
    fps: {
      "Black Myth: Wukong (1080p)": "85 FPS",
      "Cyberpunk 2077 (1080p High)": "95 FPS",
      "CS:GO 2 (1080p)": "340 FPS",
    },
    model3d: {
      color: "pure-white",
      fanRgb: "#7c3aed",
    }
  },
  {
    id: "pc-mini-creator-rtx4080",
    name: "NAT MINI ITX CREATOR 4080",
    category: "minipc",
    categoryName: "Mini PC Compact",
    price: 68500000,
    originalPrice: 73000000,
    rating: 4.92,
    reviewsCount: 29,
    badge: "COMPACT & QUIET",
    image: "https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80",
    specs: {
      cpu: "Intel Core i7-14700K",
      gpu: "NVIDIA RTX 4080 SUPER 16GB",
      ram: "32GB DDR5 ITX Spec",
      ssd: "2TB Gen4 High-End",
      psu: "750W SFX Gold",
      cooler: "AIO 240mm ITX Liquid",
    },
    fps: {
      "Premiere Pro 4K Render": "Rất mượt",
      "Cyberpunk 2077 (4K)": "98 FPS",
      "Blender Benchmark": "Top 2%",
    },
    model3d: {
      color: "silver-mesh",
      fanRgb: "#10b981",
    }
  }
];

export const AI_PRESETS = [
  {
    title: "Chơi Game 4K & Streamer Pro",
    budget: 45000000,
    usage: "Gaming 4K Ultra, Livestream 1080p60, Edit Video 4K",
    promptText: "Gợi ý cho tôi cấu hình 45 triệu tối ưu cho Wukong 4K và Stream",
    cpu: "AMD Ryzen 7 7800X3D",
    gpu: "NVIDIA RTX 4070 Ti SUPER 16GB",
    ram: "32GB DDR5 RGB 6000MHz",
    psu: "850W Gold ATX 3.0",
    compatibility: 100,
    estimatedWatt: 620,
    fpsWukong: 125,
    fpsCyberpunk: 110,
    fpsValorant: 580,
  },
  {
    title: "Đồ Họa AI, Render 3D & Deep Learning",
    budget: 65000000,
    usage: "Train AI model, Blender Render, Premiere, After Effects 4K",
    promptText: "Cần cấu hình 65 triệu train model AI và Render 3D 24/7",
    cpu: "Intel Core i9-14900K",
    gpu: "NVIDIA RTX 4080 SUPER 16GB",
    ram: "64GB DDR5 6000MHz",
    psu: "1000W 80 Plus Gold",
    compatibility: 100,
    estimatedWatt: 780,
    fpsWukong: 140,
    fpsCyberpunk: 135,
    fpsValorant: 650,
  },
  {
    title: "Gaming ESports & Học Tập Tiết Kiệm",
    budget: 18000000,
    usage: "Valorant, League of Legends, GTA V, Học lập trình & Photoshop",
    promptText: "Tư vấn máy 18 triệu chiến mượt game Esport và học tập tốt",
    cpu: "Intel Core i5-12400F",
    gpu: "NVIDIA RTX 3060 12GB GDDR6",
    ram: "16GB DDR4 3200MHz",
    psu: "650W 80 Plus Bronze",
    compatibility: 100,
    estimatedWatt: 450,
    fpsWukong: 65,
    fpsCyberpunk: 75,
    fpsValorant: 380,
  }
];

export const COMPONENTS_3D_EXPLODED = [
  {
    id: "case",
    name: "Vỏ Case Kính Cường Lực ARGB NAT Vision",
    type: "Case",
    desc: "Thiết kế bể cá Panoramic 270 độ, chất liệu nhôm hợp kim nhẹ & mạ nano trắng ngọc trai sáng bóng.",
    price: "2,450,000đ",
    color: "#e2e8f0"
  },
  {
    id: "gpu",
    name: "Card Đồ Họa NVIDIA GeForce RTX 4090 24GB",
    type: "Graphics Card",
    desc: "Đỉnh cao xử lý đồ họa Ray Tracing & DLSS 3.5 frame generation. Tích hợp 3 quạt tản nhiệt khí động học.",
    price: "49,900,000đ",
    color: "#2563eb"
  },
  {
    id: "cooler",
    name: "Tản Nhiệt Nước AIO 360mm ARGB IceStorm",
    type: "Liquid Cooler",
    desc: "Mặt bơm trang bị màn hình LCD hiển thị nhiệt độ real-time & hiệu ứng ARGB đuổi đa màu.",
    price: "3,850,000đ",
    color: "#06b6d4"
  },
  {
    id: "ram",
    name: "Bộ Nhớ RAM DDR5 64GB (2x32GB) 6000MHz",
    type: "Memory",
    desc: "Thanh tản nhiệt nhôm bạc phay xước cao cấp, tích hợp LED RGB đồng bộ ánh sáng.",
    price: "5,950,000đ",
    color: "#7c3aed"
  },
  {
    id: "motherboard",
    name: "Bo Mạch Chủ Z790 AORUS ELITE AX ICE",
    type: "Motherboard",
    desc: "Tone trắng bạc chuẩn ATX, dàn VRM 16+1+1 pha điện kỹ thuật số chịu tải cực cao.",
    price: "8,200,000đ",
    color: "#94a3b8"
  },
  {
    id: "psu",
    name: "Nguồn Super Flower Leadex VII Gold 1000W",
    type: "Power Supply",
    desc: "Chuẩn ATX 3.0 & PCIe 5.0 dây nguồn bọc lưới cao cấp, vận hành siêu êm ái.",
    price: "4,600,000đ",
    color: "#f59e0b"
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Độ Mixi (Streamer / Creator)",
    role: "Khách hàng doanh nghiệp",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80",
    content: "Trợ lý AI tư vấn linh kiện chuẩn từng watt điện luôn! Dàn 3D PC dựng trực quan giúp mình dễ dàng hình dung màu sắc case và dây nguồn cắm vào ra sao.",
    rating: 5,
    rigName: "NAT RTX 4090 Beast",
  },
  {
    id: 2,
    name: "Hoàng Nguyễn - Lead 3D Artist",
    role: "Creator & VFX Designer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    content: "Vừa trải nghiệm tính năng Build PC 3D trên web, độ chi tiết siêu thực! Đặt mua xong 2h là nhân viên giao máy tận nhà hỗ trợ lắp đặt trọn gói.",
    rating: 5,
    rigName: "NAT Workstation AI Pro",
  },
  {
    id: 3,
    name: "Lê Minh Tuấn - Gamer Wukong",
    role: "Hardcore Gamer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    content: "Giá tốt nhất thị trường, dịch vụ bảo hành 1 đổi 1 tận nơi cực yên tâm. Dàn máy chạy êm ru, chơi Wukong 4K 120fps bao mượt!",
    rating: 5,
    rigName: "NAT Gaming 4070 Ti Super",
  }
];

export const PC_DEALS = FEATURED_PCS;
