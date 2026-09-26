const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Helper to get Authorization headers from localStorage
 */
export function getAuthHeaders() {
  try {
    const raw = localStorage.getItem('nat_user');
    if (raw) {
      const user = JSON.parse(raw);
      if (user && user.token) {
        return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        };
      }
    }
  } catch (e) {}
  return { 'Content-Type': 'application/json' };
}

// Client-side Memory + SessionStorage Cache Manager
const clientCache = new Map();
const CACHE_PREFIX = 'nat_cache_';

export function getCached(key) {
  // 1. Check in-memory Map
  if (clientCache.has(key)) {
    const item = clientCache.get(key);
    if (Date.now() < item.expiresAt) {
      return item.data;
    }
    clientCache.delete(key);
  }

  // 2. Check sessionStorage fallback
  try {
    const raw = sessionStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() < parsed.expiresAt) {
        clientCache.set(key, parsed);
        return parsed.data;
      }
      sessionStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }
  } catch (e) {}

  return null;
}

export function setCached(key, data, ttlMs = 120000) {
  const expiresAt = Date.now() + ttlMs;
  const item = { data, expiresAt };
  clientCache.set(key, item);
  try {
    sessionStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  } catch (e) {}
}

export function clearClientCache(prefix = '') {
  if (!prefix) {
    clientCache.clear();
    try {
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith(CACHE_PREFIX)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach(k => sessionStorage.removeItem(k));
    } catch (e) {}
    return;
  }

  for (const k of clientCache.keys()) {
    if (k.startsWith(prefix)) clientCache.delete(k);
  }
  try {
    const fullPrefix = `${CACHE_PREFIX}${prefix}`;
    const keysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith(fullPrefix)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach(k => sessionStorage.removeItem(k));
  } catch (e) {}
}

/**
 * NAT Computer Backend Service Client
 */
