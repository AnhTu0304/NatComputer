const request = require('supertest');
const app = require('./server');
const dbModule = require('./db');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

describe('Generic Dynamic Product Specifications Tests', () => {
  let adminToken = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin', password: '123' });
    adminToken = res.body.token;
  });

  test('POST /api/admin/products should save generic specs for Gaming Gear or Components', async () => {
    const gearSpecs = [
      { item: 'Cảm biến (Sensor)', desc: 'HERO 25K (100 - 25.600 DPI)', qty: 1, warranty: '24 Tháng' },
      { item: 'Kết nối', desc: 'Lightspeed Wireless 1ms & Bluetooth', qty: 1, warranty: '24 Tháng' },
      { item: 'Trọng lượng', desc: '99g', qty: 1, warranty: '24 Tháng' }
    ];

    const res = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Chuột Gaming Không Dây Siêu Nhẹ',
        category: 'gear',
        price: 1590000,
        originalPrice: 1890000,
        badge: 'NEW GEAR',
        image: 'https://example.com/mouse.jpg',
        description: 'Chuột gaming không dây chính hãng',
        specs: gearSpecs
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.specs).toEqual(gearSpecs);
  });

  test('PUT /api/admin/products/:id should update product with custom hardware specs table', async () => {
    // 1. Create a GPU product
    const createRes = await request(app)
      .post('/api/admin/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'VGA NVIDIA GeForce RTX 5070 Ti 16GB',
        category: 'components',
        price: 26900000,
        specs: [
          { item: 'Chip đồ họa (GPU)', desc: 'GeForce RTX 5070 Ti', qty: 1, warranty: '36 Tháng' }
        ]
      });

    const productId = createRes.body.product.id;

    // 2. Update with more detailed specs
    const updatedSpecs = [
      { item: 'Chip đồ họa (GPU)', desc: 'GeForce RTX 5070 Ti', qty: 1, warranty: '36 Tháng' },
      { item: 'Bộ nhớ VRAM', desc: '16GB GDDR7 256-bit', qty: 1, warranty: '36 Tháng' },
      { item: 'Cổng xuất hình', desc: '3x DisplayPort 2.1b, 1x HDMI 2.1b', qty: 1, warranty: '36 Tháng' },
      { item: 'Nguồn đề nghị', desc: 'Từ 750W trở lên (1x 16-pin 12V-2x6)', qty: 1, warranty: '36 Tháng' }
    ];

    const updateRes = await request(app)
      .put(`/api/admin/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        specs: updatedSpecs
      });

    expect(updateRes.statusCode).toBe(200);

    // 3. Verify public get products returns the updated generic specs
    const getRes = await request(app).get('/api/products');
    const found = getRes.body.products.find(p => p.id === productId);
    expect(found).toBeDefined();
    expect(found.specs).toEqual(updatedSpecs);
  });
});
