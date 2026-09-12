const request = require('supertest');
const app = require('./server');
const dbModule = require('./db');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

describe('NAT Computer Backend API Tests', () => {
  test('GET /api/health should return OK status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('OK');
  });

  let adminToken = '';
  let customerToken = '';

  test('POST /api/auth/login should authenticate admin with admin / 123 and return signed JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin', password: '123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.user.role).toEqual('admin');
    expect(res.body.token).toBeDefined();
    adminToken = res.body.token;
  });

  test('POST /api/auth/register should create new customer and return JWT', async () => {
    const uniqueEmail = `cust_${Date.now()}@nat.vn`;
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Khách hàng mới', email: uniqueEmail, phone: '0901234567', password: 'Password@123' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.user.role).toEqual('customer');
    expect(res.body.token).toBeDefined();
    customerToken = res.body.token;
  });

  test('GET /api/admin/categories should return 401 if no token provided', async () => {
    const res = await request(app).get('/api/admin/categories');
    expect(res.statusCode).toEqual(401);
  });

  test('GET /api/admin/categories should return 403 if customer token provided', async () => {
    const res = await request(app)
      .get('/api/admin/categories')
      .set('Authorization', `Bearer ${customerToken}`);
    expect(res.statusCode).toEqual(403);
  });

  test('GET /api/admin/categories should return 200 when valid admin token provided', async () => {
    const res = await request(app)
      .get('/api/admin/categories')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.categories)).toBeTruthy();
  });

  test('GET /api/admin/banners should return banner list with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/banners')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.banners)).toBeTruthy();
  });

  test('GET /api/admin/users should return user accounts with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.users)).toBeTruthy();
  });

  test('GET /api/admin/stats should return enriched analytics statistics with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.totalRevenue).toBeDefined();
    expect(res.body.totalOrders).toBeDefined();
    expect(res.body.monthlySales).toBeDefined();
    expect(Array.isArray(res.body.monthlySales)).toBeTruthy();
  });

  test('GET /api/admin/notifications should return notification list with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/notifications')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.notifications)).toBeTruthy();
  });

  test('GET /api/admin/payments should return payments list with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/payments')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.payments)).toBeTruthy();
  });

  test('GET /api/coupons should return active public coupons', async () => {
    const res = await request(app).get('/api/coupons');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.coupons)).toBeTruthy();
    expect(res.body.coupons.some(c => c.code === 'NAT500K')).toBeTruthy();
  });

  test('POST /api/coupons/validate should validate valid coupon with cart total', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'NAT500K', cartTotal: 20000000 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.valid).toBeTruthy();
    expect(res.body.discountAmount).toEqual(500000);
    expect(res.body.finalTotal).toEqual(19500000);
  });

  test('POST /api/coupons/validate should reject if minimum order not met', async () => {
    const res = await request(app)
      .post('/api/coupons/validate')
      .send({ code: 'NAT500K', cartTotal: 5000000 });
    expect(res.statusCode).toEqual(400);
    expect(res.body.valid).toBeFalsy();
  });

  test('GET /api/admin/coupons should return all vouchers with admin token', async () => {
    const res = await request(app)
      .get('/api/admin/coupons')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.coupons)).toBeTruthy();
  });
});


