const request = require('supertest');
const app = require('./server');
const dbModule = require('./db');

describe('Backend Database Integration & New Tables API Tests', () => {
  let adminToken = '';
  let customerToken = '';
  let customerUser = null;
  let testProductId = 'pc-gaming-ultra-4070ti';

  beforeAll(async () => {
    // Wait for PostgreSQL pool to initialize
    for (let i = 0; i < 20; i++) {
      if (dbModule.getIsPostgresConnected()) break;
      await new Promise(r => setTimeout(r, 100));
    }

    // 1. Login Admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin', password: '123' });
    adminToken = adminRes.body.token;

    // 2. Register / Login Customer
    const testEmail = `cust_integration_${Date.now()}@nat.vn`;
    const custRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration Customer',
        email: testEmail,
        phone: '0912345678',
        password: 'Password@123'
      });
    customerToken = custRes.body.token;
    customerUser = custRes.body.user;
  });

  afterAll(async () => {
    await new Promise(r => setTimeout(r, 100));
    try {
      await dbModule.pool.end();
    } catch (e) {}
  });

  // --- REVIEW ENDPOINTS ---
  test('POST /api/products/:id/reviews should reject unauthenticated request with 401', async () => {
    const res = await request(app)
      .post(`/api/products/${testProductId}/reviews`)
      .send({ rating: 5, comment: 'Nice PC!' });
    expect(res.status).toBe(401);
  });

  test('POST /api/products/:id/reviews should validate rating range (1-5)', async () => {
    const res = await request(app)
      .post(`/api/products/${testProductId}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ rating: 10, comment: 'Over 5 stars' });
    expect(res.status).toBe(400);
    expect(res.body.error).toContain('Số sao');
  });

  test('POST /api/products/:id/reviews should succeed and trigger recalculation of product rating', async () => {
    // Submit 5-star review
    const res = await request(app)
      .post(`/api/products/${testProductId}/reviews`)
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        rating: 5,
        comment: 'Dàn máy cực mạnh, chiến game 4K mượt mà!'
      });

    expect(res.status).toBe(201);
    expect(res.body.review).toBeDefined();
    expect(res.body.review.rating).toBe(5);

    // Fetch reviews list
    const listRes = await request(app).get(`/api/products/${testProductId}/reviews`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.reviews.length).toBeGreaterThan(0);
    expect(listRes.body.reviews.some(r => r.comment.includes('Dàn máy cực mạnh'))).toBe(true);

    // Verify product rating in DB
    const prodRes = await request(app).get(`/api/products/${testProductId}`);
    expect(prodRes.status).toBe(200);
    expect(prodRes.body.product.reviewsCount).toBeGreaterThan(0);
  });

  // --- ADMIN AUDIT & INVENTORY LOGS ---
  test('GET /api/admin/orders/:id/audit should return audit trail for order', async () => {
    // 1. Create order
    const orderId = `NAT-AUDIT-${Date.now()}`;
    await request(app)
      .post('/api/orders')
      .send({
        orderId: orderId,
        customerName: 'Audit Test Client',
        customerEmail: 'audit@client.com',
        customerPhone: '0988776655',
        shippingAddress: 'Cau Giay, Hanoi',
        paymentMethod: 'vietqr',
        paymentStatus: 'PENDING',
        totalAmount: 45900000,
        items: [{ id: testProductId, name: 'NAT GAMING BEAST', quantity: 1, price: 45900000 }]
      });

    // 2. Change order status via admin (triggers fn_audit_order_status_change)
    await request(app)
      .put(`/api/admin/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'DELIVERED' });

    // 3. Fetch audit trail
    const auditRes = await request(app)
      .get(`/api/admin/orders/${orderId}/audit`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(auditRes.status).toBe(200);
    expect(auditRes.body.orderId).toBe(orderId);
    expect(Array.isArray(auditRes.body.auditLogs)).toBe(true);
    expect(auditRes.body.auditLogs.length).toBeGreaterThan(0);
  });

  test('GET /api/admin/inventory/logs should return stock movement trail', async () => {
    const invRes = await request(app)
      .get('/api/admin/inventory/logs')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(invRes.status).toBe(200);
    expect(Array.isArray(invRes.body.logs)).toBe(true);
  });

  test('GET /api/admin/emails should return logged sent emails', async () => {
    const emailRes = await request(app)
      .get('/api/admin/emails')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(emailRes.status).toBe(200);
    expect(Array.isArray(emailRes.body.emails)).toBe(true);
  });

  // --- HARDWARE SPECS JSONB FILTER (GIN INDEX) ---
  test('GET /api/products with specsFilter should filter products correctly using JSONB', async () => {
    const filter = JSON.stringify({ cpu: 'Intel Core i7-14700K' });
    const res = await request(app).get(`/api/products?specs=${encodeURIComponent(filter)}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    if (res.body.products.length > 0) {
      expect(res.body.products[0].specs.cpu).toBe('Intel Core i7-14700K');
    }
  });
});
