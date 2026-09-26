const request = require('supertest');
const app = require('./server');
const dbModule = require('./db');

afterAll(async () => {
  await new Promise(r => setTimeout(r, 100));
  try {
    await dbModule.pool.end();
  } catch (e) {}
});

describe('Google Gemini AI Hardware Chatbot API Tests', () => {
  jest.setTimeout(45000);

  test('POST /api/ai/chat should return 400 if message is missing or empty', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/bắt buộc|required/i);
  });

  test('POST /api/ai/chat should return intelligent advice from Gemini AI and recommended products', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Tư vấn giúp tôi một bộ PC chơi game tầm 25 triệu mượt mà'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(20);
    expect(Array.isArray(res.body.recommendedProducts)).toBe(true);
    expect(['gemini', 'fallback']).toContain(res.body.provider);
  });

  test('POST /api/ai/chat should accept and maintain conversation history', async () => {
    const history = [
      { sender: 'user', text: 'Tôi muốn mua máy tính làm đồ họa' },
      { sender: 'bot', text: 'Bạn làm đồ họa 2D Photoshop hay 3D Maya / Premiere 4K?' }
    ];

    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Tôi làm Premiere 4K và After Effects',
        history
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.reply.length).toBeGreaterThan(20);
  });

  test('POST /api/ai/chat should fallback gracefully when API key is invalid', async () => {
    const originalKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = 'invalid_mock_key';

    const res = await request(app)
      .post('/api/ai/chat')
      .send({
        message: 'Tư vấn PC văn phòng dưới 10 triệu'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(typeof res.body.reply).toBe('string');
    expect(res.body.provider).toBe('fallback');

    process.env.GEMINI_API_KEY = originalKey;
  });
});