export const api = {
  // Cache Management
  clearCache: (prefix) => clearClientCache(prefix),
  // Check backend server health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return await res.json();
    } catch {
      return { status: 'OFFLINE' };
    }
  },

  // Auth: Login
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data && data.user && data.token) {
        data.user.token = data.token;
      }
      return data;
    } catch (err) {
      return { error: 'Không thể kết nối đến Server Backend.' };
    }
  },

  // Auth: Register
  async register(name, email, phone, password) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      const data = await res.json();
      if (data && data.user && data.token) {
        data.user.token = data.token;
      }
      return data;
    } catch (err) {
      return { error: 'Không thể kết nối đến Server Backend.' };
    }
  },

  // Auth: Google Sign-in
  async loginWithGoogle(credential, profile = null) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, profile })
      });
      const data = await res.json();
      if (data && data.user && data.token) {
        data.user.token = data.token;
      }
      return data;
    } catch (err) {
      return { error: 'Không thể kết nối máy chủ Google OAuth.' };
    }
  },

  // Products: Get catalog (Client SWR Cached)
  async getProducts(category = '', search = '', forceFresh = false) {
    const cacheKey = `products_${category || 'all'}_${search || 'all'}`;
    if (!forceFresh) {
      const cached = getCached(cacheKey);
      if (cached) return cached;
    }

    try {
      const query = new URLSearchParams({ category, search }).toString();
      const res = await fetch(`${API_BASE_URL}/products?${query}`);
      const data = await res.json();
      if (data && data.products) {
        setCached(cacheKey, data, 120000); // 2 minutes client cache
      }
      return data;
    } catch (err) {
      return { products: [] };
    }
  },

  // Orders: Create & process payment
  async createOrder(orderPayload) {
    try {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      return await res.json();
    } catch (err) {
      return { error: 'Lỗi kết nối khi gửi đơn hàng.' };
    }
  },

  // AI: Chat with Gemini Hardware Advisor
  async sendAiChat(message, history = []) {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });
      return await res.json();
    } catch (err) {
      return {
        success: false,
        error: 'Lỗi kết nối tới Trợ lý AI.',
        reply: 'Rất tiếc, kết nối tới hệ thống AI tạm thời gián đoạn. Bạn vui lòng thử lại sau giây lát!'
      };
    }
  },

  // Email: Send invoice
  async sendInvoiceEmail(recipientEmail, orderId, invoiceDetails) {
    try {
      const res = await fetch(`${API_BASE_URL}/email/send-invoice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail, orderId, invoiceDetails })
      });
      return await res.json();
    } catch (err) {
      return { error: 'Không thể gửi email hóa đơn.' };
    }
  },

  // Admin: Get all orders
  async getAdminOrders() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { orders: [] };
    }
  },

  // Admin: Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi cập nhật trạng thái đơn hàng.' };
    }
  },

  // Admin: Manually confirm order payment (fallback)
  async confirmAdminOrderPayment(orderId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/confirm-payment`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi xác nhận thanh toán đơn hàng.' };
    }
  },

  // Admin: Add new product
  async addAdminProduct(productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi thêm sản phẩm mới.' };
    }
  },

  // Admin: Delete product
  async deleteAdminProduct(productId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi xóa sản phẩm.' };
    }
  },

  // Admin: Get stats
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { totalRevenue: 0, totalOrders: 0, totalProducts: 0, totalUsers: 0, processingOrders: 0, completedOrders: 0 };
    }
  },

  // Admin: Categories CRUD
  async getAdminCategories() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { categories: [] };
    }
  },

  async addAdminCategory(catData) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(catData)
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi thêm danh mục.' };
    }
  },

  async deleteAdminCategory(catId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/categories/${catId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi xóa danh mục.' };
    }
  },

  // Admin: Banners CRUD
  async getAdminBanners() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/banners`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { banners: [] };
    }
  },

  async addAdminBanner(bannerData) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/banners`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bannerData)
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi thêm banner.' };
    }
  },

  async deleteAdminBanner(bannerId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/banners/${bannerId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi xóa banner.' };
    }
  },

  // Admin: Users CRUD
  async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { users: [] };
    }
  },

  async updateUserRole(userId, role) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ role })
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi cập nhật quyền người dùng.' };
    }
  },

  async deleteAdminUser(userId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi xóa tài khoản.' };
    }
  },

  // Admin: Update Product
  async updateAdminProduct(productId, productData) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      clearClientCache();
      return data;
    } catch {
      return { error: 'Lỗi khi cập nhật sản phẩm.' };
    }
  },

  // Admin: Notifications
  async getAdminNotifications() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { notifications: [], unreadCount: 0 };
    }
  },

  async markNotificationRead(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi cập nhật thông báo.' };
    }
  },

  async markAllNotificationsRead() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications/read-all`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi cập nhật thông báo.' };
    }
  },

  async createAdminNotification(data) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/notifications`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi tạo thông báo.' };
    }
  },

  // Admin: Payments
  async getAdminPayments() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/payments`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { payments: [] };
    }
  },

  // Coupons / Vouchers: Public
  async getPublicCoupons() {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons`);
      return await res.json();
    } catch {
      return { coupons: [] };
    }
  },

  async validateCoupon(code, cartTotal) {
    try {
      const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal })
      });
      return await res.json();
    } catch {
      return { valid: false, error: 'Không thể kết nối máy chủ để kiểm tra mã giảm giá.' };
    }
  },

  // Coupons / Vouchers: Admin
  async getAdminCoupons() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { coupons: [] };
    }
  },

  async addAdminCoupon(couponData) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(couponData)
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi tạo mã giảm giá mới.' };
    }
  },

  async toggleAdminCoupon(couponId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons/${couponId}/toggle`, {
        method: 'PUT',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi cập nhật trạng thái voucher.' };
    }
  },

  async deleteAdminCoupon(couponId) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/coupons/${couponId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi xóa mã giảm giá.' };
    }
  },

  // Bank Info & VietQR
  async getBankInfo(amount = 0, orderId = '') {
    try {
      const query = new URLSearchParams({ amount: String(amount), orderId }).toString();
      const res = await fetch(`${API_BASE_URL}/payment/bank-info?${query}`);
      return await res.json();
    } catch {
      return {
        bankId: 'MB',
        accountNo: '0773071629',
        accountName: 'NGO ANH TU',
        bankName: 'Ngân hàng Quân Đội (MBBank)'
      };
    }
  },

  async getAdminBankSettings() {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings/bank`, {
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  async updateAdminBankSettings(bankConfig) {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/settings/bank`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(bankConfig)
      });
      return await res.json();
    } catch {
      return { error: 'Lỗi khi cập nhật thông tin tài khoản ngân hàng.' };
    }
  },

  // Realtime VietQR Simulation Webhook
  async simulatePaymentWebhook(orderId, amount, transactionCode = '') {
    try {
      const res = await fetch(`${API_BASE_URL}/payment/simulate-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, amount, transactionCode })
      });
      return await res.json();
    } catch (err) {
      return { error: err.message };
    }
  }
};

export default api;



