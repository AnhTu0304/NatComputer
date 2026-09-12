const request = require('supertest');
const { generateVietQrUrl, getBankConfig } = require('./vietqrHelper');
const app = require('./server');
const dbModule = require('./db');
const { generateToken } = require('./authMiddleware');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

describe('VietQR MBBank Payment Module Tests', () => {
  test('getBankConfig should return default MBBank account details', () => {
    const config = getBankConfig();
    expect(config.bankId).toEqual('MB');
    expect(config.accountNo).toEqual('0773071629');
    expect(config.accountName).toEqual('NGO ANH TU');
  });

  test('generateVietQrUrl should format VietQR standard URL correctly', () => {
    const url = generateVietQrUrl({
      amount: 25000000,
      orderId: 'NAT-123456'
    });

    expect(url).toContain('img.vietqr.io/image/MB-0773071629-compact2.png');
    expect(url).toContain('amount=25000000');
    expect(url).toContain('accountName=NGO%20ANH%20TU');
    expect(url).toContain('addInfo=');
  });

  test('GET /api/payment/bank-info should return public bank account details', async () => {
    const res = await request(app).get('/api/payment/bank-info');
    expect(res.statusCode).toEqual(200);
    expect(res.body.bankId).toEqual('MB');
    expect(res.body.accountNo).toEqual('0773071629');
    expect(res.body.accountName).toEqual('NGO ANH TU');
  });

  test('GET /api/admin/settings/bank should allow admin to fetch bank settings', async () => {
    const adminToken = generateToken({ id: 'adm_1', role: 'admin', email: 'admin@nat.vn' });
    const res = await request(app)
      .get('/api/admin/settings/bank')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.accountNo).toEqual('0773071629');
  });
});
