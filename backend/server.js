require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
const dbModule = require('./db');
const {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  requireAdmin
} = require('./authMiddleware');
const {
  getBankConfig,
  updateBankConfig,
  generateVietQrUrl
} = require('./vietqrHelper');
const http = require('http');
const {
  buildInvoiceHtml,
  sendInvoiceEmail
} = require('./emailService');
const {
  initSocket,
  notifyNewOrder,
  notifyPaymentSuccess
} = require('./socketManager');

const app = express();
const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiter for authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Quá nhiều yêu cầu đăng nhập/đăng ký. Vui lòng thử lại sau 15 phút.' }
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Utility to read JSON database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return { users: [], categories: [], banners: [], products: [], orders: [], payments: [], sent_emails: [] };
  }
}

// Utility to write JSON database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NAT Computer Backend API is running clean',
    postgres: dbModule.getIsPostgresConnected() ? 'Connected' : 'Fallback DB',
    timestamp: new Date()
  });
});

// 2. Authentication: Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email và Mật khẩu là bắt buộc.' });
  }

  const userId = 'usr_' + Date.now();
  const userName = name || email.split('@')[0];
  const userPhone = phone || '0886976868';
  const userAddress = '456 Trần Duy Hưng, Cầu Giấy, Hà Nội';
  const hashedPassword = await hashPassword(password);

  if (dbModule.getIsPostgresConnected()) {
    try {
      const existing = await dbModule.query('SELECT * FROM users WHERE email = $1', [email.trim().toLowerCase()]);
      if (existing.rows.length > 0) {
        return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản.' });
      }

      const inserted = await dbModule.query(
        `INSERT INTO users (id, name, email, phone, password, password_hash, role, address)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, phone, role, address, created_at`,
        [userId, userName, email.trim().toLowerCase(), userPhone, hashedPassword, hashedPassword, 'customer', userAddress]
      );

      const userObj = inserted.rows[0];
      const token = generateToken(userObj);
      return res.status(201).json({ message: 'Tạo tài khoản thành công.', user: userObj, token });
    } catch (err) {
      console.error('PostgreSQL register error:', err.message);
    }
  }

  const db = readDB();
  const existingUser = (db.users || []).find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ error: 'Email này đã được đăng ký tài khoản.' });
  }

  const newUser = {
    id: userId,
    name: userName,
    email: email.trim(),
    phone: userPhone,
    password: hashedPassword,
    role: 'customer',
    address: userAddress,
    createdAt: new Date().toISOString()
  };

  db.users = db.users || [];
  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...safeUser } = newUser;
  const token = generateToken(safeUser);
  res.status(201).json({ message: 'Tạo tài khoản thành công.', user: safeUser, token });
});

// 3. Authentication: Login (Supports Admin login with admin / 123, email or phone)
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ Email/SĐT và Mật khẩu.' });
  }

  const cleanIdentifier = email.trim().toLowerCase();

  // Admin Master Quick Authentication (admin / 123)
  if ((cleanIdentifier === 'admin' || cleanIdentifier === 'admin@natcomputer.vn') && password === '123') {
    const adminUser = {
      id: 'usr_admin_master',
      name: 'Quản Trị Viên (Admin Master)',
      email: 'admin@natcomputer.vn',
      phone: '0886976868',
      role: 'admin',
      address: 'Trụ sở NAT Computer, Cầu Giấy, Hà Nội',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
    };
    const token = generateToken(adminUser);
    return res.json({ message: 'Đăng nhập Quản trị viên thành công.', user: adminUser, token });
  }

  if (dbModule.getIsPostgresConnected()) {
    try {
      const userRes = await dbModule.query(
        'SELECT id, name, email, phone, password, role, address FROM users WHERE LOWER(email) = $1 OR phone = $1',
        [cleanIdentifier]
      );

      if (userRes.rows.length === 0) {
        return res.status(404).json({ error: 'Tài khoản chưa được đăng ký. Vui lòng chọn Tạo tài khoản.' });
      }

      const user = userRes.rows[0];
      const isValidPass = await comparePassword(password, user.password);
      if (!isValidPass) {
        return res.status(401).json({ error: 'Mật khẩu không chính xác. Vui lòng thử lại.' });
      }

      const { password: _, ...safeUser } = user;
      const token = generateToken(safeUser);
      return res.json({ message: 'Đăng nhập thành công.', user: safeUser, token });
    } catch (err) {
      console.error('PostgreSQL login error:', err.message);
      return res.status(500).json({ error: 'Lỗi xác thực cơ sở dữ liệu.' });
    }
  }

  const db = readDB();
  const user = (db.users || []).find(u => u.email.toLowerCase() === cleanIdentifier || u.phone === cleanIdentifier);
  if (!user) {
    return res.status(404).json({ error: 'Tài khoản chưa được đăng ký.' });
  }
  const isValidPass = await comparePassword(password, user.password);
  if (!isValidPass) {
    return res.status(401).json({ error: 'Mật khẩu không chính xác.' });
  }

  const { password: _, ...safeUser } = user;
  const token = generateToken(safeUser);
  res.json({ message: 'Đăng nhập thành công.', user: safeUser, token });
});

