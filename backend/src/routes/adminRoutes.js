const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { verifyToken, requireAdmin } = require('../middlewares/authMiddleware');

// Protect all admin endpoints
router.use(verifyToken, requireAdmin);

// Bank & VietQR Payment Settings
router.get('/settings/bank', AdminController.getBankSettings);
router.put('/settings/bank', AdminController.updateBankSettings);

// Orders
router.get('/orders', AdminController.getOrders);
router.get('/orders/:id/audit', AdminController.getOrderAuditTrail);
router.put('/orders/:id/status', AdminController.updateOrderStatus);
router.put('/orders/:id/confirm-payment', AdminController.confirmOrderPaymentManually);

// Inventory & Audit Logs
router.get('/inventory/logs', AdminController.getInventoryLogs);
router.get('/emails', AdminController.getSentEmails);

// Stats & Analytics
router.get('/stats', AdminController.getStats);

// Products CRUD
router.post('/products', AdminController.createProduct);
router.put('/products/:id', AdminController.updateProduct);
router.delete('/products/:id', AdminController.deleteProduct);

// Categories CRUD
router.get('/categories', AdminController.getCategories);
router.post('/categories', AdminController.createCategory);
router.delete('/categories/:id', AdminController.deleteCategory);

// Banners CRUD
router.get('/banners', AdminController.getBanners);
router.post('/banners', AdminController.createBanner);
router.delete('/banners/:id', AdminController.deleteBanner);

// Users Management
router.get('/users', AdminController.getUsers);
router.delete('/users/:id', AdminController.deleteUser);

// Notifications
router.get('/notifications', AdminController.getNotifications);
router.put('/notifications/:id/read', AdminController.markNotificationRead);
router.put('/notifications/read-all', AdminController.markAllNotificationsRead);

// Payments
router.get('/payments', AdminController.getPayments);

// Coupons CRUD
router.get('/coupons', AdminController.getCoupons);
router.post('/coupons', AdminController.createCoupon);
router.put('/coupons/:id/toggle', AdminController.toggleCoupon);
router.delete('/coupons/:id', AdminController.deleteCoupon);

module.exports = router;
