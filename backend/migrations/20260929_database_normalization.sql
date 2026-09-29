-- =============================================================================
-- NAT COMPUTER: POSTGRESQL DATABASE NORMALIZATION & OPTIMIZATION MIGRATION
-- Migration Date: 2026-09-29
-- Author: Nat Computer Engineering Team
-- Purpose:
--   1. Add 'updated_at' columns to key entities.
--   2. Establish clean 3NF Foreign Keys and Check Constraints.
--   3. Create new tables: product_reviews, inventory_logs, audit_logs, sent_emails.
--   4. Build High-Performance B-Tree, Partial, and GIN Indexes.
--   5. Create Stored Functions & Triggers for automation (ratings, inventory sync, audit trail).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ADD MISSING COLUMNS (Additive & Non-destructive)
-- -----------------------------------------------------------------------------
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Ensure categories table contains 'gear' if products reference it
INSERT INTO categories (id, name, slug, description)
VALUES ('gear', 'Gaming Gear', 'gear', 'Bàn phím cơ, Chuột gaming, Tai nghe, Phụ kiện stream')
ON CONFLICT (id) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. CREATE NEW BUSINESS TABLES (IF NOT EXISTS)
-- -----------------------------------------------------------------------------

-- 2.1. PRODUCT REVIEWS TABLE
CREATE TABLE IF NOT EXISTS product_reviews (
    id VARCHAR(50) PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.2. INVENTORY LOGS TABLE
CREATE TABLE IF NOT EXISTS inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id VARCHAR(50) NOT NULL,
    order_id VARCHAR(50),
    change_amount INT NOT NULL,
    current_stock INT NOT NULL,
    reason VARCHAR(50) NOT NULL, -- 'order_paid', 'order_cancelled', 'admin_restock', 'initial_import'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.3. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    order_id VARCHAR(50),
    entity_type VARCHAR(50) DEFAULT 'order',
    actor VARCHAR(50) DEFAULT 'system', -- 'system', 'admin', 'webhook_sepay'
    old_status VARCHAR(50),
    new_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2.4. SENT EMAILS LOG TABLE
CREATE TABLE IF NOT EXISTS sent_emails (
    id VARCHAR(50) PRIMARY KEY,
    order_id VARCHAR(50),
    recipient_email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    template VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed'
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. ESTABLISH SAFE FOREIGN KEYS & CONSTRAINTS (Idempotent Block)
-- -----------------------------------------------------------------------------
DO $$
BEGIN
    -- 3.1. Products -> Categories
    UPDATE products SET category_id = NULL WHERE category_id IS NOT NULL AND category_id NOT IN (SELECT id FROM categories);
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_products_category') THEN
        ALTER TABLE products ADD CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;
    END IF;

    -- 3.2. Orders -> Users
    UPDATE orders SET user_id = NULL WHERE user_id IS NOT NULL AND user_id NOT IN (SELECT id FROM users);
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_orders_user') THEN
        ALTER TABLE orders ADD CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;

    -- 3.3. Order Items -> Products
    UPDATE order_items SET product_id = NULL WHERE product_id IS NOT NULL AND product_id NOT IN (SELECT id FROM products);
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_order_items_product') THEN
        ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
    END IF;

    -- 3.4. Product Reviews -> Products & Users
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_product') THEN
        ALTER TABLE product_reviews ADD CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_reviews_user') THEN
        ALTER TABLE product_reviews ADD CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;

    -- 3.5. Inventory Logs -> Products & Orders
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_inventory_product') THEN
        ALTER TABLE inventory_logs ADD CONSTRAINT fk_inventory_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_inventory_order') THEN
        ALTER TABLE inventory_logs ADD CONSTRAINT fk_inventory_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
    END IF;

    -- 3.6. Audit Logs -> Orders
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_audit_order') THEN
        ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
    END IF;

    -- 3.7. Sent Emails -> Orders
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_emails_order') THEN
        ALTER TABLE sent_emails ADD CONSTRAINT fk_emails_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL;
    END IF;

    -- 3.8. Check Constraints
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_price') THEN
        ALTER TABLE products ADD CONSTRAINT chk_products_price CHECK (price >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_products_stock') THEN
        ALTER TABLE products ADD CONSTRAINT chk_products_stock CHECK (stock_quantity >= 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_items_qty') THEN
        ALTER TABLE order_items ADD CONSTRAINT chk_order_items_qty CHECK (quantity > 0);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'chk_order_items_price') THEN
        ALTER TABLE order_items ADD CONSTRAINT chk_order_items_price CHECK (unit_price >= 0);
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. HIGH-PERFORMANCE INDEXES
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_specs_gin ON products USING gin(specs_json);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status_date ON orders(order_status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_trans_code ON payments(transaction_code);
CREATE INDEX IF NOT EXISTS idx_coupons_active_code ON coupons(code) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product_id ON inventory_logs(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_order_id ON audit_logs(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sent_emails_order_id ON sent_emails(order_id);

-- -----------------------------------------------------------------------------
-- 5. STORED FUNCTIONS & TRIGGERS
-- -----------------------------------------------------------------------------

-- 5.1. FUNCTION: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_categories_updated_at ON categories;
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_products_updated_at ON products;
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_payments_updated_at ON payments;
CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

DROP TRIGGER IF EXISTS trg_product_reviews_updated_at ON product_reviews;
CREATE TRIGGER trg_product_reviews_updated_at BEFORE UPDATE ON product_reviews FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();

-- 5.2. FUNCTION: Auto-recalculate product rating & review count
CREATE OR REPLACE FUNCTION fn_recalculate_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_prod_id VARCHAR(50);
    new_avg DECIMAL(3, 2);
    new_count INT;
BEGIN
    IF TG_OP = 'DELETE' THEN
        target_prod_id := OLD.product_id;
    ELSE
        target_prod_id := NEW.product_id;
    END IF;

    SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 5.0), COUNT(*)
    INTO new_avg, new_count
    FROM product_reviews
    WHERE product_id = target_prod_id;

    UPDATE products
    SET 
        rating = new_avg,
        reviews_count = new_count,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = target_prod_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recalculate_product_rating ON product_reviews;
CREATE TRIGGER trg_recalculate_product_rating
AFTER INSERT OR UPDATE OR DELETE ON product_reviews
FOR EACH ROW
EXECUTE FUNCTION fn_recalculate_product_rating();

-- 5.3. FUNCTION: Auto-sync inventory on order status/payment update
CREATE OR REPLACE FUNCTION fn_sync_order_inventory_on_update()
RETURNS TRIGGER AS $$
DECLARE
    r RECORD;
    curr_stock INT;
BEGIN
    -- Deduct stock when order becomes PAID
    IF (UPPER(NEW.payment_status) = 'PAID' AND UPPER(COALESCE(OLD.payment_status, '')) <> 'PAID') THEN
        FOR r IN SELECT product_id, quantity FROM order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                -- Avoid double deductions
                IF NOT EXISTS (SELECT 1 FROM inventory_logs WHERE order_id = NEW.id AND product_id = r.product_id AND reason = 'order_paid') THEN
                    UPDATE products 
                    SET stock_quantity = GREATEST(0, stock_quantity - r.quantity)
                    WHERE id = r.product_id
                    RETURNING stock_quantity INTO curr_stock;

                    INSERT INTO inventory_logs (product_id, order_id, change_amount, current_stock, reason)
                    VALUES (r.product_id, NEW.id, -r.quantity, COALESCE(curr_stock, 0), 'order_paid');
                END IF;
            END IF;
        END LOOP;
    END IF;

    -- Restore stock when order is CANCELLED
    IF (UPPER(NEW.order_status) = 'CANCELLED' AND UPPER(COALESCE(OLD.order_status, '')) <> 'CANCELLED') THEN
        FOR r IN SELECT product_id, quantity FROM order_items WHERE order_id = NEW.id LOOP
            IF r.product_id IS NOT NULL THEN
                -- Only refund if previously deducted
                IF EXISTS (SELECT 1 FROM inventory_logs WHERE order_id = NEW.id AND product_id = r.product_id AND reason = 'order_paid')
                   AND NOT EXISTS (SELECT 1 FROM inventory_logs WHERE order_id = NEW.id AND product_id = r.product_id AND reason = 'order_cancelled') THEN
                    UPDATE products 
                    SET stock_quantity = stock_quantity + r.quantity
                    WHERE id = r.product_id
                    RETURNING stock_quantity INTO curr_stock;

                    INSERT INTO inventory_logs (product_id, order_id, change_amount, current_stock, reason)
                    VALUES (r.product_id, NEW.id, r.quantity, COALESCE(curr_stock, 0), 'order_cancelled');
                END IF;
            END IF;
        END LOOP;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_order_inventory ON orders;
CREATE TRIGGER trg_sync_order_inventory
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_sync_order_inventory_on_update();

-- 5.4. FUNCTION: Auto-deduct inventory if order items inserted for an already PAID order
CREATE OR REPLACE FUNCTION fn_sync_inventory_on_item_insert()
RETURNS TRIGGER AS $$
DECLARE
    ord_pay_status VARCHAR(50);
    curr_stock INT;
BEGIN
    IF NEW.product_id IS NOT NULL THEN
        SELECT payment_status INTO ord_pay_status FROM orders WHERE id = NEW.order_id;
        IF UPPER(COALESCE(ord_pay_status, '')) = 'PAID' THEN
            IF NOT EXISTS (SELECT 1 FROM inventory_logs WHERE order_id = NEW.order_id AND product_id = NEW.product_id AND reason = 'order_paid') THEN
                UPDATE products 
                SET stock_quantity = GREATEST(0, stock_quantity - NEW.quantity)
                WHERE id = NEW.product_id
                RETURNING stock_quantity INTO curr_stock;

                INSERT INTO inventory_logs (product_id, order_id, change_amount, current_stock, reason)
                VALUES (NEW.product_id, NEW.order_id, -NEW.quantity, COALESCE(curr_stock, 0), 'order_paid');
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_inventory_item_insert ON order_items;
CREATE TRIGGER trg_sync_inventory_item_insert
AFTER INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION fn_sync_inventory_on_item_insert();

-- 5.5. FUNCTION: Audit trail for order status transitions
CREATE OR REPLACE FUNCTION fn_audit_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_notes TEXT;
BEGIN
    IF (OLD.order_status IS DISTINCT FROM NEW.order_status) OR (OLD.payment_status IS DISTINCT FROM NEW.payment_status) THEN
        v_notes := 'Status changed: [order_status: ' || COALESCE(OLD.order_status, 'none') || ' -> ' || COALESCE(NEW.order_status, 'none') || ']'
                   || ', [payment_status: ' || COALESCE(OLD.payment_status, 'none') || ' -> ' || COALESCE(NEW.payment_status, 'none') || ']';
        
        INSERT INTO audit_logs (order_id, entity_type, actor, old_status, new_status, notes)
        VALUES (
            NEW.id,
            'order',
            'system',
            OLD.order_status,
            NEW.order_status,
            v_notes
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_order_status_change ON orders;
CREATE TRIGGER trg_audit_order_status_change
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION fn_audit_order_status_change();