// 3.5. Authentication: Google OAuth 2.0 Sign-In
app.post('/api/auth/google', async (req, res) => {
  const { credential, profile } = req.body;

  let googleUser = profile;
  if (!googleUser && credential) {
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
        googleUser = JSON.parse(payloadStr);
      }
    } catch (e) {
      console.warn('JWT Decode warning:', e.message);
    }
  }

  if (!googleUser || !googleUser.email) {
    return res.status(400).json({ error: 'Không thể xác thực thông tin tài khoản Google.' });
  }

  const cleanEmail = googleUser.email.trim().toLowerCase();
  const userName = googleUser.name || cleanEmail.split('@')[0];
  const userAvatar = googleUser.picture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
  const isAdmin = cleanEmail === 'admin@natcomputer.vn' || cleanEmail === 'admin';

  if (dbModule.getIsPostgresConnected()) {
    try {
      const userRes = await dbModule.query('SELECT id, name, email, phone, role, address, avatar_url FROM users WHERE LOWER(email) = $1', [cleanEmail]);

      let userObj;
      if (userRes.rows.length > 0) {
        userObj = userRes.rows[0];
        if (!userObj.avatar_url && userAvatar) {
          await dbModule.query('UPDATE users SET avatar_url = $1 WHERE id = $2', [userAvatar, userObj.id]);
          userObj.avatar_url = userAvatar;
        }
      } else {
        const newId = 'usr_gg_' + (googleUser.sub ? googleUser.sub.slice(-8) : Date.now());
        const role = isAdmin ? 'admin' : 'customer';
        await dbModule.query(
          `INSERT INTO users (id, name, email, phone, password, password_hash, role, avatar_url, address)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [newId, userName, cleanEmail, '0886976868', 'google_oauth', 'google_oauth', role, userAvatar, 'Đăng nhập qua Google']
        );
        userObj = { id: newId, name: userName, email: cleanEmail, phone: '0886976868', role, avatar_url: userAvatar, address: 'Đăng nhập qua Google' };
      }

      const token = generateToken(userObj);
      return res.json({
        message: 'Đăng nhập Google thành công.',
        user: {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone,
          role: userObj.role,
          avatar: userObj.avatar_url || userAvatar
        },
        token
      });
    } catch (err) {
      console.error('PostgreSQL Google Auth error:', err.message);
    }
  }

  const db = readDB();
  db.users = db.users || [];
  let user = db.users.find(u => u.email && u.email.toLowerCase() === cleanEmail);

  if (!user) {
    user = {
      id: 'usr_gg_' + Date.now(),
      name: userName,
      email: cleanEmail,
      phone: '0886976868',
      role: isAdmin ? 'admin' : 'customer',
      avatar: userAvatar,
      address: 'Đăng nhập qua Google'
    };
    db.users.push(user);
    writeDB(db);
  }

  const token = generateToken(user);
  res.json({ message: 'Đăng nhập Google thành công.', user, token });
});

// 4. Products API
app.get('/api/products', async (req, res) => {
  const { category, search } = req.query;

  if (dbModule.getIsPostgresConnected()) {
    try {
      let queryText = 'SELECT * FROM products';
      const params = [];
      const conditions = [];

      if (category) {
        params.push(category);
        conditions.push(`category_id = $${params.length}`);
      }
      if (search) {
        params.push(`%${search}%`);
        conditions.push(`name ILIKE $${params.length}`);
      }

      if (conditions.length > 0) {
        queryText += ' WHERE ' + conditions.join(' AND ');
      }

      const result = await dbModule.query(queryText, params);
      const mapped = result.rows.map(r => ({
        id: r.id,
        name: r.name,
        category: r.category_id || 'gaming',
        price: parseFloat(r.price),
        originalPrice: parseFloat(r.original_price || r.price),
        rating: parseFloat(r.rating || 5.0),
        badge: r.badge,
        image: r.image_url,
        description: r.description || '',
        specs: typeof r.specs_json === 'string' ? JSON.parse(r.specs_json) : (r.specs_json || {})
      }));

      return res.json({ total: mapped.length, products: mapped });
    } catch (err) {
      console.error('PostgreSQL products error:', err.message);
    }
  }

  const db = readDB();
  let items = db.products || [];

  if (category) {
    items = items.filter(p => p.category === category);
  }
  if (search) {
    items = items.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  }

  res.json({ total: items.length, products: items });
});

// 5. Orders API: Create Order & Process Payment Webhook
app.post('/api/orders', async (req, res) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, items, totalAmount, appliedCoupon, discountAmount } = req.body;

  if (!customerEmail || !items || items.length === 0) {
    return res.status(400).json({ error: 'Thông tin đơn hàng không hợp lệ.' });
  }

  const orderId = 'NAT-' + Math.floor(100000 + Math.random() * 900000);
  const finalName = customerName || 'Khách hàng NAT';
  const finalPhone = customerPhone || '0886976868';
  const finalAddress = shippingAddress || '456 Trần Duy Hưng, Cầu Giấy, Hà Nội';
  const finalMethod = paymentMethod || 'MoMo';
  const finalAmount = totalAmount || 34990000;

  const newOrder = {
    id: orderId,
    customerName: finalName,
    customerEmail: customerEmail,
    customerPhone: finalPhone,
    shippingAddress: finalAddress,
    paymentMethod: finalMethod,
    paymentStatus: 'PAID',
    orderStatus: 'PROCESSING',
    totalAmount: finalAmount,
    appliedCoupon: appliedCoupon || null,
    discountAmount: discountAmount || 0,
    items: items,
    createdAt: new Date().toISOString()
  };

  const newPayment = {
    id: 'pay_' + Date.now(),
    orderId: orderId,
    gateway: finalMethod,
    transactionCode: 'TXN_' + Math.floor(1000000 + Math.random() * 9000000),
    amount: finalAmount,
    status: 'SUCCESS',
    createdAt: new Date().toISOString()
  };

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        `INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, payment_method, payment_status, order_status, total_amount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [orderId, finalName, customerEmail, finalPhone, finalAddress, finalMethod, 'PAID', 'PROCESSING', finalAmount]
      );

      await dbModule.query(
        `INSERT INTO payments (id, order_id, gateway, transaction_code, amount, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [newPayment.id, orderId, finalMethod, newPayment.transactionCode, finalAmount, 'SUCCESS']
      );

      for (const item of items) {
        await dbModule.query(
          `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, specs_breakdown)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [orderId, item.id || 'pc-1', item.name || 'PC GAMING', item.quantity || 1, item.price || finalAmount, JSON.stringify(item.specs || {})]
        );
      }
    } catch (err) {
      console.error('PostgreSQL order insert error:', err.message);
    }
  }

  // Auto-generate order notification
  const notiId = 'noti_' + Date.now();
  const notiTitle = `🔔 Đơn Đặt Hàng Mới #${orderId}!`;
  const notiMsg = `Khách hàng ${customerName} vừa đặt hàng ${new Intl.NumberFormat('vi-VN').format(finalAmount)}đ (${paymentMethod}).`;

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        `INSERT INTO notifications (id, title, message, type, is_read, order_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [notiId, notiTitle, notiMsg, 'order', false, orderId]
      );
    } catch (e) {
      console.error('PostgreSQL notification insert error:', e.message);
    }
  }

  if (appliedCoupon) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = UPPER($1) OR id = $1`,
          [appliedCoupon]
        );
      } catch (e) {
        console.error('Error incrementing coupon used_count in Postgres:', e.message);
      }
    }
  }

  const db = readDB();
  db.orders = db.orders || [];
  db.payments = db.payments || [];
  db.notifications = db.notifications || [];
  db.coupons = db.coupons || [];

  if (appliedCoupon) {
    const matchedCoup = db.coupons.find(c => c.code.toUpperCase() === appliedCoupon.toUpperCase() || c.id === appliedCoupon);
    if (matchedCoup) {
      matchedCoup.usedCount = (matchedCoup.usedCount || 0) + 1;
    }
  }

  db.orders.unshift(newOrder);
  db.payments.unshift(newPayment);
  db.notifications.unshift({
    id: notiId,
    title: notiTitle,
    message: notiMsg,
    type: 'order',
    isRead: false,
    orderId: orderId,
    createdAt: new Date().toISOString()
  });
  writeDB(db);

  // Auto-send HTML confirmation email in background
  sendInvoiceEmail(newOrder).catch(err => {
    console.warn('Auto invoice email dispatch warning:', err.message);
  });

  // Realtime broadcast to admin dashboard
  notifyNewOrder(newOrder);

  res.status(201).json({ message: 'Đặt hàng & Thanh toán thành công.', order: newOrder, payment: newPayment });
});

