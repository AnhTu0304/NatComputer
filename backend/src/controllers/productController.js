const ProductModel = require('../models/ProductModel');
const CouponModel = require('../models/CouponModel');

class ProductController {
  static async getProducts(req, res) {
    const { category, search } = req.query;
    const items = await ProductModel.getAll({ category, search });
    res.json({ total: items.length, products: items });
  }

  static async getProductById(req, res) {
    const { id } = req.params;
    const product = await ProductModel.getById(id);
    if (!product) {
      return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
    }
    res.json({ product });
  }

  static async getCategories(req, res) {
    const categories = await ProductModel.getCategories();
    res.json({ categories });
  }

  static async getBanners(req, res) {
    const banners = await ProductModel.getBanners();
    res.json({ banners });
  }

  static async validateCoupon(req, res) {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, error: 'Vui lòng nhập mã giảm giá.' });
    }

    const cleanCode = code.trim().toUpperCase();
    const coupon = await CouponModel.findByCode(cleanCode);

    if (!coupon) {
      return res.status(404).json({ valid: false, error: `Mã giảm giá "${cleanCode}" không tồn tại.` });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ valid: false, error: `Mã giảm giá "${cleanCode}" hiện đang tạm khóa.` });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ valid: false, error: `Mã giảm giá "${cleanCode}" đã hết lượt sử dụng.` });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ valid: false, error: `Mã giảm giá "${cleanCode}" đã hết thời hạn áp dụng.` });
    }

    const numCartTotal = parseFloat(cartTotal) || 0;
    if (coupon.minOrderAmount && numCartTotal < coupon.minOrderAmount) {
      const fmt = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(coupon.minOrderAmount);
      return res.status(400).json({
        valid: false,
        error: `Đơn hàng chưa đạt mức tối thiểu ${fmt} để áp dụng mã "${cleanCode}".`
      });
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, numCartTotal);
    } else if (coupon.discountType === 'percent') {
      discountAmount = (numCartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    const finalTotal = Math.max(0, numCartTotal - discountAmount);

    res.json({
      valid: true,
      coupon,
      discountAmount,
      finalTotal,
      message: `Áp dụng mã ${coupon.code} thành công! Bạn được giảm ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountAmount)}.`
    });
  }
}

module.exports = ProductController;
