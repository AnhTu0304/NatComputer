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

    // Run Database Normalization & Optimization Migration
    const migrationPath = path.join(__dirname, 'migrations', '20260929_database_normalization.sql');
    if (fs.existsSync(migrationPath)) {
      const migrationSql = fs.readFileSync(migrationPath, 'utf8');
      await client.query(migrationSql);
      console.log('✅ PostgreSQL Normalization Migration applied successfully.');
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

    // Seed real PC configurations & components from seedCatalog
    const seedProducts = require('./src/data/seedCatalog');

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