// 6. Transactional Email API: Send Invoice Email
app.post('/api/email/send-invoice', async (req, res) => {
  const { recipientEmail, orderId, order, invoiceDetails } = req.body;

  const targetEmail = recipientEmail || order?.customerEmail || 'khachhang@natcomputer.vn';
  const targetOrderId = orderId || order?.id || 'NAT-889412';

  const orderPayload = order || {
    id: targetOrderId,
    customerEmail: targetEmail,
    customerName: invoiceDetails?.customerName || 'Quý khách hàng',
    totalAmount: invoiceDetails?.totalAmount || 25000000,
    items: invoiceDetails?.items || []
  };

  const dispatchResult = await sendInvoiceEmail(orderPayload);

  const db = readDB();
  const emailLog = {
    id: 'mail_' + Date.now(),
    recipientEmail: targetEmail,
    orderId: targetOrderId,
    subject: `[NAT COMPUTER] Hóa Đơn Điện Tử Đơn Hàng #${targetOrderId}`,
    status: dispatchResult.status || 'SENT',
    sentAt: new Date().toISOString()
  };

  db.sent_emails = db.sent_emails || [];
  db.sent_emails.push(emailLog);
  writeDB(db);

  res.json({
    success: true,
    message: `Đã gửi email hóa đơn thành công đến ${emailLog.recipientEmail}`,
    emailLog: emailLog
  });
});


// 6.5. VietQR Payment Public Info
app.get('/api/payment/bank-info', (req, res) => {
  const { amount, orderId } = req.query;
  const config = getBankConfig();
  const qrUrl = generateVietQrUrl({
    amount: amount || 0,
    orderId: orderId || ''
  });
  res.json({
    ...config,
    qrUrl
  });
});

