const ReviewModel = require('../models/ReviewModel');
const CacheService = require('../services/cacheService');
const { dbModule, readDB } = require('../config/dbHelper');

class ReviewController {
  static async getProductReviews(req, res) {
    try {
      const { id } = req.params;
      const reviews = await ReviewModel.getByProductId(id);
      res.json({ total: reviews.length, reviews });
    } catch (err) {
      console.error('Lỗi lấy reviews sản phẩm:', err.message);
      res.status(500).json({ error: 'Không thể tải danh sách đánh giá.' });
    }
  }

  static async submitReview(req, res) {
    try {
      const { id: productId } = req.params;
      const { rating, comment } = req.body;
      const userId = req.user?.id;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Số sao đánh giá phải từ 1 đến 5.' });
      }

      // Check if user has purchased this product and payment is PAID
      let isVerifiedPurchase = false;
      if (dbModule.getIsPostgresConnected()) {
        try {
          const checkRes = await dbModule.query(
            `SELECT 1 
             FROM orders o
             JOIN order_items oi ON o.id = oi.order_id
             WHERE (o.user_id = $1 OR LOWER(o.customer_email) = LOWER($2))
               AND oi.product_id = $3
               AND UPPER(o.payment_status) = 'PAID'
             LIMIT 1`,
            [userId, req.user?.email || '', productId]
          );
          isVerifiedPurchase = checkRes.rows.length > 0;
        } catch (e) {
          console.warn('Lỗi kiểm tra verified purchase trên PG:', e.message);
        }
      } else {
        const db = readDB();
        const paidOrders = (db.orders || []).filter(o => 
          (o.userId === userId || (o.customerEmail && o.customerEmail.toLowerCase() === (req.user?.email || '').toLowerCase())) &&
          (o.paymentStatus === 'PAID')
        );
        isVerifiedPurchase = paidOrders.some(o => 
          (o.items || []).some(it => it.id === productId || it.product_id === productId)
        );
      }

      const review = await ReviewModel.create({
        productId,
        userId,
        rating: parseInt(rating, 10),
        comment: comment || '',
        isVerifiedPurchase
      });

      // Clear cached product listings so updated ratings reflect immediately
      CacheService.delPrefix('api:products');

      res.status(201).json({
        message: 'Đánh giá sản phẩm thành công!',
        review
      });
    } catch (err) {
      console.error('Lỗi gửi đánh giá sản phẩm:', err.message);
      res.status(500).json({ error: 'Không thể gửi đánh giá lúc này.' });
    }
  }
}

module.exports = ReviewController;
