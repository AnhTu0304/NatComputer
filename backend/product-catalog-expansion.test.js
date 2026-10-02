const request = require('supertest');
const app = require('./server');
const dbModule = require('./db');
const seedProducts = require('./src/data/seedCatalog');

describe('Product Catalog Expansion & Quality Verification Tests', () => {
  beforeAll(async () => {
    // Wait for PostgreSQL pool to initialize
    for (let i = 0; i < 20; i++) {
      if (dbModule.getIsPostgresConnected()) break;
      await new Promise(r => setTimeout(r, 100));
    }
  });

  afterAll(async () => {
    await new Promise(r => setTimeout(r, 100));
    try {
      await dbModule.pool.end();
    } catch (e) {}
  });

  test('1. Verify seedCatalog has at least 40 products with detailed specs and images', () => {
    expect(seedProducts.length).toBeGreaterThanOrEqual(40);

    seedProducts.forEach(p => {
      expect(p.id).toBeDefined();
      expect(p.name.length).toBeGreaterThan(5);
      expect(p.category).toBeDefined();
      expect(p.price).toBeGreaterThan(0);
      expect(p.image).toMatch(/^https?:\/\//);
      expect(p.description.length).toBeGreaterThan(15);
      expect(p.specs).toBeDefined();
      expect(typeof p.specs).toBe('object');
    });
  });

  test('2. Verify database has >= 40 products and covers all 14 categories', async () => {
    const res = await dbModule.query(`
      SELECT count(*) as total_count, count(DISTINCT category_id) as category_count 
      FROM products
    `);
    const total = parseInt(res.rows[0].total_count, 10);
    const catCount = parseInt(res.rows[0].category_count, 10);

    expect(total).toBeGreaterThanOrEqual(40);
    expect(catCount).toBeGreaterThanOrEqual(14);

    // Verify key categories exist
    const catRes = await dbModule.query('SELECT DISTINCT category_id FROM products');
    const categories = catRes.rows.map(r => r.category_id);
    const expectedCategories = [
      'gaming', 'pc-amd', 'workstation', 'office', 'pc-mini',
      'ai', 'virtualization', 'pc-combo', 'components', 'monitors',
      'gaming-gear', 'speakers', 'network', 'software'
    ];

    expectedCategories.forEach(cat => {
      expect(categories).toContain(cat);
    });
  });

  test('3. Verify GET /api/products returns products with images array including gallery', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThanOrEqual(40);

    const samplePC = res.body.products.find(p => p.id === 'pc-gaming-ultra-4070ti');
    expect(samplePC).toBeDefined();
    expect(Array.isArray(samplePC.images)).toBe(true);
    expect(samplePC.images.length).toBeGreaterThanOrEqual(2);
    expect(samplePC.stockQuantity).toBeGreaterThan(0);
    expect(samplePC.rating).toBeGreaterThan(0);
  });

  test('4. Verify GET /api/products/:id returns full details with gallery and specs', async () => {
    const res = await request(app).get('/api/products/deal-ultra-7-5070');
    expect(res.status).toBe(200);
    expect(res.body.product).toBeDefined();
    expect(res.body.product.name).toContain('ULTRA 7 270K');
    expect(res.body.product.specs.gpu).toContain('RTX 5070');
    expect(Array.isArray(res.body.product.images)).toBe(true);
    expect(res.body.product.images.length).toBeGreaterThanOrEqual(2);
  });

  test('5. Verify GIN index search on specs_json works for new products', async () => {
    const filter = JSON.stringify({ cpu: 'AMD Ryzen 7 7800X3D (8C/16T, Up to 5.0GHz)' });
    const res = await request(app).get(`/api/products?specs=${encodeURIComponent(filter)}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThanOrEqual(1);
    expect(res.body.products[0].id).toBe('pc-gaming-ultra-4070ti');
  });

  test('6. Verify all products have valid pricing and non-empty descriptions', async () => {
    const res = await dbModule.query(`
      SELECT id, name, price, description 
      FROM products 
      WHERE price <= 0 OR description IS NULL OR length(trim(description)) = 0
    `);
    expect(res.rows.length).toBe(0);
  });
});