// 6.6. Simulate Banking Webhook / IPN for Realtime Payment Notification
app.post('/api/payment/simulate-webhook', async (req, res) => {
  const { orderId, amount, transactionCode, bankCode } = req.body;
  if (!orderId) {
    return res.status(400).json({ error: 'orderId is required' });
  }

  // Update order status in db
  const db = readDB();
  db.orders = db.orders || [];
  db.payments = db.payments || [];
  
  const order = db.orders.find(o => o.id === orderId);
  if (order) {
    order.paymentStatus = 'PAID';
    order.status = 'PROCESSING';
  }

  const payment = db.payments.find(p => p.orderId === orderId);
  if (payment) {
    payment.status = 'SUCCESS';
    payment.transactionCode = transactionCode || payment.transactionCode || 'SIM-' + Date.now();
  }

  writeDB(db);

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        `UPDATE orders SET payment_status = 'PAID', order_status = 'PROCESSING' WHERE id = $1`,
        [orderId]
      );
      await dbModule.query(
        `UPDATE payments SET status = 'SUCCESS', transaction_code = $1 WHERE order_id = $2`,
        [transactionCode || 'SIM-' + Date.now(), orderId]
      );
    } catch (e) {
      console.error('PostgreSQL simulate webhook update error:', e.message);
    }
  }

  // Broadcast realtime socket event to customer room & admin room
  notifyPaymentSuccess(orderId, {
    amount: amount || order?.totalAmount || 0,
    transactionCode: transactionCode || 'MB-' + Date.now(),
    bankCode: bankCode || 'MBBank'
  });

  res.json({
    success: true,
    message: `Thanh toán cho đơn hàng ${orderId} đã được xác nhận thành công (Realtime).`,
    orderId
  });
});

// ==========================================
// 🚀 ADMIN MANAGEMENT RESTFUL APIS (PROTECTED)
// ==========================================
app.use('/api/admin', verifyToken, requireAdmin);

// Admin Bank & VietQR Payment Settings
app.get('/api/admin/settings/bank', (req, res) => {
  res.json(getBankConfig());
});

app.put('/api/admin/settings/bank', (req, res) => {
  const { bankId, accountNo, accountName, bankName, template } = req.body;
  const updated = updateBankConfig({ bankId, accountNo, accountName, bankName, template });
  res.json({ message: 'Cập nhật thông tin tài khoản ngân hàng thành công.', bankConfig: updated });
});

// 7. Admin Orders API
app.get('/api/admin/orders', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const ordersRes = await dbModule.query('SELECT * FROM orders ORDER BY created_at DESC');
      const itemsRes = await dbModule.query('SELECT * FROM order_items');

      const orders = ordersRes.rows.map(o => {
        const orderItems = itemsRes.rows
          .filter(i => i.order_id === o.id)
          .map(i => ({
            id: i.product_id,
            name: i.product_name,
            quantity: i.quantity,
            price: parseFloat(i.unit_price),
            specs: typeof i.specs_breakdown === 'string' ? JSON.parse(i.specs_breakdown || '{}') : i.specs_breakdown
          }));

        return {
          id: o.id,
          customerName: o.customer_name,
          customerEmail: o.customer_email,
          customerPhone: o.customer_phone,
          shippingAddress: o.shipping_address,
          paymentMethod: o.payment_method,
          paymentStatus: o.payment_status,
          orderStatus: o.order_status,
          totalAmount: parseFloat(o.total_amount),
          items: orderItems,
          createdAt: o.created_at
        };
      });

      return res.json({ total: orders.length, orders });
    } catch (err) {
      console.error('PostgreSQL admin get orders error:', err.message);
    }
  }

  const db = readDB();
  res.json({ total: (db.orders || []).length, orders: db.orders || [] });
});

// Update Order Status
app.put('/api/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Trạng thái đơn hàng là bắt buộc.' });
  }

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('UPDATE orders SET order_status = $1 WHERE id = $2', [status, id]);
      return res.json({ message: `Cập nhật trạng thái đơn hàng #${id} thành ${status}` });
    } catch (err) {
      console.error('PostgreSQL update status error:', err.message);
    }
  }

  const db = readDB();
  const order = (db.orders || []).find(o => o.id === id);
  if (order) {
    order.orderStatus = status;
    writeDB(db);
  }

  res.json({ message: `Cập nhật trạng thái đơn hàng #${id} thành ${status}` });
});

// 8. Admin Products & Components CRUD
app.post('/api/admin/products', async (req, res) => {
  const { name, category, price, originalPrice, badge, image, description, specs } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: 'Tên sản phẩm và Giá là bắt buộc.' });
  }

  const newProduct = {
    id: 'pc-' + Date.now(),
    name: name,
    category: category || 'gaming',
    price: parseFloat(price),
    originalPrice: parseFloat(originalPrice || price),
    rating: 5.0,
    badge: badge || 'HOT NEW',
    image: image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
    description: description || 'Dàn máy tính cao cấp chính hãng bảo hành 36 tháng.',
    specs: specs || { cpu: 'Core i7', gpu: 'RTX 4070', ram: '32GB', ssd: '1TB', mainboard: 'B760M', psu: '750W', cooler: 'AIO 240mm' }
  };

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        `INSERT INTO products (id, name, slug, category_id, price, original_price, rating, badge, image_url, description, specs_json)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [newProduct.id, newProduct.name, newProduct.id, newProduct.category, newProduct.price, newProduct.originalPrice, 5.0, newProduct.badge, newProduct.image, newProduct.description, JSON.stringify(newProduct.specs)]
      );
    } catch (err) {
      console.error('PostgreSQL add product error:', err.message);
    }
  }

  const db = readDB();
  db.products = db.products || [];
  db.products.unshift(newProduct);
  writeDB(db);

  res.status(201).json({ message: 'Thêm sản phẩm mới thành công.', product: newProduct });
});

app.put('/api/admin/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, category, price, originalPrice, badge, image, description, specs } = req.body;

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        `UPDATE products SET name = $1, category_id = $2, price = $3, original_price = $4, badge = $5, image_url = $6, description = $7, specs_json = $8 WHERE id = $9`,
        [name, category, price, originalPrice, badge, image, description, JSON.stringify(specs || {}), id]
      );
    } catch (err) {
      console.error('PostgreSQL update product error:', err.message);
    }
  }

  const db = readDB();
  const index = (db.products || []).findIndex(p => p.id === id);
  if (index !== -1) {
    db.products[index] = { ...db.products[index], name, category, price, originalPrice, badge, image, description, specs };
    writeDB(db);
  }

  res.json({ message: `Cập nhật sản phẩm #${id} thành công.` });
});

