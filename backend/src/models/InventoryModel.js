const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class InventoryModel {
  static async getLogsByProductId(productId, limit = 50) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const res = await dbModule.query(
          `SELECT * FROM inventory_logs 
           WHERE product_id = $1 
           ORDER BY created_at DESC 
           LIMIT $2`,
          [productId, limit]
        );
        return res.rows;
      } catch (err) {
        console.error('PostgreSQL get inventory logs error:', err.message);
      }
    }

    const db = readDB();
    return (db.inventory_logs || [])
      .filter(l => l.product_id === productId)
      .slice(0, limit);
  }

  static async logChange({ productId, orderId = null, changeAmount, currentStock, reason }) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const res = await dbModule.query(
          `INSERT INTO inventory_logs (product_id, order_id, change_amount, current_stock, reason)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING *`,
          [productId, orderId, changeAmount, currentStock, reason]
        );
        return res.rows[0];
      } catch (err) {
        console.error('PostgreSQL insert inventory log error:', err.message);
      }
    }

    const db = readDB();
    db.inventory_logs = db.inventory_logs || [];
    const newLog = {
      id: Date.now(),
      product_id: productId,
      order_id: orderId,
      change_amount: changeAmount,
      current_stock: currentStock,
      reason,
      created_at: new Date().toISOString()
    };
    db.inventory_logs.unshift(newLog);
    writeDB(db);
    return newLog;
  }
}

module.exports = InventoryModel;
