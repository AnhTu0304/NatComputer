/**
 * CacheService: High-Performance Multi-Tier In-Memory Cache Manager
 * NAT Computer Architecture
 */

class CacheService {
  constructor() {
    this.store = new Map();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Set a key-value pair with a Time-To-Live (TTL) in seconds
   * @param {string} key
   * @param {any} value
   * @param {number} ttlSeconds Default: 300 seconds (5 minutes)
   */
  set(key, value, ttlSeconds = 300) {
    if (!key) return;
    const expiresAt = Date.now() + Math.max(0.001, ttlSeconds) * 1000;
    this.store.set(key, { value, expiresAt });
  }

  /**
   * Get cached value if present and not expired
   * @param {string} key
   * @returns {any|null}
   */
  get(key) {
    if (!this.store.has(key)) {
      this.misses++;
      return null;
    }

    const item = this.store.get(key);
    if (Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    this.hits++;
    return item.value;
  }

  /**
   * Delete a specific key
   * @param {string} key
   */
  del(key) {
    this.store.delete(key);
  }

  /**
   * Delete all keys starting with a specific prefix (e.g. 'api:products:', 'products:')
   * @param {string} prefix
   */
  delPrefix(prefix) {
    if (!prefix) return;
    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  /**
   * Flush/clear all stored cache
   */
  flush() {
    this.store.clear();
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Return cache performance statistics
   */
  getStats() {
    // Clean expired keys on stat check
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.store.delete(key);
      }
    }

    const total = this.hits + this.misses;
    const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(1) + '%' : '0%';

    return {
      hits: this.hits,
      misses: this.misses,
      keysCount: this.store.size,
      hitRate
    };
  }

  /**
   * Generate normalized cache key for AI hardware chatbot prompts
   * @param {string} message
   * @returns {string}
   */
  generateAiKey(message = '') {
    const clean = message
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .replace(/\s+/g, ' ');
    return `ai:query:${clean}`;
  }

  /**
   * Express middleware for caching GET routes
   * @param {string} keyPrefix e.g. 'api:products'
   * @param {number} ttlSeconds e.g. 300
   */
  middleware(keyPrefix, ttlSeconds = 300) {
    return (req, res, next) => {
      if (req.method !== 'GET') {
        return next();
      }

      // Generate cache key based on route parameters and query string
      const queryString = Object.keys(req.query).length > 0
        ? '?' + new URLSearchParams(req.query).toString()
        : ':all';
      const key = `${keyPrefix}${queryString}`;

      const cachedData = this.get(key);
      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`);
        return res.json(cachedData);
      }

      // Cache Miss: intercept res.json to save result
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', `public, max-age=${ttlSeconds}, stale-while-revalidate=${ttlSeconds * 2}`);

      const originalJson = res.json.bind(res);
      res.json = (body) => {
        // Cache successful responses only (200 OK)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          this.set(key, body, ttlSeconds);
        }
        return originalJson(body);
      };

      next();
    };
  }
}

// Export singleton instance
module.exports = new CacheService();
