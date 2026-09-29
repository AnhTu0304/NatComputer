const ProductModel = require('../models/ProductModel');
const OrderModel = require('../models/OrderModel');
const UserModel = require('../models/UserModel');
const PaymentModel = require('../models/PaymentModel');
const NotificationModel = require('../models/NotificationModel');
const CouponModel = require('../models/CouponModel');
const AuditModel = require('../models/AuditModel');
const InventoryModel = require('../models/InventoryModel');
const CacheService = require('../services/cacheService');
const { getBankConfig, updateBankConfig } = require('../services/vietqrHelper');
const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class AdminController {
  // Bank Settings
  static getBankSettings(req, res) {
    res.json(getBankConfig());
  }

  static updateBankSettings(req, res) {
    const { bankId, accountNo, accountName, bankName, template } = req.body;
    const updated = updateBankConfig({ bankId, accountNo, accountName, bankName, template });
    res.json({ message: 'Cập nhật thông tin tài khoản ngân hàng thành công.', bankConfig: updated });
  }

  // Orders
  static async getOrders(req, res) {
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
  }

  static async updateOrderStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Trạng thái đơn hàng là bắt buộc.' });
    }

    await OrderModel.updateStatus(id, status);
    res.json({ message: `Cập nhật trạng thái đơn hàng #${id} thành ${status}` });
  }

  static async confirmOrderPaymentManually(req, res) {
    const { id } = req.params;
    const order = await OrderModel.getById(id);
    if (!order) {
      return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
    }

    if (order.paymentStatus === 'PAID') {
      return res.json({
        success: true,
        message: 'Đơn hàng đã được thanh toán trước đó.',
        order
      });
    }

    const txnCode = `MANUAL-ADMIN-${Date.now()}`;
    const result = await OrderModel.updatePaymentSuccess(id, txnCode);

    // Broadcast realtime socket event
    try {
      const { notifyPaymentSuccess } = require('../services/socketManager');
      notifyPaymentSuccess(id, {
        amount: order.totalAmount || 0,
        transactionCode: txnCode,
        bankCode: 'MBBank'
      });
    } catch (e) {}

    // Send invoice email asynchronously after 4s wait
    try {
      const { queueInvoiceEmailAsync } = require('../services/emailService');
      queueInvoiceEmailAsync({ ...order, paymentStatus: 'PAID' }, 4000);
    } catch (e) {}

    res.json({
      success: true,
      message: `Đã xác nhận nhận tiền thành công cho đơn hàng #${id}`,
      order: result?.order || order
    });
  }

  // Stats & Analytics
  static async getStats(req, res) {
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

    const todayStr = new Date().toISOString().split('T')[0];
    const todayOrders = ordersList.filter(o => o.createdAt && o.createdAt.toString().startsWith(todayStr));
    const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

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
  }

  // Products CRUD
  static async createProduct(req, res) {
    const { name, category, price, originalPrice, badge, image, description, specs } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Tên sản phẩm và Giá là bắt buộc.' });
    }

    const newProduct = {
      id: 'pc-' + Date.now(),
      name,
      category: category || 'gaming',
      price: parseFloat(price),
      originalPrice: parseFloat(originalPrice || price),
      badge: badge || 'HOT NEW',
      image: image || 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80',
      description: description || 'Dàn máy tính cao cấp chính hãng bảo hành 36 tháng.',
      specs: specs !== undefined && specs !== null ? specs : {}
    };

    const created = await ProductModel.create(newProduct);
    CacheService.delPrefix('api:products');
    CacheService.delPrefix('ai:query:');
    res.status(201).json({ message: 'Thêm sản phẩm mới thành công.', product: created });
  }

  static async updateProduct(req, res) {
    const { id } = req.params;
    const updated = await ProductModel.update(id, req.body);
    CacheService.delPrefix('api:products');
    CacheService.delPrefix('ai:query:');
    res.json({ message: `Cập nhật sản phẩm #${id} thành công.`, product: updated });
  }

  static async deleteProduct(req, res) {
    const { id } = req.params;
    await ProductModel.delete(id);
    CacheService.delPrefix('api:products');
    CacheService.delPrefix('ai:query:');
    res.json({ message: `Đã xóa sản phẩm #${id} thành công.` });
  }

  // Categories CRUD
  static async getCategories(req, res) {
    const categories = await ProductModel.getCategories();
    res.json({ categories });
  }

  static async createCategory(req, res) {
    const { name, slug, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Tên danh mục là bắt buộc.' });

    const newCat = {
      id: 'cat_' + Date.now(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || ''
    };

    const created = await ProductModel.createCategory(newCat);
    CacheService.delPrefix('api:categories');
    CacheService.delPrefix('api:products');
    res.status(201).json({ message: 'Thêm danh mục mới thành công.', category: created });
  }

  static async deleteCategory(req, res) {
    const { id } = req.params;
    await ProductModel.deleteCategory(id);
    CacheService.delPrefix('api:categories');
    CacheService.delPrefix('api:products');
    res.json({ message: 'Xóa danh mục thành công.' });
  }

  // Banners CRUD
  static async getBanners(req, res) {
    const banners = await ProductModel.getBanners();
    res.json({ banners });
  }

  static async createBanner(req, res) {
    const { title, subtitle, imageUrl, linkUrl, badge } = req.body;
    if (!title || !imageUrl) return res.status(400).json({ error: 'Tiêu đề và Ảnh banner là bắt buộc.' });

    const newBanner = {
      id: 'ban_' + Date.now(),
      title,
      subtitle: subtitle || '',
      imageUrl,
      linkUrl: linkUrl || '/category',
      badge: badge || 'HOT PROMO',
      isActive: true
    };

    const created = await ProductModel.createBanner(newBanner);
    CacheService.delPrefix('api:banners');
    res.status(201).json({ message: 'Thêm banner mới thành công.', banner: created });
  }

  static async deleteBanner(req, res) {
    const { id } = req.params;
    await ProductModel.deleteBanner(id);
    CacheService.delPrefix('api:banners');
    res.json({ message: 'Đã xóa banner thành công.' });
  }

  // Users CRUD
  static async getUsers(req, res) {
    const users = await UserModel.getAll();
    res.json({ users });
  }

  static async deleteUser(req, res) {
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
  }

  // Notifications
  static async getNotifications(req, res) {
    const data = await NotificationModel.getAll();
    res.json(data);
  }

  static async markNotificationRead(req, res) {
    const { id } = req.params;
    await NotificationModel.markRead(id);
    res.json({ message: 'Đã đánh dấu thông báo đã đọc.' });
  }

  static async markAllNotificationsRead(req, res) {
    await NotificationModel.markAllRead();
    res.json({ message: 'Đã đánh dấu tất cả thông báo đã đọc.' });
  }

  // Payments
  static async getPayments(req, res) {
    const payments = await PaymentModel.getAll();
    res.json({ payments });
  }

  // Coupons CRUD
  static async getCoupons(req, res) {
    const coupons = await CouponModel.getAll();
    res.json({ coupons });
  }

  static async createCoupon(req, res) {
    const { code, description, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, expiresAt } = req.body;
    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({ error: 'Mã code, loại giảm và giá trị giảm là bắt buộc.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const existing = await CouponModel.findByCode(cleanCode);
    if (existing) {
      return res.status(400).json({ error: `Mã "${cleanCode}" đã tồn tại trong hệ thống.` });
    }

    const couponId = 'coup_' + Date.now();
    const newCoupon = {
      id: couponId,
      code: cleanCode,
      description: description || 'Ưu đãi dành riêng cho khách hàng NAT Computer',
      discountType,
      discountValue: parseFloat(discountValue),
      minOrderAmount: parseFloat(minOrderAmount || 0),
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      usageLimit: usageLimit ? parseInt(usageLimit, 10) : 100,
      usedCount: 0,
      expiresAt: expiresAt || null,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const created = await CouponModel.create(newCoupon);
    res.status(201).json({ message: 'Tạo mã voucher thành công.', coupon: created });
  }

  static async toggleCoupon(req, res) {
    const { id } = req.params;
    const toggled = await CouponModel.toggle(id);
    if (!toggled) {
      return res.status(404).json({ error: 'Không tìm thấy mã giảm giá.' });
    }
    res.json({ message: 'Cập nhật trạng thái voucher thành công.', coupon: toggled });
  }

  static async deleteCoupon(req, res) {
    const { id } = req.params;
    await CouponModel.delete(id);
    res.json({ message: 'Xóa voucher thành công.' });
  }

  // Audit Trail
  static async getOrderAuditTrail(req, res) {
    try {
      const { id } = req.params;
      const logs = await AuditModel.getLogsByOrderId(id);
      res.json({ orderId: id, total: logs.length, auditLogs: logs });
    } catch (err) {
      console.error('Lỗi lấy lịch sử audit đơn hàng:', err.message);
      res.status(500).json({ error: 'Không thể tải lịch sử đơn hàng.' });
    }
  }

  // Inventory Logs
  static async getInventoryLogs(req, res) {
    try {
      const { productId, limit } = req.query;
      if (productId) {
        const logs = await InventoryModel.getLogsByProductId(productId, parseInt(limit, 10) || 50);
        return res.json({ productId, total: logs.length, logs });
      }

      if (dbModule.getIsPostgresConnected()) {
        const resLogs = await dbModule.query(
          `SELECT l.*, p.name as product_name, p.image_url 
           FROM inventory_logs l
           LEFT JOIN products p ON l.product_id = p.id
           ORDER BY l.created_at DESC
           LIMIT $1`,
          [parseInt(limit, 10) || 100]
        );
        return res.json({ total: resLogs.rows.length, logs: resLogs.rows });
      }

      const db = readDB();
      const logs = (db.inventory_logs || []).slice(0, parseInt(limit, 10) || 100);
      res.json({ total: logs.length, logs });
    } catch (err) {
      console.error('Lỗi lấy lịch sử kho hàng:', err.message);
      res.status(500).json({ error: 'Không thể tải lịch sử tồn kho.' });
    }
  }

  // Sent Emails
  static async getSentEmails(req, res) {
    try {
      const { orderId, limit } = req.query;
      if (dbModule.getIsPostgresConnected()) {
        let q = 'SELECT * FROM sent_emails';
        const params = [];
        if (orderId) {
          params.push(orderId);
          q += ' WHERE order_id = $1';
        }
        params.push(parseInt(limit, 10) || 100);
        q += ` ORDER BY created_at DESC LIMIT $${params.length}`;
        const resEmails = await dbModule.query(q, params);
        return res.json({ total: resEmails.rows.length, emails: resEmails.rows });
      }

      const db = readDB();
      let emails = db.sent_emails || [];
      if (orderId) {
        emails = emails.filter(e => e.orderId === orderId);
      }
      res.json({ total: emails.length, emails: emails.slice(0, parseInt(limit, 10) || 100) });
    } catch (err) {
      console.error('Lỗi lấy danh sách emails đã gửi:', err.message);
      res.status(500).json({ error: 'Không thể tải danh sách emails.' });
    }
  }
}

module.exports = AdminController;
