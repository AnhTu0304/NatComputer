const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class OrderModel {
  static async create({ order, payment, items = [], appliedCoupon = null }) {
    const {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      paymentMethod,
      totalAmount
    } = order;

    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `INSERT INTO orders (id, customer_name, customer_email, customer_phone, shipping_address, payment_method, payment_status, order_status, total_amount)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [orderId, customerName, customerEmail, customerPhone, shippingAddress, paymentMethod, order.paymentStatus || 'PAID', order.status || 'PROCESSING', totalAmount]
        );

        if (payment) {
          await dbModule.query(
            `INSERT INTO payments (id, order_id, gateway, transaction_code, amount, status)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [payment.id, orderId, payment.gateway || paymentMethod, payment.transactionCode, totalAmount, payment.status || 'SUCCESS']
          );
        }

        for (const item of items) {
          await dbModule.query(
            `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price, specs_breakdown)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [orderId, item.id || 'pc-1', item.name || 'PC GAMING', item.quantity || 1, item.price || totalAmount, JSON.stringify(item.specs || {})]
          );
        }

        if (appliedCoupon) {
          await dbModule.query(
            `UPDATE coupons SET used_count = used_count + 1 WHERE UPPER(code) = UPPER($1) OR id = $1`,
            [appliedCoupon]
          );
        }
      } catch (err) {
        console.error('PostgreSQL order insert error:', err.message);
      }
    }

    const db = readDB();
    db.orders = db.orders || [];
    db.payments = db.payments || [];
    db.coupons = db.coupons || [];

    if (appliedCoupon) {
      const matchedCoup = db.coupons.find(c => c.code.toUpperCase() === appliedCoupon.toUpperCase() || c.id === appliedCoupon);
      if (matchedCoup) {
        matchedCoup.usedCount = (matchedCoup.usedCount || 0) + 1;
      }
    }

    db.orders.unshift(order);
    if (payment) {
      db.payments.unshift(payment);
    }
    writeDB(db);

    return { order, payment };
  }

  static async getById(orderId) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const orderRes = await dbModule.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        if (orderRes.rows.length > 0) {
          const o = orderRes.rows[0];
          const itemsRes = await dbModule.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
          return {
            id: o.id,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            customerPhone: o.customer_phone,
            shippingAddress: o.shipping_address,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            status: o.order_status,
            totalAmount: parseFloat(o.total_amount),
            createdAt: o.created_at,
            items: itemsRes.rows.map(it => ({
              id: it.product_id,
              name: it.product_name,
              quantity: it.quantity,
              price: parseFloat(it.unit_price),
              specs: typeof it.specs_breakdown === 'string' ? JSON.parse(it.specs_breakdown) : (it.specs_breakdown || {})
            }))
          };
        }
      } catch (err) {
        console.error('PostgreSQL get order error:', err.message);
      }
    }

    const db = readDB();
    return (db.orders || []).find(o => o.id === orderId) || null;
  }

  static async getAll() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const ordersRes = await dbModule.query('SELECT * FROM orders ORDER BY created_at DESC');
        if (ordersRes.rows.length > 0) {
          return ordersRes.rows.map(o => ({
            id: o.id,
            customerName: o.customer_name,
            customerEmail: o.customer_email,
            customerPhone: o.customer_phone,
            shippingAddress: o.shipping_address,
            paymentMethod: o.payment_method,
            paymentStatus: o.payment_status,
            status: o.order_status,
            totalAmount: parseFloat(o.total_amount),
            createdAt: o.created_at,
            items: []
          }));
        }
      } catch (err) {
        console.error('PostgreSQL get all orders error:', err.message);
      }
    }

    const db = readDB();
    return db.orders || [];
  }

  static async updateStatus(orderId, status) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query('UPDATE orders SET order_status = $1 WHERE id = $2', [status, orderId]);
      } catch (err) {
        console.error('PostgreSQL update order status error:', err.message);
      }
    }

    const db = readDB();
    db.orders = db.orders || [];
    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      writeDB(db);
      return order;
    }
    return null;
  }

  static async updatePaymentSuccess(orderId, transactionCode) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `UPDATE orders SET payment_status = 'PAID', order_status = 'PROCESSING' WHERE id = $1`,
          [orderId]
        );
        await dbModule.query(
          `UPDATE payments SET status = 'SUCCESS', transaction_code = $1 WHERE order_id = $2`,
          [transactionCode || 'TXN-' + Date.now(), orderId]
        );
      } catch (e) {
        console.error('PostgreSQL update payment success error:', e.message);
      }
    }

    const db = readDB();
    db.orders = db.orders || [];
    db.payments = db.payments || [];

    const order = db.orders.find(o => o.id === orderId);
    if (order) {
      order.paymentStatus = 'PAID';
      order.status = 'PROCESSING';
    }

    const payment = db.payments.find(p => p.orderId === orderId);
    if (payment) {
      payment.status = 'SUCCESS';
      payment.transactionCode = transactionCode || payment.transactionCode || 'TXN-' + Date.now();
    }

    writeDB(db);
    return { order, payment };
  }
}

module.exports = OrderModel;
