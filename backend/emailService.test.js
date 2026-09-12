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
});
