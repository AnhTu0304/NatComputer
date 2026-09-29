const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class ReviewModel {
  static async getByProductId(productId) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const res = await dbModule.query(
          `SELECT r.*, u.name as user_name, u.avatar_url 
           FROM product_reviews r
           LEFT JOIN users u ON r.user_id = u.id
           WHERE r.product_id = $1
           ORDER BY r.created_at DESC`,
          [productId]
        );
        return res.rows;
      } catch (err) {
        console.error('PostgreSQL get reviews error:', err.message);
      }
    }

    const db = readDB();
    return (db.product_reviews || []).filter(r => r.product_id === productId);
  }

  static async create({ id, productId, userId, rating, comment, isVerifiedPurchase = false }) {
    const reviewId = id || 'rev-' + Date.now();
    if (dbModule.getIsPostgresConnected()) {
      try {
        const res = await dbModule.query(
          `INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_verified_purchase)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [reviewId, productId, userId, rating, comment, isVerifiedPurchase]
        );
        return res.rows[0];
      } catch (err) {
        console.error('PostgreSQL insert review error:', err.message);
      }
    }

    const db = readDB();
    db.product_reviews = db.product_reviews || [];
    const newRev = {
      id: reviewId,
      product_id: productId,
      user_id: userId,
      rating,
      comment,
      is_verified_purchase: isVerifiedPurchase,
      created_at: new Date().toISOString()
    };
    db.product_reviews.unshift(newRev);
    writeDB(db);
    return newRev;
  }
}

module.exports = ReviewModel;
