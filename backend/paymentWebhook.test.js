const request = require('supertest');
const app = require('./server');
const dbModule = require('./db');
const OrderModel = require('./src/models/OrderModel');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

describe('SePay Automated Payment Webhook & Admin Reconciliation Tests', () => {
  const SEPAY_KEY = 'nat_sepay_webhook_secret_key_2026_@!';
  let adminToken = '';
  let customerToken = '';

  beforeAll(async () => {
    // Authenticate admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin', password: '123' });
    adminToken = adminRes.body.token;

    // Authenticate customer
    const custRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Webhook Test User',
        email: `webhook_user_${Date.now()}@nat.vn`,
        phone: '0988776655',
        password: 'Password@123'
      });
    customerToken = custRes.body.token;
  });

  test('POST /api/payment/webhook should reject unauthorized requests (401)', async () => {
    const res = await request(app)
      .post('/api/payment/webhook')
      .send({
        transferType: 'in',
        transferAmount: 1000000,
        content: 'NAT-TEST-001'
      });
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toMatch(/unauthorized|api key/i);
  });

  test('POST /api/payment/webhook should process valid SePay webhook, mark order as PAID (200)', async () => {
    const orderId = `NAT-SEPAY-${Date.now()}`;
    await OrderModel.create({
      order: {
        id: orderId,
        customerName: 'Nguyen Van A',
        customerEmail: 'nguyenvana@gmail.com',
        customerPhone: '0773071629',
        shippingAddress: '123 Le Duan, Da Nang',
        paymentMethod: 'vietqr',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        totalAmount: 15000000,
        createdAt: new Date().toISOString()
      },
      payment: {
        id: `pay_${Date.now()}`,
        orderId,
        gateway: 'MBBank',
        transactionCode: `TXN-${orderId}`,
        amount: 15000000,
        status: 'PENDING'
      },
      items: []
    });

    const payload = {
      id: 1289410,
      gateway: 'MBBank',
      transactionDate: '2026-09-22 22:45:00',
      accountNumber: '0773071629',
      transferType: 'in',
      transferAmount: 15000000,
      content: `${orderId} Nguyen Van A thanh toan`,
      referenceCode: 'MB99887766'
    };

    const res = await request(app)
      .post('/api/payment/webhook')
      .set('Authorization', `Apikey ${SEPAY_KEY}`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.orderId).toBe(orderId);

    // Verify order is now PAID in database
    const updatedOrder = await OrderModel.getById(orderId);
    expect(updatedOrder.paymentStatus).toBe('PAID');
    expect(updatedOrder.status).toBe('PROCESSING');
  });

  test('POST /api/payment/webhook should be idempotent when re-sending webhook for already PAID order', async () => {
    const orderId = `NAT-IDEM-${Date.now()}`;
    await OrderModel.create({
      order: {
        id: orderId,
        customerName: 'Tran Thi B',
        customerEmail: 'tranthib@gmail.com',
        customerPhone: '0905123456',
        shippingAddress: '456 Tran Phu, Da Nang',
        paymentMethod: 'vietqr',
        paymentStatus: 'PAID',
        status: 'PROCESSING',
        totalAmount: 20000000,
        createdAt: new Date().toISOString()
      },
      payment: {
        id: `pay_${Date.now()}`,
        orderId,
        gateway: 'MBBank',
        transactionCode: 'MB112233',
        amount: 20000000,
        status: 'SUCCESS'
      },
      items: []
    });

    const payload = {
      id: 1289411,
      gateway: 'MBBank',
      transactionDate: '2026-09-22 22:48:00',
      accountNumber: '0773071629',
      transferType: 'in',
      transferAmount: 20000000,
      content: `${orderId} Tran Thi B thanh toan`,
      referenceCode: 'MB112233'
    };

    const res = await request(app)
      .post('/api/payment/webhook')
      .set('Authorization', `Apikey ${SEPAY_KEY}`)
      .send(payload);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/already processed/i);
  });

  test('POST /api/payment/webhook should reject underpaid transactions (400)', async () => {
    const orderId = `NAT-UNDER-${Date.now()}`;
    await OrderModel.create({
      order: {
        id: orderId,
        customerName: 'Le Van C',
        customerEmail: 'levanc@gmail.com',
        customerPhone: '0912345678',
        shippingAddress: '789 Nguyen Thi Minh Khai, TP.HCM',
        paymentMethod: 'vietqr',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        totalAmount: 25000000,
        createdAt: new Date().toISOString()
      },
      payment: {
        id: `pay_${Date.now()}`,
        orderId,
        gateway: 'MBBank',
        transactionCode: `TXN-${orderId}`,
        amount: 25000000,
        status: 'PENDING'
      },
      items: []
    });

    const payload = {
      id: 1289412,
      gateway: 'MBBank',
      transactionDate: '2026-09-22 22:50:00',
      accountNumber: '0773071629',
      transferType: 'in',
      transferAmount: 10000000, // Less than 25,000,000
      content: `${orderId} Le Van C chuyen thieu`,
      referenceCode: 'MB334455'
    };

    const res = await request(app)
      .post('/api/payment/webhook')
      .set('Authorization', `Apikey ${SEPAY_KEY}`)
      .send(payload);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/insufficient|không đủ/i);
  });

  test('PUT /api/admin/orders/:id/confirm-payment requires admin authentication', async () => {
    const orderId = `NAT-ADMIN-AUTH-${Date.now()}`;

    // Without token -> 401
    const resNoToken = await request(app)
      .put(`/api/admin/orders/${orderId}/confirm-payment`);
    expect(resNoToken.statusCode).toBe(401);

    // With customer token -> 403
    const resCustToken = await request(app)
      .put(`/api/admin/orders/${orderId}/confirm-payment`)
      .set('Authorization', `Bearer ${customerToken}`);
    expect(resCustToken.statusCode).toBe(403);
  });

  test('PUT /api/admin/orders/:id/confirm-payment allows admin to manually confirm payment', async () => {
    const orderId = `NAT-ADMIN-OK-${Date.now()}`;
    await OrderModel.create({
      order: {
        id: orderId,
        customerName: 'Pham Van D',
        customerEmail: 'phamvand@gmail.com',
        customerPhone: '0977889900',
        shippingAddress: '10 Hai Ba Trung, Ha Noi',
        paymentMethod: 'vietqr',
        paymentStatus: 'PENDING',
        status: 'PENDING',
        totalAmount: 18000000,
        createdAt: new Date().toISOString()
      },
      payment: {
        id: `pay_${Date.now()}`,
        orderId,
        gateway: 'MBBank',
        transactionCode: `TXN-${orderId}`,
        amount: 18000000,
        status: 'PENDING'
      },
      items: []
    });

    const res = await request(app)
      .put(`/api/admin/orders/${orderId}/confirm-payment`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    // Verify order is now PAID
    const order = await OrderModel.getById(orderId);
    expect(order.paymentStatus).toBe('PAID');
    expect(order.status).toBe('PROCESSING');
  });
});