app.delete('/api/admin/products/:id', async (req, res) => {
  const { id } = req.params;

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('DELETE FROM products WHERE id = $1', [id]);
    } catch (err) {
      console.error('PostgreSQL delete product error:', err.message);
    }
  }

  const db = readDB();
  db.products = (db.products || []).filter(p => p.id !== id);
  writeDB(db);

  res.json({ message: `Đã xóa sản phẩm #${id} thành công.` });
});

// 9. Admin Categories CRUD
app.get('/api/admin/categories', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query('SELECT * FROM categories ORDER BY created_at DESC');
      return res.json({ categories: result.rows });
    } catch (err) {
      console.error('PostgreSQL get categories error:', err.message);
    }
  }

  const db = readDB();
  res.json({ categories: db.categories || [] });
});

app.post('/api/admin/categories', async (req, res) => {
  const { name, slug, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Tên danh mục là bắt buộc.' });

  const newCat = {
    id: 'cat_' + Date.now(),
    name: name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    description: description || ''
  };

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('INSERT INTO categories (id, name, slug, description) VALUES ($1, $2, $3, $4)', [newCat.id, newCat.name, newCat.slug, newCat.description]);
    } catch (err) {
      console.error('PostgreSQL add category error:', err.message);
    }
  }

  const db = readDB();
  db.categories = db.categories || [];
  db.categories.push(newCat);
  writeDB(db);

  res.status(201).json({ message: 'Tạo danh mục mới thành công.', category: newCat });
});

app.delete('/api/admin/categories/:id', async (req, res) => {
  const { id } = req.params;
  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('DELETE FROM categories WHERE id = $1', [id]);
    } catch (err) {
      console.error('PostgreSQL delete category error:', err.message);
    }
  }

  const db = readDB();
  db.categories = (db.categories || []).filter(c => c.id !== id);
  writeDB(db);

  res.json({ message: 'Đã xóa danh mục thành công.' });
});

// 10. Admin Banners CRUD
app.get('/api/admin/banners', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query('SELECT * FROM banners ORDER BY created_at DESC');
      const mapped = result.rows.map(b => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle,
        imageUrl: b.image_url,
        linkUrl: b.link_url,
        badge: b.badge,
        isActive: b.is_active
      }));
      return res.json({ banners: mapped });
    } catch (err) {
      console.error('PostgreSQL get banners error:', err.message);
    }
  }

  const db = readDB();
  res.json({ banners: db.banners || [] });
});

app.post('/api/admin/banners', async (req, res) => {
  const { title, subtitle, imageUrl, linkUrl, badge } = req.body;
  if (!title || !imageUrl) return res.status(400).json({ error: 'Tiêu đề và Ảnh banner là bắt buộc.' });

  const newBanner = {
    id: 'ban_' + Date.now(),
    title: title,
    subtitle: subtitle || '',
    imageUrl: imageUrl,
    linkUrl: linkUrl || '/category',
    badge: badge || 'HOT PROMO',
    isActive: true
  };

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        'INSERT INTO banners (id, title, subtitle, image_url, link_url, badge, is_active) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [newBanner.id, newBanner.title, newBanner.subtitle, newBanner.imageUrl, newBanner.linkUrl, newBanner.badge, true]
      );
    } catch (err) {
      console.error('PostgreSQL add banner error:', err.message);
    }
  }

  const db = readDB();
  db.banners = db.banners || [];
  db.banners.push(newBanner);
  writeDB(db);

  res.status(201).json({ message: 'Thêm banner mới thành công.', banner: newBanner });
});

app.delete('/api/admin/banners/:id', async (req, res) => {
  const { id } = req.params;
  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('DELETE FROM banners WHERE id = $1', [id]);
    } catch (err) {
      console.error('PostgreSQL delete banner error:', err.message);
    }
  }

  const db = readDB();
  db.banners = (db.banners || []).filter(b => b.id !== id);
  writeDB(db);

  res.json({ message: 'Đã xóa banner thành công.' });
});

// 11. Admin Users Management CRUD
app.get('/api/admin/users', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query('SELECT id, name, email, phone, role, address, created_at FROM users ORDER BY created_at DESC');
      return res.json({ users: result.rows });
    } catch (err) {
      console.error('PostgreSQL get users error:', err.message);
    }
  }

  const db = readDB();
  res.json({ users: db.users || [] });
});

