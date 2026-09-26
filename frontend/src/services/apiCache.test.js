import { api } from './api';

describe('Frontend Client-Side API Caching & SWR', () => {
  beforeEach(() => {
    if (api.clearCache) {
      api.clearCache();
    }
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('should return cached product catalog on duplicate requests within TTL without calling fetch twice', async () => {
    const mockData = { products: [{ id: 'p1', name: 'PC Gaming RTX 5070' }] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    // First call: Network fetch
    const firstCall = await api.getProducts();
    expect(firstCall.products).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Second call: Served from client cache immediately
    const secondCall = await api.getProducts();
    expect(secondCall.products).toHaveLength(1);
    expect(global.fetch).toHaveBeenCalledTimes(1); // No new network call!
  });

  test('should invalidate client cache when clearCache is called', async () => {
    const mockData = { products: [{ id: 'p1', name: 'PC Gaming RTX 5070' }] };
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData
    });

    await api.getProducts();
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Invalidate client cache
    api.clearCache();

    // Call again -> must fetch fresh data from network
    await api.getProducts();
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
