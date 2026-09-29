const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class AuditModel {
  static async getLogsByOrderId(orderId) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const res = await dbModule.query(
          `SELECT * FROM audit_logs 
           WHERE order_id = $1 
           ORDER BY created_at DESC`,
          [orderId]
        );
        return res.rows;
      } catch (err) {
        console.error('PostgreSQL get audit logs error:', err.message);
      }
    }

    const db = readDB();
    return (db.audit_logs || []).filter(l => l.order_id === orderId);
  }

  static async log({ orderId, entityType = 'order', actor = 'system', oldStatus, newStatus, notes }) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const res = await dbModule.query(
          `INSERT INTO audit_logs (order_id, entity_type, actor, old_status, new_status, notes)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [orderId, entityType, actor, oldStatus, newStatus, notes]
        );
        return res.rows[0];
      } catch (err) {
        console.error('PostgreSQL insert audit log error:', err.message);
      }
    }

    const db = readDB();
    db.audit_logs = db.audit_logs || [];
    const newLog = {
      id: Date.now(),
      order_id: orderId,
      entity_type: entityType,
      actor,
      old_status: oldStatus,
      new_status: newStatus,
      notes,
      created_at: new Date().toISOString()
    };
    db.audit_logs.unshift(newLog);
    writeDB(db);
    return newLog;
  }
}

module.exports = AuditModel;