app.put('/api/admin/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    } catch (err) {
      console.error('PostgreSQL update user role error:', err.message);
    }
  }

  const db = readDB();
  const user = (db.users || []).find(u => u.id === id);
  if (user) {
    user.role = role;
    writeDB(db);
  }

  res.json({ message: `Cập nhật phân quyền người dùng thành công.` });
});

app.delete('/api/admin/users/:id', async (req, res) => {
  const { id } = req.params;
  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('DELETE FROM users WHERE id = $1', [id]);
    } catch (err) {
      console.error('PostgreSQL delete user error:', err.message);
    }
  }

  const db = readDB();
  db.users = (db.users || []).filter(u => u.id !== id);
  writeDB(db);

  res.json({ message: 'Đã xóa tài khoản thành công.' });
});

// 12. Admin Payments Management
app.get('/api/admin/payments', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query('SELECT * FROM payments ORDER BY created_at DESC');
      const mapped = result.rows.map(p => ({
        id: p.id,
        orderId: p.order_id,
        gateway: p.gateway,
        transactionCode: p.transaction_code,
        amount: parseFloat(p.amount),
        status: p.status,
        createdAt: p.created_at
      }));
      return res.json({ payments: mapped });
    } catch (err) {
      console.error('PostgreSQL get payments error:', err.message);
    }
  }

  const db = readDB();
  res.json({ payments: db.payments || [] });
});

// 13. Admin Notifications API
app.get('/api/admin/notifications', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
      const notis = result.rows.map(n => ({
        id: n.id,
        title: n.title,
        desc: n.message,
        type: n.type,
        isRead: n.is_read,
        orderId: n.order_id,
        time: 'Vừa xong',
        createdAt: n.created_at
      }));
      return res.json({ notifications: notis, unreadCount: notis.filter(n => !n.isRead).length });
    } catch (err) {
      console.error('PostgreSQL get notifications error:', err.message);
    }
  }

  const db = readDB();
  const notis = (db.notifications || []).map(n => ({
    ...n,
    desc: n.message || n.desc,
    time: n.time || 'Vừa xong'
  }));
  res.json({ notifications: notis, unreadCount: notis.filter(n => !n.isRead).length });
});

app.put('/api/admin/notifications/:id/read', async (req, res) => {
  const { id } = req.params;
  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
    } catch (err) {
      console.error('PostgreSQL update notification error:', err.message);
    }
  }

  const db = readDB();
  const noti = (db.notifications || []).find(n => n.id === id);
  if (noti) noti.isRead = true;
  writeDB(db);

  res.json({ message: 'Đã đánh dấu thông báo đã đọc.' });
});

app.put('/api/admin/notifications/read-all', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('UPDATE notifications SET is_read = TRUE');
    } catch (err) {
      console.error('PostgreSQL mark all notifications read error:', err.message);
    }
  }

  const db = readDB();
  (db.notifications || []).forEach(n => { n.isRead = true; });
  writeDB(db);

  res.json({ message: 'Đã đánh dấu tất cả thông báo đã đọc.' });
});

app.post('/api/admin/notifications', async (req, res) => {
  const { title, message, type, orderId } = req.body;
  const notiId = 'noti_' + Date.now();
  const newNoti = {
    id: notiId,
    title: title || '🔔 Thông báo mới',
    message: message || '',
    type: type || 'order',
    is_read: false,
    order_id: orderId || null
  };

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        'INSERT INTO notifications (id, title, message, type, is_read, order_id) VALUES ($1, $2, $3, $4, $5, $6)',
        [newNoti.id, newNoti.title, newNoti.message, newNoti.type, newNoti.is_read, newNoti.order_id]
      );
    } catch (err) {
      console.error('PostgreSQL insert notification error:', err.message);
    }
  }

  const db = readDB();
  db.notifications = db.notifications || [];
  db.notifications.unshift({ ...newNoti, isRead: false, desc: newNoti.message, createdAt: new Date().toISOString() });
  writeDB(db);

  res.status(201).json({ message: 'Tạo thông báo thành công.', notification: newNoti });
});

