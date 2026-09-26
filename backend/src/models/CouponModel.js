const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class CouponModel {
  static async findByCode(code) {
    const cleanCode = String(code).trim().toUpperCase();

    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query('SELECT * FROM coupons WHERE UPPER(code) = $1', [cleanCode]);
        if (result.rows.length > 0) {
          const r = result.rows[0];
          return {
            id: r.id,
            code: r.code,
            description: r.description,
            discountType: r.discount_type,
            discountValue: parseFloat(r.discount_value),
            minOrderAmount: parseFloat(r.min_order_amount || 0),
            maxDiscount: r.max_discount ? parseFloat(r.max_discount) : null,
            usageLimit: r.usage_limit,
            usedCount: r.used_count,
            expiresAt: r.expires_at,
            isActive: r.is_active,
            createdAt: r.created_at
          };
        }
      } catch (err) {
        console.error('PostgreSQL coupon lookup error:', err.message);
      }
    }

    const db = readDB();
    return (db.coupons || []).find(c => (c.code || '').toUpperCase() === cleanCode) || null;
  }

  static async getAll() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query(
          `SELECT id, code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, used_count, expires_at, is_active, created_at
           FROM coupons 
           ORDER BY created_at DESC`
        );
        return result.rows.map(r => ({
          id: r.id,
          code: r.code,
          description: r.description,
          discountType: r.discount_type,
          discountValue: parseFloat(r.discount_value),
          minOrderAmount: parseFloat(r.min_order_amount || 0),
          maxDiscount: r.max_discount ? parseFloat(r.max_discount) : null,
          usageLimit: r.usage_limit,
          usedCount: r.used_count,
          expiresAt: r.expires_at,
          isActive: r.is_active,
          createdAt: r.created_at
        }));
      } catch (err) {
        console.error('PostgreSQL admin getCoupons error:', err.message);
      }
    }

    const db = readDB();
    return db.coupons || [];
  }

  static async create(couponData) {
    const { id, code, description, discountType, discountValue, minOrderAmount, maxDiscount, usageLimit, expiresAt } = couponData;

    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `INSERT INTO coupons (id, code, description, discount_type, discount_value, min_order_amount, max_discount, usage_limit, expires_at, is_active)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, true)`,
          [id, code, description || '', discountType, discountValue, minOrderAmount || 0, maxDiscount || null, usageLimit || 100, expiresAt || null]
        );
      } catch (err) {
        console.error('PostgreSQL create coupon error:', err.message);
      }
    }

    const db = readDB();
    db.coupons = db.coupons || [];
    db.coupons.unshift(couponData);
    writeDB(db);
    return couponData;
  }

  static async toggle(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query(
          `UPDATE coupons SET is_active = NOT is_active WHERE id = $1 RETURNING *`,
          [id]
        );
        if (result.rows.length > 0) {
          return result.rows[0];
        }
      } catch (err) {
        console.error('PostgreSQL toggle coupon error:', err.message);
      }
    }

    const db = readDB();
    db.coupons = db.coupons || [];
    const coup = db.coupons.find(c => c.id === id);
    if (coup) {
      coup.isActive = !coup.isActive;
      writeDB(db);
      return coup;
    }
    return null;
  }

  static async delete(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query('DELETE FROM coupons WHERE id = $1', [id]);
      } catch (err) {
        console.error('PostgreSQL delete coupon error:', err.message);
      }
    }

    const db = readDB();
    db.coupons = (db.coupons || []).filter(c => c.id !== id);
    writeDB(db);
    return true;
  }
}

module.exports = CouponModel;
