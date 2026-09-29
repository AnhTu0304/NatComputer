const dbModule = require('./db');
const pool = dbModule.pool;

describe('PostgreSQL Database Normalization & Triggers Test Suite', () => {
  beforeAll(async () => {
    // Wait slightly to ensure dbModule.initDatabase() completes initialization
    await new Promise(r => setTimeout(r, 300));
  });

  afterAll(async () => {
    await new Promise(r => setTimeout(r, 100));
    try {
      await dbModule.pool.end();
    } catch (e) {}
  });

  test('1. Verify all new tables exist in database', async () => {
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_name IN ('product_reviews', 'inventory_logs', 'audit_logs', 'sent_emails')
      ORDER BY table_name;
    `);
    const tables = res.rows.map(r => r.table_name);
    expect(tables).toContain('audit_logs');
    expect(tables).toContain('inventory_logs');
    expect(tables).toContain('product_reviews');
    expect(tables).toContain('sent_emails');
  });

  test('2. Verify high-performance indexes exist including GIN and partial indexes', async () => {
    const res = await pool.query(`
      SELECT indexname, indexdef 
      FROM pg_indexes 
      WHERE schemaname = 'public'
        AND indexname IN ('idx_products_specs_gin', 'idx_orders_status_date', 'idx_coupons_active_code', 'idx_payments_trans_code');
    `);
    const indexNames = res.rows.map(r => r.indexname);
    expect(indexNames).toContain('idx_products_specs_gin');
    expect(indexNames).toContain('idx_orders_status_date');
    expect(indexNames).toContain('idx_coupons_active_code');
    expect(indexNames).toContain('idx_payments_trans_code');

    const ginDef = res.rows.find(r => r.indexname === 'idx_products_specs_gin');
    expect(ginDef.indexdef.toLowerCase()).toContain('gin');
  });

  test('3. Verify trigger fn_set_updated_at auto-updates updated_at column on product update', async () => {
    const testProdId = 'test-norm-prod-' + Date.now();
    await pool.query(`
      INSERT INTO products (id, name, price, stock_quantity, specs_json, image_url)
      VALUES ($1, 'Test Normalization PC', 20000000, 15, '{"cpu":"i5"}'::jsonb, 'https://example.com/img.jpg')
    `, [testProdId]);

    const initialRes = await pool.query('SELECT updated_at FROM products WHERE id = $1', [testProdId]);
    const initialUpdatedAt = new Date(initialRes.rows[0].updated_at).getTime();

    // Sleep 50ms to ensure timestamp changes
    await new Promise(r => setTimeout(r, 60));

    await pool.query('UPDATE products SET price = 21000000 WHERE id = $1', [testProdId]);
    const updatedRes = await pool.query('SELECT updated_at, price FROM products WHERE id = $1', [testProdId]);
    const postUpdatedAt = new Date(updatedRes.rows[0].updated_at).getTime();

    expect(postUpdatedAt).toBeGreaterThan(initialUpdatedAt);
    expect(parseFloat(updatedRes.rows[0].price)).toBe(21000000);

    // Clean up
    await pool.query('DELETE FROM products WHERE id = $1', [testProdId]);
  });

  test('4. Verify trigger fn_recalculate_product_rating updates product rating & count', async () => {
    const testProdId = 'test-rating-prod-' + Date.now();
    await pool.query(`
      INSERT INTO products (id, name, price, stock_quantity, specs_json, image_url, rating, reviews_count)
      VALUES ($1, 'Test Rating Product', 15000000, 5, '{}'::jsonb, 'https://example.com/img.jpg', 5.0, 0)
    `, [testProdId]);

    const rev1Id = 'rev-1-' + Date.now();
    const rev2Id = 'rev-2-' + Date.now();

    // Add review 1: rating 4
    await pool.query(`
      INSERT INTO product_reviews (id, product_id, rating, comment)
      VALUES ($1, $2, 4, 'Very good PC')
    `, [rev1Id, testProdId]);

    let prod = (await pool.query('SELECT rating, reviews_count FROM products WHERE id = $1', [testProdId])).rows[0];
    expect(parseFloat(prod.rating)).toBe(4.0);
    expect(parseInt(prod.reviews_count, 10)).toBe(1);

    // Add review 2: rating 5 -> Average should be (4 + 5) / 2 = 4.5
    await pool.query(`
      INSERT INTO product_reviews (id, product_id, rating, comment)
      VALUES ($1, $2, 5, 'Awesome performance!')
    `, [rev2Id, testProdId]);

    prod = (await pool.query('SELECT rating, reviews_count FROM products WHERE id = $1', [testProdId])).rows[0];
    expect(parseFloat(prod.rating)).toBe(4.5);
    expect(parseInt(prod.reviews_count, 10)).toBe(2);

    // Delete review 1 -> Average should be 5.0, count 1
    await pool.query('DELETE FROM product_reviews WHERE id = $1', [rev1Id]);
    prod = (await pool.query('SELECT rating, reviews_count FROM products WHERE id = $1', [testProdId])).rows[0];
    expect(parseFloat(prod.rating)).toBe(5.0);
    expect(parseInt(prod.reviews_count, 10)).toBe(1);

    // Clean up
    await pool.query('DELETE FROM product_reviews WHERE product_id = $1', [testProdId]);
    await pool.query('DELETE FROM products WHERE id = $1', [testProdId]);
  });

  test('5. Verify inventory automation & audit logs on order payment and cancellation', async () => {
    const testProdId = 'test-inv-prod-' + Date.now();
    const testOrderId = 'test-ord-' + Date.now();
    const initialStock = 20;
    const orderQty = 3;

    // 1. Setup product
    await pool.query(`
      INSERT INTO products (id, name, price, stock_quantity, specs_json, image_url)
      VALUES ($1, 'Test Inventory PC', 10000000, $2, '{}'::jsonb, 'https://example.com/img.jpg')
    `, [testProdId, initialStock]);

    // 2. Setup order with pending status
    await pool.query(`
      INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, payment_method, payment_status, order_status, total_amount)
      VALUES ($1, 'Test Customer', 'test@domain.vn', '0912345678', 'Hanoi', 'vietqr', 'pending', 'processing', 30000000)
    `, [testOrderId]);

    // 3. Add order item
    await pool.query(`
      INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
      VALUES ($1, $2, 'Test Inventory PC', $3, 10000000)
    `, [testOrderId, testProdId, orderQty]);

    // Stock should still be 20 before payment
    let prodRes = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [testProdId]);
    expect(parseInt(prodRes.rows[0].stock_quantity, 10)).toBe(initialStock);

    // 4. Update order to PAID -> fn_sync_order_inventory_on_update should deduct 3
    await pool.query(`UPDATE orders SET payment_status = 'PAID' WHERE id = $1`, [testOrderId]);

    prodRes = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [testProdId]);
    expect(parseInt(prodRes.rows[0].stock_quantity, 10)).toBe(initialStock - orderQty);

    // Check inventory_logs recorded
    const invLogRes = await pool.query(
      'SELECT * FROM inventory_logs WHERE order_id = $1 AND product_id = $2',
      [testOrderId, testProdId]
    );
    expect(invLogRes.rows.length).toBeGreaterThan(0);
    expect(invLogRes.rows[0].change_amount).toBe(-orderQty);
    expect(invLogRes.rows[0].reason).toBe('order_paid');

    // Check audit_logs recorded order payment_status change
    const auditRes = await pool.query('SELECT * FROM audit_logs WHERE order_id = $1', [testOrderId]);
    expect(auditRes.rows.length).toBeGreaterThan(0);
    expect(auditRes.rows[0].notes).toContain('payment_status');

    // 5. Cancel order -> fn_sync_order_inventory_on_update should restore 3 items back
    await pool.query(`UPDATE orders SET order_status = 'CANCELLED' WHERE id = $1`, [testOrderId]);

    prodRes = await pool.query('SELECT stock_quantity FROM products WHERE id = $1', [testProdId]);
    expect(parseInt(prodRes.rows[0].stock_quantity, 10)).toBe(initialStock);

    const cancelLogRes = await pool.query(
      'SELECT * FROM inventory_logs WHERE order_id = $1 AND reason = $2',
      [testOrderId, 'order_cancelled']
    );
    expect(cancelLogRes.rows.length).toBe(1);
    expect(cancelLogRes.rows[0].change_amount).toBe(orderQty);

    // Clean up
    await pool.query('DELETE FROM inventory_logs WHERE order_id = $1', [testOrderId]);
    await pool.query('DELETE FROM audit_logs WHERE order_id = $1', [testOrderId]);
    await pool.query('DELETE FROM order_items WHERE order_id = $1', [testOrderId]);
    await pool.query('DELETE FROM orders WHERE id = $1', [testOrderId]);
    await pool.query('DELETE FROM products WHERE id = $1', [testProdId]);
  });

  test('6. Verify ReviewModel, InventoryModel, and AuditModel helper methods', async () => {
    const ReviewModel = require('./src/models/ReviewModel');
    const InventoryModel = require('./src/models/InventoryModel');
    const AuditModel = require('./src/models/AuditModel');

    const testProdId = 'model-test-prod-' + Date.now();
    await pool.query(`
      INSERT INTO products (id, name, price, stock_quantity, specs_json, image_url)
      VALUES ($1, 'Model Test PC', 12000000, 10, '{}'::jsonb, 'https://example.com/img.jpg')
    `, [testProdId]);

    // ReviewModel
    const rev = await ReviewModel.create({
      productId: testProdId,
      rating: 5,
      comment: 'ReviewModel unit test'
    });
    expect(rev).toBeDefined();
    const reviews = await ReviewModel.getByProductId(testProdId);
    expect(reviews.length).toBeGreaterThan(0);
    expect(reviews[0].comment).toBe('ReviewModel unit test');

    // InventoryModel
    const invLog = await InventoryModel.logChange({
      productId: testProdId,
      changeAmount: -2,
      currentStock: 8,
      reason: 'admin_test'
    });
    expect(invLog).toBeDefined();
    const logs = await InventoryModel.getLogsByProductId(testProdId);
    expect(logs.length).toBeGreaterThan(0);
    expect(logs[0].reason).toBe('admin_test');

    // AuditModel
    const testOrdId = 'ord-audit-' + Date.now();
    await pool.query(`
      INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, payment_method, total_amount)
      VALUES ($1, 'Audit Customer', 'audit@test.com', '0999999999', 'Hanoi', 'cod', 12000000)
    `, [testOrdId]);

    const audit = await AuditModel.log({
      orderId: testOrdId,
      actor: 'admin',
      oldStatus: 'processing',
      newStatus: 'delivered',
      notes: 'Delivered by shipper'
    });
    expect(audit).toBeDefined();
    const auditLogs = await AuditModel.getLogsByOrderId(testOrdId);
    expect(auditLogs.length).toBeGreaterThan(0);

    // Clean up
    await pool.query('DELETE FROM product_reviews WHERE product_id = $1', [testProdId]);
    await pool.query('DELETE FROM inventory_logs WHERE product_id = $1', [testProdId]);
    await pool.query('DELETE FROM audit_logs WHERE order_id = $1', [testOrdId]);
    await pool.query('DELETE FROM orders WHERE id = $1', [testOrdId]);
    await pool.query('DELETE FROM products WHERE id = $1', [testProdId]);
  });
});
