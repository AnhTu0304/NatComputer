const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/productController');
const CouponModel = require('../models/CouponModel');
const CacheService = require('../services/cacheService');

const ReviewController = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/products', CacheService.middleware('api:products', 300), ProductController.getProducts);
router.get('/products/:id', ProductController.getProductById);
router.get('/products/:id/reviews', ReviewController.getProductReviews);
router.post('/products/:id/reviews', verifyToken, ReviewController.submitReview);

router.get('/categories', CacheService.middleware('api:categories', 600), ProductController.getCategories);
router.get('/banners', CacheService.middleware('api:banners', 600), ProductController.getBanners);

router.get('/coupons', async (req, res) => {
  const coupons = await CouponModel.getAll();
  const activeCoupons = coupons.filter(c => {
    const isAct = c.isActive !== false;
    const notExhausted = (c.usedCount || 0) < (c.usageLimit || 999999);
    const notExpired = !c.expiresAt || new Date(c.expiresAt) > new Date();
    return isAct && notExhausted && notExpired;
  });
  res.json({ coupons: activeCoupons });
});

router.post('/coupons/validate', ProductController.validateCoupon);

module.exports = router;
