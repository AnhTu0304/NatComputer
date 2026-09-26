const request = require('supertest');
const { buildInvoiceHtml, sendInvoiceEmail } = require('./emailService');
const app = require('./server');
const dbModule = require('./db');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

describe('Automated Invoice Email Service Tests', () => {
  const sampleOrder = {
    id: 'NAT-998877',
    customerName: 'Ngô Anh Tú',
    customerEmail: 'tu.ngo@natcomputer.vn',
    customerPhone: '0773071629',
    shippingAddress: '456 Trần Duy Hưng, Cầu Giấy, Hà Nội',
    paymentMethod: 'vietqr',
    paymentMethodLabel: 'Chuyển khoản Ngân hàng (MBBank VietQR)',
    totalAmount: 28500000,
    discountAmount: 500000,
    appliedCoupon: 'NAT500K',
    items: [
      {
        id: 'pc-1',
        name: 'PC GAMING ULTRA 7 - RTX 4070',
        quantity: 1,
        price: 29000000,
        specs: { cpu: 'Core i7 14700K', gpu: 'RTX 4070 12GB', ram: '32GB DDR5' }
      }
    ],
    createdAt: new Date().toISOString()
  };

  test('buildInvoiceHtml should generate complete, branded HTML invoice email', () => {
    const html = buildInvoiceHtml(sampleOrder);

    expect(html).toContain('NAT COMPUTER');
    expect(html).toContain('NAT-998877');
    expect(html).toContain('Ngô Anh Tú');
    expect(html).toContain('PC GAMING ULTRA 7');
    expect(html).toContain('28.500.000');
    expect(html).toContain('0886.976.868');
    expect(html).toContain('Bảo hành 36 tháng');
  });

  test('sendInvoiceEmail should dispatch or log email successfully', async () => {
    const result = await sendInvoiceEmail(sampleOrder);

    expect(result.success).toBe(true);
    expect(result.recipientEmail).toEqual('tu.ngo@natcomputer.vn');
    expect(result.orderId).toEqual('NAT-998877');
  });

  test('POST /api/email/send-invoice should return 200 and email log', async () => {
    const res = await request(app)
      .post('/api/email/send-invoice')
      .send({
        recipientEmail: 'tu.ngo@natcomputer.vn',
        orderId: 'NAT-998877',
        order: sampleOrder
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.emailLog).toBeDefined();
    expect(res.body.emailLog.recipientEmail).toEqual('tu.ngo@natcomputer.vn');
  });

  test('sendInvoiceEmail should send email using Resend when RESEND_API_KEY is configured', async () => {
    const originalEnv = process.env.RESEND_API_KEY;
    process.env.RESEND_API_KEY = 're_mock_key_for_test';

    const result = await sendInvoiceEmail(sampleOrder);
    expect(result.success).toBe(true);
    expect(result.provider).toBe('resend');

    process.env.RESEND_API_KEY = originalEnv;
  });

  describe('Asynchronous Email Dispatching with 4s Wait', () => {
    const { queueInvoiceEmailAsync } = require('./emailService');

    test('queueInvoiceEmailAsync should return immediately without blocking (less than 50ms) with 4000ms wait', () => {
      const startTime = Date.now();
      const queueResult = queueInvoiceEmailAsync(sampleOrder, 4000);
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeLessThan(100);
      expect(queueResult.queued).toBe(true);
      expect(queueResult.status).toBe('QUEUED');
      expect(queueResult.delayMs).toBe(4000);
      expect(queueResult.orderId).toBe('NAT-998877');
    });

    test('POST /api/email/send-invoice should support async mode with 4s wait', async () => {
      const startTime = Date.now();
      const res = await request(app)
        .post('/api/email/send-invoice')
        .send({
          recipientEmail: 'tu.ngo@natcomputer.vn',
          orderId: 'NAT-998877',
          order: sampleOrder,
          isAsync: true,
          delayMs: 4000
        });
      const elapsed = Date.now() - startTime;

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isAsync).toBe(true);
      expect(res.body.delayMs).toBe(4000);
      expect(res.body.status).toBe('QUEUED');
      expect(elapsed).toBeLessThan(200); // Returns immediately!
    });
  });

  describe('Synchronous Email Dispatching (Không dùng bất đồng bộ - Đồng bộ blocking)', () => {
    test('POST /api/email/send-invoice with isAsync = false should block and wait synchronously before responding', async () => {
      const waitTime = 500; // 500ms blocking delay to prove synchronous wait
      const startTime = Date.now();
      const res = await request(app)
        .post('/api/email/send-invoice')
        .send({
          recipientEmail: 'tu.ngo@natcomputer.vn',
          orderId: 'NAT-SYNC-TEST',
          order: sampleOrder,
          isAsync: false,
          delayMs: waitTime
        });
      const elapsed = Date.now() - startTime;

      // Phải chờ đủ thời gian delay mới trả kết quả về (Synchronous Blocking)
      expect(elapsed).toBeGreaterThanOrEqual(450);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.isAsync).toBe(false);
      expect(res.body.status).toBe('SENT');
      expect(res.body.emailLog).toBeDefined();
    });
  });
});
