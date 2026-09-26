const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class PaymentModel {
  static async getAll() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query('SELECT * FROM payments ORDER BY created_at DESC');
        return result.rows.map(p => ({
          id: p.id,
          orderId: p.order_id,
          gateway: p.gateway,
          transactionCode: p.transaction_code,
          amount: parseFloat(p.amount),
          status: p.status,
          createdAt: p.created_at
        }));
      } catch (err) {
        console.error('PostgreSQL get payments error:', err.message);
      }
    }

    const db = readDB();
    return db.payments || [];
  }

  static async create(payment) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `INSERT INTO payments (id, order_id, gateway, transaction_code, amount, status)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [payment.id, payment.orderId, payment.gateway, payment.transactionCode, payment.amount, payment.status]
        );
      } catch (err) {
        console.error('PostgreSQL create payment error:', err.message);
      }
    }

    const db = readDB();
    db.payments = db.payments || [];
    db.payments.unshift(payment);
    writeDB(db);
    return payment;
  }
}

module.exports = PaymentModel;