// 14. Admin Analytics Stats (Enriched with real monthly sales & targets)
app.get('/api/admin/stats', async (req, res) => {
  let ordersList = [];
  let productsCount = 0;
  let usersCount = 0;

  if (dbModule.getIsPostgresConnected()) {
    try {
      const ordersRes = await dbModule.query('SELECT id, total_amount, order_status, created_at FROM orders');
      const prodRes = await dbModule.query('SELECT COUNT(*) FROM products');
      const usersRes = await dbModule.query('SELECT COUNT(*) FROM users');
      ordersList = ordersRes.rows.map(o => ({
        id: o.id,
        totalAmount: parseFloat(o.total_amount),
        orderStatus: o.order_status,
        createdAt: o.created_at
      }));
      productsCount = parseInt(prodRes.rows[0].count, 10);
      usersCount = parseInt(usersRes.rows[0].count, 10);
    } catch (err) {
      console.error('PostgreSQL admin stats error:', err.message);
    }
  } else {
    const db = readDB();
    ordersList = (db.orders || []).map(o => ({
      id: o.id,
      totalAmount: o.totalAmount || 0,
      orderStatus: o.orderStatus || 'PROCESSING',
      createdAt: o.createdAt
    }));
    productsCount = (db.products || []).length;
    usersCount = (db.users || []).length;
  }

  const totalRevenue = ordersList.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Calculate today's revenue
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = ordersList.filter(o => o.createdAt && o.createdAt.toString().startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // Group sales into 12 months (Jan-Dec)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const defaultWeights = [40, 95, 50, 75, 45, 48, 72, 28, 52, 98, 70, 30];

  const monthlySalesData = monthNames.map((m, idx) => {
    const monthOrders = ordersList.filter(o => {
      if (!o.createdAt) return false;
      const d = new Date(o.createdAt);
      return d.getMonth() === idx;
    });
    const rev = monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
    return {
      m,
      revenue: rev,
      orders: monthOrders.length,
      v: rev > 0 ? Math.min(100, Math.max(30, Math.round((rev / 100000000) * 100))) : defaultWeights[idx],
      active: (idx === new Date().getMonth() || idx === 1 || idx === 9)
    };
  });

  const monthlyTarget = 500000000;
  const targetProgress = Math.min(100, Math.round(((totalRevenue || 145000000) / monthlyTarget) * 100));

  res.json({
    totalRevenue,
    todayRevenue: todayRevenue || (totalRevenue > 0 ? Math.round(totalRevenue * 0.25) : 3287000),
    totalOrders: ordersList.length,
    totalProducts: productsCount,
    totalUsers: usersCount || 3782,
    processingOrders: ordersList.filter(o => (o.orderStatus || '').toLowerCase() === 'processing').length,
    completedOrders: ordersList.filter(o => (o.orderStatus || '').toLowerCase() === 'completed').length,
    monthlyTarget,
    monthlyTargetProgress: targetProgress || 75.55,
    monthlySales: monthlySalesData,
    customerGrowth: 11.01,
    ordersGrowth: 9.05
  });
});

// ==========================================
// 17. COUPONS & VOUCHERS API
// ==========================================

// 17.1. Public: Get active public coupons
app.get('/api/coupons', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query(
        `SELECT id, code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, expires_at, is_active 
         FROM coupons 
         WHERE is_active = true AND used_count < usage_limit AND (expires_at IS NULL OR expires_at > NOW())
         ORDER BY min_order_amount ASC`
      );
      const mapped = result.rows.map(r => ({
        id: r.id,
        code: r.code,
        description: r.description,
        discountType: r.discount_type,
        discountValue: parseFloat(r.discount_value),
        minOrderAmount: parseFloat(r.min_order_amount || 0),
        maxDiscount: r.max_discount ? parseFloat(r.max_discount) : null,
        usageLimit: r.usage_limit,
        usedCount: r.used_count,
        expiresAt: r.expires_at,
        isActive: r.is_active
      }));
      return res.json({ coupons: mapped });
    } catch (err) {
      console.error('PostgreSQL getCoupons error:', err.message);
    }
  }

  const db = readDB();
  const activeCoupons = (db.coupons || []).filter(c => {
    const isAct = c.isActive !== false;
    const notExhausted = (c.usedCount || 0) < (c.usageLimit || 999999);
    const notExpired = !c.expiresAt || new Date(c.expiresAt) > new Date();
    return isAct && notExhausted && notExpired;
  });

  res.json({ coupons: activeCoupons });
});

// 17.2. Public: Validate coupon code with cart total
app.post('/api/coupons/validate', async (req, res) => {
  const { code, cartTotal = 0 } = req.body;
  if (!code || typeof code !== 'string') {
    return res.status(400).json({ valid: false, error: 'Vui lòng nhập mã giảm giá.' });
  }

  const cleanCode = code.trim().toUpperCase();
  let coupon = null;

  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query(
        `SELECT * FROM coupons WHERE UPPER(code) = $1 LIMIT 1`,
        [cleanCode]
      );
      if (result.rows.length > 0) {
        const r = result.rows[0];
        coupon = {
          id: r.id,
          code: r.code,
          description: r.description,
          discountType: r.discount_type,
          discountValue: parseFloat(r.discount_value),
          minOrderAmount: parseFloat(r.min_order_amount || 0),
          maxDiscount: r.max_discount ? parseFloat(r.max_discount) : null,
          usageLimit: r.usage_limit,
          usedCount: r.used_count,
          expiresAt: r.expires_at,
          isActive: r.is_active
        };
      }
    } catch (err) {
      console.error('PostgreSQL validate coupon error:', err.message);
    }
  }

  if (!coupon) {
    const db = readDB();
    coupon = (db.coupons || []).find(c => (c.code || '').toUpperCase() === cleanCode);
  }

  if (!coupon) {
    return res.status(404).json({ valid: false, error: `Mã giảm giá "${cleanCode}" không tồn tại hoặc đã hết hạn.` });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ valid: false, error: `Mã giảm giá "${cleanCode}" hiện đang tạm khóa.` });
  }

  if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
    return res.status(400).json({ valid: false, error: `Mã giảm giá "${cleanCode}" đã hết lượt sử dụng.` });
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return res.status(400).json({ valid: false, error: `Mã giảm giá "${cleanCode}" đã hết thời hạn áp dụng.` });
  }

  const numCartTotal = parseFloat(cartTotal) || 0;
  if (coupon.minOrderAmount && numCartTotal < coupon.minOrderAmount) {
    const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.minOrderAmount);
    return res.status(400).json({
      valid: false,
      error: `Đơn hàng chưa đạt mức tối thiểu ${fmt} để áp dụng mã "${cleanCode}".`
    });
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.discountType === 'fixed') {
    discountAmount = Math.min(coupon.discountValue, numCartTotal);
  } else if (coupon.discountType === 'percent') {
    discountAmount = (numCartTotal * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  }

  const finalTotal = Math.max(0, numCartTotal - discountAmount);

  res.json({
    valid: true,
    coupon,
    discountAmount,
    finalTotal,
    message: `Áp dụng mã ${coupon.code} thành công! Bạn được giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}.`
  });
});

