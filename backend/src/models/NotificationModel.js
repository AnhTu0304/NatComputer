const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class NotificationModel {
  static async getAll() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
        const notis = result.rows.map(n => ({
          id: n.id,
          title: n.title,
          desc: n.message,
          type: n.type,
          isRead: n.is_read,
          orderId: n.order_id,
          time: 'Vừa xong',
          createdAt: n.created_at
        }));
        return { notifications: notis, unreadCount: notis.filter(n => !n.isRead).length };
      } catch (err) {
        console.error('PostgreSQL get notifications error:', err.message);
      }
    }

    const db = readDB();
    const notis = (db.notifications || []).map(n => ({
      ...n,
      desc: n.message || n.desc,
      time: n.time || 'Vừa xong'
    }));
    return { notifications: notis, unreadCount: notis.filter(n => !n.isRead).length };
  }

  static async markRead(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [id]);
      } catch (err) {
        console.error('PostgreSQL update notification error:', err.message);
      }
    }

    const db = readDB();
    const noti = (db.notifications || []).find(n => n.id === id);
    if (noti) noti.isRead = true;
    writeDB(db);
    return true;
  }

  static async markAllRead() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query('UPDATE notifications SET is_read = TRUE');
      } catch (err) {
        console.error('PostgreSQL mark all notifications read error:', err.message);
      }
    }

    const db = readDB();
    db.notifications = (db.notifications || []).map(n => ({ ...n, isRead: true }));
    writeDB(db);
    return true;
  }

  static async create({ id, title, message, type = 'order', orderId = null }) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        await dbModule.query(
          `INSERT INTO notifications (id, title, message, type, is_read, order_id)
           VALUES ($1, $2, $3, $4, false, $5)`,
          [id, title, message, type, orderId]
        );
      } catch (e) {
        console.error('PostgreSQL notification insert error:', e.message);
      }
    }

    const db = readDB();
    db.notifications = db.notifications || [];
    const noti = {
      id,
      title,
      message,
      type,
      isRead: false,
      orderId,
      createdAt: new Date().toISOString()
    };
    db.notifications.unshift(noti);
    writeDB(db);
    return noti;
  }
}

module.exports = NotificationModel;
