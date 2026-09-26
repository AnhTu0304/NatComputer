const request = require('supertest');
const app = require('./server');
const CacheService = require('./src/services/cacheService');
const dbModule = require('./db');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

const { generateToken } = require('./src/middlewares/authMiddleware');

describe('Multi-tier Caching System Tests', () => {
  const adminToken = generateToken({
    id: 'admin-test',
    email: 'admin@natcomputer.vn',
    name: 'Admin NAT',
    role: 'admin'
  });
  beforeEach(() => {
    CacheService.flush();
  });

  describe('1. Core CacheService In-Memory Operations', () => {
    test('should set and get values with TTL', async () => {
      CacheService.set('test:key', { name: 'PC RTX 5070' }, 2);
      expect(CacheService.get('test:key')).toEqual({ name: 'PC RTX 5070' });

      // Expired TTL check
      CacheService.set('test:expired', 'hello', 0.01);
      await new Promise(r => setTimeout(r, 20));
      expect(CacheService.get('test:expired')).toBeNull();
    });

    test('should delete single key and key prefixes (delPrefix)', () => {
      CacheService.set('products:all', [1, 2, 3]);
      CacheService.set('products:gear', [1]);
      CacheService.set('categories:all', ['pc', 'gear']);

      expect(CacheService.get('products:all')).toHaveLength(3);
      CacheService.delPrefix('products:');

      expect(CacheService.get('products:all')).toBeNull();
      expect(CacheService.get('products:gear')).toBeNull();
      expect(CacheService.get('categories:all')).not.toBeNull();
    });

    test('should track hit and miss statistics accurately', () => {
      CacheService.set('stat:key', 'value');
      CacheService.get('stat:key'); // Hit 1
      CacheService.get('stat:key'); // Hit 2
      CacheService.get('stat:nonexistent'); // Miss 1

      const stats = CacheService.getStats();
      expect(stats.hits).toBe(2);
      expect(stats.misses).toBe(1);
    });
  });

  describe('2. HTTP API Caching & Header Controls', () => {
    test('GET /api/products should return X-Cache MISS on first load, then HIT on subsequent load', async () => {
      const res1 = await request(app).get('/api/products');
      expect(res1.statusCode).toBe(200);
      expect(res1.headers['x-cache']).toBe('MISS');
      expect(res1.headers['cache-control']).toBeDefined();

      const res2 = await request(app).get('/api/products');
      expect(res2.statusCode).toBe(200);
      expect(res2.headers['x-cache']).toBe('HIT');
      expect(res2.body.products).toBeDefined();
    });

    test('Admin product mutation should invalidate products cache immediately', async () => {
      // 1. Prime cache
      await request(app).get('/api/products');
      expect(CacheService.get('api:products:all')).not.toBeNull();

      // 2. Admin creates a new product
      const newProduct = {
        name: 'Chuột Gaming Cache Test',
        category: 'gear',
        price: 990000,
        originalPrice: 1200000,
        specs: [{ item: 'DPI', desc: '16000' }]
      };

      const adminRes = await request(app)
        .post('/api/admin/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);
      expect([200, 201]).toContain(adminRes.statusCode);

      // 3. Cache must be automatically wiped!
      expect(CacheService.get('api:products:all')).toBeNull();

      // 4. Next GET should be a fresh MISS reflecting new changes
      const resAfterMutation = await request(app).get('/api/products');
      expect(resAfterMutation.headers['x-cache']).toBe('MISS');
    });
  });

  describe('3. AI Hardware Chatbot Query Caching', () => {
    test('should return cached AI advice for identical hardware queries instantly', async () => {
      const query = { message: 'Tư vấn card đồ họa 10 triệu để chơi game' };

      // Manually pre-warm or mock AI query in cache
      const cacheKey = CacheService.generateAiKey(query.message);
      CacheService.set(cacheKey, {
        reply: 'Trong tầm giá 10 triệu, bạn nên chọn RTX 4060 hoặc RTX 3060 12GB...',
        recommendedProducts: [],
        provider: 'gemini'
      }, 3600);

      const startTime = Date.now();
      const res = await request(app).post('/api/ai/chat').send(query);
      const duration = Date.now() - startTime;

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.provider).toBe('gemini-cache');
      expect(res.body.reply).toContain('RTX 4060');
      // Sub-millisecond or very fast response (< 100ms)
      expect(duration).toBeLessThan(500);
    });
  });
});