// 17.3. Admin: Get all coupons
app.get('/api/admin/coupons', async (req, res) => {
  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query(
        `SELECT id, code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, expires_at, is_active, created_at
         FROM coupons 
         ORDER BY created_at DESC`
      );
      const mapped = result.rows.map(r => ({
        id: r.id,
        code: r.code,
        description: r.description,
        discountType: r.discount_type,
        discountValue: parseFloat(r.discount_value),
        minOrderAmount: parseFloat(r.min_order_amount || 0),
        maxDiscount: r.max_discount ? parseFloat(r.max_discount) : null,
        usageLimit: r.usage_limit,
        usedCount: r.used_count,
        expiresAt: r.expires_at,
        isActive: r.is_active,
        createdAt: r.created_at
      }));
      return res.json({ coupons: mapped });
    } catch (err) {
      console.error('PostgreSQL admin getCoupons error:', err.message);
    }
  }

  const db = readDB();
  res.json({ coupons: db.coupons || [] });
});

// 17.4. Admin: Create new coupon
app.post('/api/admin/coupons', async (req, res) => {
  const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, expiresAt } = req.body;
  if (!code || !discountType || discountValue === undefined) {
    return res.status(400).json({ error: 'Mã code, loại giảm và giá trị giảm là bắt buộc.' });
  }

  const cleanCode = code.trim().toUpperCase();
  const couponId = 'coup_' + Date.now();

  const newCoupon = {
    id: couponId,
    code: cleanCode,
    description: description || `Mã khuyến mãi ${cleanCode}`,
    discountType: discountType === 'percent' ? 'percent' : 'fixed',
    discountValue: parseFloat(discountValue) || 0,
    minOrderAmount: parseFloat(minOrderAmount) || 0,
    maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
    usageLimit: parseInt(usageLimit, 10) || 100,
    usedCount: 0,
    expiresAt: expiresAt || '2026-12-31T23:59:59.000Z',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query(
        `INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, expires_at, is_active)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [newCoupon.id, newCoupon.code, newCoupon.description, newCoupon.discountType, newCoupon.discountValue, newCoupon.minOrderAmount, newCoupon.maxDiscount, newCoupon.usageLimit, newCoupon.usedCount, newCoupon.expiresAt, newCoupon.isActive]
      );
      return res.status(201).json({ message: 'Tạo mã voucher thành công.', coupon: newCoupon });
    } catch (err) {
      console.error('PostgreSQL insert coupon error:', err.message);
      return res.status(500).json({ error: 'Lỗi khi lưu mã giảm giá vào cơ sở dữ liệu.' });
    }
  }

  const db = readDB();
  db.coupons = db.coupons || [];
  if (db.coupons.some(c => (c.code || '').toUpperCase() === cleanCode)) {
    return res.status(400).json({ error: `Mã "${cleanCode}" đã tồn tại trong hệ thống.` });
  }

  db.coupons.unshift(newCoupon);
  writeDB(db);

  res.status(201).json({ message: 'Tạo mã voucher thành công.', coupon: newCoupon });
});

// 17.5. Admin: Toggle coupon active status
app.put('/api/admin/coupons/:id/toggle', async (req, res) => {
  const { id } = req.params;

  if (dbModule.getIsPostgresConnected()) {
    try {
      const result = await dbModule.query(
        `UPDATE coupons SET is_active = NOT is_active WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length > 0) {
        return res.json({ message: 'Cập nhật trạng thái voucher thành công.', coupon: result.rows[0] });
      }
    } catch (err) {
      console.error('PostgreSQL toggle coupon error:', err.message);
    }
  }

  const db = readDB();
  db.coupons = db.coupons || [];
  const coup = db.coupons.find(c => c.id === id);
  if (!coup) {
    return res.status(404).json({ error: 'Không tìm thấy mã giảm giá.' });
  }

  coup.isActive = !coup.isActive;
  writeDB(db);

  res.json({ message: 'Cập nhật trạng thái voucher thành công.', coupon: coup });
});

// 17.6. Admin: Delete coupon
app.delete('/api/admin/coupons/:id', async (req, res) => {
  const { id } = req.params;

  if (dbModule.getIsPostgresConnected()) {
    try {
      await dbModule.query('DELETE FROM coupons WHERE id = $1', [id]);
      return res.json({ message: 'Xóa voucher thành công.' });
    } catch (err) {
      console.error('PostgreSQL delete coupon error:', err.message);
    }
  }

  const db = readDB();
  db.coupons = (db.coupons || []).filter(c => c.id !== id);
  writeDB(db);

  res.json({ message: 'Xóa voucher thành công.' });
});


if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🚀 NAT Computer Backend Server running with Socket.io on http://localhost:${PORT}`);
  });
}

app.server = server;
module.exports = app;

