require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Configure PostgreSQL connection pool
const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'Anhtu3425@',
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'nat_computer',
  connectionTimeoutMillis: 3000,
});

let isPostgresConnected = false;

// Test PostgreSQL Connection & Auto-Initialize Schema
async function initDatabase() {
  try {
    const client = await pool.connect();
    isPostgresConnected = true;
    console.log('✅ Connected successfully to PostgreSQL database: nat_computer');

    // Create tables if they don't exist
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(sql);
      console.log('✅ PostgreSQL Schema tables verified/created successfully.');
    }

    // Ensure columns exist on already created tables
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT '123';
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) DEFAULT '123';
      ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
      ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
      ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';
      ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id VARCHAR(50);
      ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE products ADD COLUMN IF NOT EXISTS slug VARCHAR(255);
      ALTER TABLE products ALTER COLUMN slug DROP NOT NULL;
      ALTER TABLE products DROP CONSTRAINT IF EXISTS products_category_id_fkey;
    `);

    // Seed default admin user
    await client.query(
      `INSERT INTO users (id, name, email, phone, password, password_hash, role, address)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      ['usr_admin_master', 'Quản Trị Viên (Admin Master)', 'admin@natcomputer.vn', '0886976868', '123', '123', 'admin', 'Trụ sở NAT Computer, Cầu Giấy, Hà Nội']
    );

    // Seed default categories matching navigation mega menu
    const defaultCats = [
      { id: 'gaming', name: 'PC Gaming Cao Cấp', slug: 'gaming', description: 'Dàn máy chiến game đỉnh cao eSports, AAA 4K' },
      { id: 'workstation', name: 'PC Workstation Đồ Họa 3D', slug: 'workstation', description: 'Máy trạm dựng hình 3DsMax, Render 4K/8K, AI Deep Learning' },
      { id: 'pc-amd', name: 'PC AMD Gaming', slug: 'pc-amd', description: 'Ryzen 7000/9000 Series 3D V-Cache đỉnh cao' },
      { id: 'pc-mini', name: 'PC Mini Nhỏ Gọn', slug: 'pc-mini', description: 'Thiết kế ITX tinh xảo, tiết kiệm diện tích' },
      { id: 'office', name: 'PC Văn Phòng & Doanh Nghiệp', slug: 'office', description: 'Máy tính đồng bộ vận hành êm ái, độ bền cao' },
      { id: 'ai', name: 'PC AI - Trí Tuệ Nhân Tạo', slug: 'pc-ai', description: 'Xử lý mô hình LLM, Stable Diffusion, Deep Learning' },
      { id: 'components', name: 'Linh Kiện Máy Tính', slug: 'components', description: 'CPU, VGA, RAM, SSD, Nguồn, Case, Tản nhiệt chính hãng' },
      { id: 'monitors', name: 'Màn Hình Máy Tính', slug: 'monitors', description: 'Màn hình IPS, OLED, 144Hz - 240Hz sắc nét' },
      { id: 'gaming-gear', name: 'Gaming Gear', slug: 'gaming-gear', description: 'Bàn phím cơ, Chuột gaming, Tai nghe, Ghế, Tay cầm, Stream' },
      { id: 'pc-combo', name: 'Full Bộ PC Kèm Màn Hình', slug: 'pc-combo', description: 'Bộ máy trọn gói kèm màn hình, phím chuột đầy đủ' },
      { id: 'speakers', name: 'Loa Máy Tính', slug: 'speakers', description: 'Loa gaming, Soundbar âm thanh vòm sống động' },
      { id: 'software', name: 'Phần Mềm', slug: 'software', description: 'Windows bản quyền, Office, Diệt virus' },
      { id: 'network', name: 'Card Mạng Không Dây', slug: 'network', description: 'Card Wifi 6E, Wifi 7, Bluetooth tốc độ cao' },
      { id: 'virtualization', name: 'PC Giả Lập Ảo Hóa', slug: 'virtualization', description: 'Chạy nhiều tab giả lập NoxPlayer, LDPlayer mượt mà' },
      { id: 'cat_pc_gaming', name: 'PC Gaming Cao Cấp', slug: 'pc-gaming', description: 'Dàn máy chiến game đỉnh cao eSports, AAA 4K' },
      { id: 'cat_pc_workstation', name: 'PC Workstation Đồ Họa 3D', slug: 'pc-workstation', description: 'Máy trạm dựng hình 3DsMax, Render 4K/8K, AI Deep Learning' },
      { id: 'cat_pc_office', name: 'PC Văn Phòng & Doanh Nghiệp', slug: 'pc-office', description: 'Máy tính đồng bộ vận hành êm ái, độ bền cao' },
      { id: 'cat_components', name: 'Linh Kiện Máy Tính', slug: 'linh-kien', description: 'CPU, VGA, RAM, SSD, Nguồn, Case, Tản nhiệt chính hãng' },
      { id: 'cat_monitors', name: 'Màn Hình Gaming & Đồ Họa', slug: 'man-hinh', description: 'Màn hình IPS, OLED, 144Hz - 240Hz sắc nét' }
    ];
    for (const cat of defaultCats) {
      await client.query(
        `INSERT INTO categories (id, name, slug, description)
         VALUES ($1, $2, $3, $4) ON CONFLICT (id) DO NOTHING`,
        [cat.id, cat.name, cat.slug, cat.description]
      );
    }

    // Seed default banners
    const defaultBanners = [
      {
        id: 'ban_hero_1',
        title: 'BUILD PC GAMING 3D CÔNG NGHỆ MỚI',
        subtitle: 'Trải nghiệm lắp ráp trực quan xoay 360 độ và tư vấn trí tuệ nhân tạo AI',
        imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1600&q=80',
        linkUrl: '/build',
        badge: 'TÍNH NĂNG ĐỘC QUYỀN'
      },
      {
        id: 'ban_hero_2',
        title: 'DEAL GAMING BÙNG NỔ — GIẢM ĐẾN 40%',
        subtitle: 'Tặng kèm màn hình Gaming 240Hz & Bộ quà tặng Gear trị giá 5.000.000đ',
        imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=1600&q=80',
        linkUrl: '/hotsale',
        badge: 'HOT SUMMER DEAL'
      }
    ];
    for (const b of defaultBanners) {
      await client.query(
        `INSERT INTO banners (id, title, subtitle, image_url, link_url, badge, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [b.id, b.title, b.subtitle, b.imageUrl, b.linkUrl, b.badge, true]
      );
    }

    // Seed real PC configurations
    const seedProducts = [
      // GAMING
      {
        id: 'pc-gaming-ultra-4070ti',
        name: 'NAT GAMING BEAST 4070 Ti SUPER',
        category: 'gaming',
        price: 45900000,
        originalPrice: 49900000,
        rating: 4.88,
        badge: 'HOT SELLER',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
        description: 'Chiến mượt 100% các tựa game eSports & AAA 2K/4K max settings như Black Myth Wukong, Cyberpunk 2077, GTA V, Valorant.',
        specs: { cpu: 'AMD Ryzen 7 7800X3D', gpu: 'NVIDIA RTX 4070 Ti SUPER 16GB', ram: '32GB DDR5 5600MHz RGB', ssd: '1TB NVMe Gen4', mainboard: 'MSI MAG B650 TOMAHAWK WIFI', psu: '850W 80 Plus Gold', cooler: 'Dual Tower ARGB Air Cooler' }
      },
      {
        id: 'pc-gaming-i5-4060',
        name: 'NAT GAMING ESPORTS I5 13400F / RTX 4060',
        category: 'gaming',
        price: 21990000,
        originalPrice: 24500000,
        rating: 4.82,
        badge: 'BEST VALUE',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80',
        description: 'Cấu hình quốc dân chiến mượt mọi game Online Liên Minh, CS2, FO4, Valorant và GTA V mức thiết lập cao.',
        specs: { cpu: 'Intel Core i5-13400F', gpu: 'NVIDIA RTX 4060 8GB GDDR6', ram: '16GB DDR4 3200MHz', ssd: '512GB NVMe PCIe 4.0', mainboard: 'ASUS PRIME B760M-K', psu: '650W 80 Plus Bronze', cooler: 'Thermalright Assassin X 120' }
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
        description: 'Cấu hình đỉnh cao trang bị Intel Core Ultra 7 kết hợp RTX 5070 thế hệ mới nhất.',
        specs: { cpu: 'Intel Core Ultra 7 270K', gpu: 'NVIDIA GeForce RTX 5070 12GB', ram: '32GB DDR5 6000MHz RGB', ssd: '1TB NVMe Gen4', mainboard: 'MSI Z890 GAMING PLUS WIFI', psu: 'Corsair RM850e 850W Gold' }
      },
      {
        id: 'deal-ryzen-7-9800x3d',
        name: 'PC TTG AMD GAMING LUXURY RYZEN 7 9800X3D',
        category: 'gaming',
        price: 58980000,
        originalPrice: 61500000,
        rating: 4.98,
        badge: 'SUPER DEAL',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
        description: 'Vua gaming thế giới với vi xử lý 3D V-Cache Ryzen 7 9800X3D đỉnh cao FPS.',
        specs: { cpu: 'AMD Ryzen 7 9800X3D', gpu: 'NVIDIA RTX 4070 Ti SUPER 16GB', ram: '32GB DDR5 6000MHz', ssd: '1TB NVMe Gen4', mainboard: 'ASUS ROG STRIX B650-A', psu: 'Seasonic FOCUS GX-850' }
      },

      // OFFICE
      {
        id: 'office-basic-i5',
        name: 'NAT OFFICE BASIC i5',
        category: 'office',
        price: 12500000,
        originalPrice: 14000000,
        rating: 4.6,
        badge: 'VĂN PHÒNG',
        image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80',
        description: 'Dàn máy văn phòng siêu bền bỉ tiết kiệm điện, mở hàng chục tab Chrome mượt mà.',
        specs: { cpu: 'Intel Core i5-12400', gpu: 'Intel UHD 730', ram: '16GB DDR4 3200MHz', ssd: '512GB NVMe M.2', mainboard: 'GIGABYTE H610M', psu: 'Mik 500W' }
      },
      {
        id: 'office-pro-i7',
        name: 'NAT OFFICE PRO i7',
        category: 'office',
        price: 19500000,
        originalPrice: 21500000,
        rating: 4.7,
        badge: 'PRO',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
        description: 'Máy tính doanh nghiệp đa nhiệm cực khỏe với Intel Core i7 và RAM DDR5 tốc độ cao.',
        specs: { cpu: 'Intel Core i7-14700', gpu: 'Intel UHD 770', ram: '32GB DDR5 5600MHz', ssd: '1TB NVMe Gen4', mainboard: 'ASUS PRIME B760M-A', psu: 'Corsair CV650' }
      },
      {
        id: 'office-aio-mini',
        name: 'NAT OFFICE MINI PC',
        category: 'office',
        price: 13500000,
        originalPrice: 15000000,
        rating: 4.5,
        badge: 'COMPACT',
        image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&q=80',
        description: 'Mini PC nhỏ gọn đặt gọn trên bàn làm việc, vận hành êm ái tuyệt đối.',
        specs: { cpu: 'AMD Ryzen 5 5600U', gpu: 'Radeon Vega 7', ram: '16GB DDR4 3200MHz', ssd: '512GB NVMe M.2', mainboard: 'Integrated Mini Chassis', psu: 'Adapter 90W Silent' }
      },
      {
        id: 'pc-office-i5-pro',
        name: 'NAT OFFICE PRO INTEL I5 13400 / 32GB RAM',
        category: 'office',
        price: 13990000,
        originalPrice: 15900000,
        rating: 4.75,
        badge: 'BỀN BỈ 24/7',
        image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80',
        description: 'Máy tính đồng bộ vận hành êm ái, xử lý đa tác vụ văn phòng, kế toán, lập trình.',
        specs: { cpu: 'Intel Core i5-13400', gpu: 'Intel UHD Graphics 730', ram: '32GB DDR4 3200MHz', ssd: '1TB NVMe PCIe 4.0', mainboard: 'MSI PRO H610M-E', psu: '550W 80 Plus' }
      },

      // WORKSTATION
      {
        id: 'pc-ai-pro-4090',
        name: 'NAT CYBER AI PRO 4090',
        category: 'workstation',
        price: 89900000,
        originalPrice: 96500000,
        rating: 4.95,
        badge: 'AI ULTRA POWER',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
        description: 'Cấu hình đồ họa siêu cấp chuyên xử lý mô hình Deep Learning AI, Render 8K Octane, V-Ray, Unreal Engine 5 đỉnh cao nhất.',
        specs: { cpu: 'Intel Core i9-14900KS', gpu: 'NVIDIA RTX 4090 24GB GDDR6X', ram: '64GB DDR5 RGB 6000MHz', ssd: '2TB NVMe Gen4 High Speed', mainboard: 'ASUS ROG MAXIMUS Z790 HERO', psu: '1000W 80 Plus Gold ATX 3.0', cooler: 'AIO 360mm ARGB Liquid' }
      },
      {
        id: 'pc-workstation-threadripper',
        name: 'NAT WORKSTATION 3D THREADRIPPER 7960X',
        category: 'workstation',
        price: 145000000,
        originalPrice: 155000000,
        rating: 5.0,
        badge: 'RENDER MONSTER',
        image: 'https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=800&q=80',
        description: 'Máy trạm đồ họa 24 nhân 48 luồng chuyên nghiệp cho kiến trúc, dựng phim điện ảnh Hollywood 8K.',
        specs: { cpu: 'AMD Ryzen Threadripper 7960X 24C/48T', gpu: 'NVIDIA RTX 4090 24GB OC', ram: '128GB DDR5 ECC Quad-Channel', ssd: '4TB NVMe Gen5 Raid 0', mainboard: 'ASUS Pro WS TRX50-SAGE WIFI', psu: '1300W Platinum ATX 3.0', cooler: 'Custom Loop Liquid Cooling' }
      },

      // COMPONENTS
      {
        id: 'comp-vga-rtx-4090',
        name: 'Card Màn Hình ASUS ROG Strix GeForce RTX 4090 24GB',
        category: 'components',
        price: 56990000,
        originalPrice: 61500000,
        rating: 4.95,
        badge: 'SIÊU PHẨM',
        image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800&q=80',
        description: 'Vua của card đồ họa gaming và trí tuệ nhân tạo thế giới, tản nhiệt buồng hơi siêu mát.',
        specs: { cpu: 'CUDA 16384 Cores', gpu: 'RTX 4090 24GB GDDR6X 384-bit', ram: '24GB GDDR6X', ssd: 'PCIe 4.0 x16' }
      },
      {
        id: 'comp-cpu-i9',
        name: 'Bộ Vi Xử Lý Intel Core i9-14900KS Special Edition',
        category: 'components',
        price: 13900000,
        originalPrice: 15500000,
        rating: 4.85,
        badge: 'FLAGSHIP',
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80',
        description: 'Xung nhịp 6.2GHz cực khủng 24 nhân 32 luồng cho mọi tác vụ nặng nhất.',
        specs: { cpu: '24 Nhân / 32 Luồng', gpu: 'Intel UHD 770', ram: 'DDR5 5600MHz', ssd: 'LGA 1700 6.2GHz Boost' }
      },
      {
        id: 'comp-ram-ddr5',
        name: 'Bộ Nhớ RAM Corsair Dominator Titanium 64GB (2x32GB) DDR5 6000MHz',
        category: 'components',
        price: 5950000,
        originalPrice: 6500000,
        rating: 4.8,
        badge: 'DDR5 RGB',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=800&q=80',
        description: 'Kit RAM tản nhiệt nhôm nguyên khối cao cấp với dải LED RGB đồng bộ iCUE.',
        specs: { cpu: '2x32GB Kit Dual Channel', gpu: '6000MHz CL30', ram: '64GB DDR5', ssd: 'Intel XMP 3.0 / AMD EXPO' }
      },

      // MONITORS
      {
        id: 'mon-4k-144',
        name: 'Màn Hình NAT VIEW 32" 4K UHD 144Hz IPS Pro',
        category: 'monitors',
        price: 12900000,
        originalPrice: 14500000,
        rating: 4.75,
        badge: '4K 144HZ',
        image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80',
        description: 'Chuẩn màu đồ họa 98% DCI-P3, tần số quét 144Hz và cổng USB-C 90W PD.',
        specs: { cpu: '32 inch 4K (3840x2160)', gpu: '144Hz · 1ms GtG', ram: '98% DCI-P3 · HDR600', ssd: 'USB-C 90W · HDMI 2.1' }
      },
      {
        id: 'mon-2k-240',
        name: 'Màn Hình Gaming NAT VIEW 27" Fast IPS QHD 2K 240Hz 0.5ms',
        category: 'monitors',
        price: 8900000,
        originalPrice: 9900000,
        rating: 4.8,
        badge: '2K 240HZ',
        image: 'https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=800&q=80',
        description: 'Tần số quét 240Hz siêu mượt cho Esport Valorant, CS2, hỗ trợ G-Sync.',
        specs: { cpu: '27 inch 2K (2560x1440)', gpu: '240Hz · 0.5ms Fast IPS', ram: 'G-Sync · FreeSync', ssd: 'HDR400 · DisplayPort 1.4' }
      },
      {
        id: 'mon-ultrawide',
        name: 'Màn Hình Cong NAT VIEW 34" Ultrawide 21:9 165Hz Curved 1500R',
        category: 'monitors',
        price: 15900000,
        originalPrice: 17500000,
        rating: 4.7,
        badge: 'UWQHD',
        image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80',
        description: 'Góc nhìn siêu rộng 21:9 chuẩn điện ảnh, tối ưu làm việc đa cửa sổ và game nhập vai.',
        specs: { cpu: '34 inch UWQHD (3440x1440)', gpu: '165Hz · 1ms MPRT', ram: 'Curved 1500R · HDR400', ssd: 'Dải màu 125% sRGB' }
      },

      // GAMING GEAR
      {
        id: 'gear-keyboard-akko-rgb',
        name: 'Bàn Phím Cơ AKKO 3087 v2 DS Switch Pink Hotswap RGB',
        category: 'gaming-gear',
        price: 1290000,
        originalPrice: 1590000,
        rating: 4.9,
        badge: 'HOT GEAR',
        image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
        description: 'Keycap PBT Double-Shot bền bỉ, Akko Switch CS Jelly Pink gõ êm mượt, LED RGB 16.8 triệu màu.',
        specs: { cpu: 'Akko CS Pink Switch', gpu: 'Hotswap 5 pin', ram: 'PBT Double-Shot OEM', ssd: 'Dây Type-C tháo rời' }
      },
      {
        id: 'gear-mouse-logitech-superlight',
        name: 'Chuột Không Dây Logitech G Pro X Superlight 2 Wireless',
        category: 'gaming-gear',
        price: 3290000,
        originalPrice: 3890000,
        rating: 4.95,
        badge: 'ESPORTS PRO',
        image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&q=80',
        description: 'Trọng lượng siêu nhẹ dưới 60g, cảm biến HERO 2 độ phân giải 32.000 DPI, switch quang cơ Hybrid.',
        specs: { cpu: 'HERO 2 32.000 DPI', gpu: 'LIGHTSPEED 2K Polling', ram: 'Trọng lượng 60g', ssd: 'Pin 95 giờ liên tục' }
      },
      {
        id: 'gear-headset-hyperx-cloud2',
        name: 'Tai Nghe Chơi Game HyperX Cloud II Wireless 7.1',
        category: 'gaming-gear',
        price: 2690000,
        originalPrice: 3190000,
        rating: 4.88,
        badge: 'BEST SOUND',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        description: 'Âm thanh vòm giả lập 7.1 sống động, đệm mút hoạt tính êm ái, pin 30 giờ và micro khử ồn.',
        specs: { cpu: 'Driver 53mm Neodymium', gpu: 'Âm vòm 7.1 Virtual', ram: 'Đệm Memory Foam', ssd: 'Wireless 2.4GHz không trễ' }
      },
      {
        id: 'gear-chair-andaseat-kaiser',
        name: 'Ghế Gaming Cao Cấp AndaSeat Kaiser 3 Ergonomic Size L',
        category: 'gaming-gear',
        price: 8990000,
        originalPrice: 10500000,
        rating: 4.92,
        badge: 'ERGONOMIC',
        image: 'https://images.unsplash.com/photo-1580481077197-28564d6dbef2?auto=format&fit=crop&w=600&q=80',
        description: 'Da PVC DuraXtra cao cấp chống trầy, đệm từ tính công thái học 4 hướng đỡ lưng hoàn hảo.',
        specs: { cpu: 'Khung thép nguyên khối', gpu: 'Da PVC DuraXtra cao cấp', ram: 'Tay vịn 4D từ tính', ssd: 'Piston Class 4 tải 150kg' }
      },
      {
        id: 'gear-controller-xbox',
        name: 'Tay Cầm Chơi Game Xbox Series X/S Wireless Controller',
        category: 'gaming-gear',
        price: 1490000,
        originalPrice: 1750000,
        rating: 4.85,
        badge: 'OFFICIAL',
        image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80',
        description: 'Kết nối Bluetooth và Xbox Wireless mượt mà, cò bóp chống trượt, rung đa tầng cảm xúc.',
        specs: { cpu: 'Xbox Wireless + Bluetooth', gpu: 'Jack 3.5mm Audio', ram: 'Cò rung Haptic', ssd: 'Tương thích PC / Xbox / iOS' }
      },
      {
        id: 'gear-stream-elgato-deck',
        name: 'Thiết Bị Stream Elgato Stream Deck MK.2 15 Phím LCD',
        category: 'gaming-gear',
        price: 3690000,
        originalPrice: 4200000,
        rating: 4.9,
        badge: 'STREAM TOOL',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
        description: '15 phím LCD tùy chỉnh macro, chuyển cảnh OBS, mở app, hiệu ứng âm thanh chỉ với 1 nút bấm.',
        specs: { cpu: '15 Phím LCD Tùy Biến', gpu: 'Kết nối Type-C', ram: 'Hỗ trợ OBS, Twitch, YouTube', ssd: 'Plugin Store phong phú' }
      },
      {
        id: 'gear-mic-elgato-wave3',
        name: 'Micro Thu Âm Streaming Chuyên Nghiệp Elgato Wave 3 USB',
        category: 'gaming-gear',
        price: 3490000,
        originalPrice: 3990000,
        rating: 4.88,
        badge: 'PRO AUDIO',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80',
        description: 'Công nghệ chống méo Clipguard độc quyền, bộ chuyển đổi 24-bit/96kHz chuẩn phòng thu.',
        specs: { cpu: 'Condenser Capsule 17mm', gpu: '24-bit / 96kHz ADC', ram: 'Clipguard chống vỡ tiếng', ssd: 'Phần mềm Wave Link' }
      }
    ];

    for (const p of seedProducts) {
      await client.query(
        `INSERT INTO products (id, name, slug, category_id, price, original_price, rating, badge, image_url, description, specs_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           slug = EXCLUDED.slug,
           category_id = EXCLUDED.category_id,
           price = EXCLUDED.price,
           original_price = EXCLUDED.original_price,
           badge = EXCLUDED.badge,
           image_url = EXCLUDED.image_url,
           description = EXCLUDED.description,
           specs_json = EXCLUDED.specs_json`,
        [p.id, p.name, p.id, p.category, p.price, p.originalPrice, p.rating, p.badge, p.image, p.description, JSON.stringify(p.specs)]
      );
    }
    console.log('🌱 Real seed computer configurations synced into PostgreSQL.');

    // Seed default notifications
    const seedNotis = [
      {
        id: 'alt_1',
        title: '🔔 Đơn hàng mới #NAT-998811',
        message: 'Khách hàng Trần Tuấn Anh vừa thanh toán 45.900.000đ qua VietQR.',
        type: 'order',
        is_read: false,
        order_id: 'NAT-998811'
      },
      {
        id: 'alt_2',
        title: '💎 Đơn hàng mới #NAT-889412',
        message: 'Khách hàng Hoàng Minh Quân vừa đặt mua PC RTX 4070 Ti SUPER trị giá 38.900.000đ.',
        type: 'order',
        is_read: false,
        order_id: 'NAT-889412'
      },
      {
        id: 'alt_3',
        title: '⚡ Thanh toán thành công',
        message: 'Cổng thanh toán MoMo xác nhận giao dịch TXN_8988552 thành công.',
        type: 'payment',
        is_read: true,
        order_id: 'NAT-326449'
      }
    ];

    for (const n of seedNotis) {
      await client.query(
        `INSERT INTO notifications (id, title, message, type, is_read, order_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [n.id, n.title, n.message, n.type, n.is_read, n.order_id]
      );
    }

    // Seed default coupons
    const seedCoupons = [
      {
        id: 'coup_nat500k',
        code: 'NAT500K',
        description: 'Giảm 500.000đ trực tiếp cho đơn hàng từ 15.000.000đ',
        discountType: 'fixed',
        discountValue: 500000,
        minOrderAmount: 15000000,
        maxDiscount: 500000,
        usageLimit: 100,
        usedCount: 12,
        expiresAt: '2026-12-31T23:59:59.000Z',
        isActive: true
      },
      {
        id: 'coup_gaming10',
        code: 'GAMING10',
        description: 'Giảm 10% tối đa 1.500.000đ cho đơn hàng máy tính gaming từ 10.000.000đ',
        discountType: 'percent',
        discountValue: 10,
        minOrderAmount: 10000000,
        maxDiscount: 1500000,
        usageLimit: 50,
        usedCount: 7,
        expiresAt: '2026-12-31T23:59:59.000Z',
        isActive: true
      },
      {
        id: 'coup_freeship',
        code: 'FREESHIP',
        description: 'Miễn phí vận chuyển toàn quốc (trừ 100.000đ phí giao hàng) cho đơn từ 5.000.000đ',
        discountType: 'fixed',
        discountValue: 100000,
        minOrderAmount: 5000000,
        maxDiscount: 100000,
        usageLimit: 200,
        usedCount: 45,
        expiresAt: '2026-12-31T23:59:59.000Z',
        isActive: true
      },
      {
        id: 'coup_chao2026',
        code: 'CHAO2026',
        description: 'Giảm ngay 200.000đ cho mọi đơn hàng linh kiện & máy tính từ 2.000.000đ',
        discountType: 'fixed',
        discountValue: 200000,
        minOrderAmount: 2000000,
        maxDiscount: 200000,
        usageLimit: 500,
        usedCount: 88,
        expiresAt: '2026-12-31T23:59:59.000Z',
        isActive: true
      }
    ];

    for (const c of seedCoupons) {
      await client.query(
        `INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, expires_at, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (id) DO NOTHING`,
        [c.id, c.code, c.description, c.discountType, c.discountValue, c.minOrderAmount, c.maxDiscount, c.usageLimit, c.usedCount, c.expiresAt, c.isActive]
      );
    }

    client.release();
  } catch (err) {
    isPostgresConnected = false;
    console.warn('⚠️ Could not connect to PostgreSQL server:', err.message);
    console.warn('💡 Falling back to JSON Persistence Store for local running.');
  }
}

initDatabase();

module.exports = {
  pool,
  query: (text, params) => pool.query(text, params),
  getIsPostgresConnected: () => isPostgresConnected,
};
