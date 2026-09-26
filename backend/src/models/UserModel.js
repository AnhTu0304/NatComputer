const { dbModule, readDB, writeDB } = require('../config/dbHelper');

class UserModel {
  static async findByIdentifier(identifier) {
    const cleanIdentifier = String(identifier).trim().toLowerCase();

    if (dbModule.getIsPostgresConnected()) {
      try {
        const userRes = await dbModule.query(
          'SELECT id, name, email, phone, password, role, address FROM users WHERE LOWER(email) = $1 OR phone = $1',
          [cleanIdentifier]
        );
        if (userRes.rows.length > 0) {
          return userRes.rows[0];
        }
      } catch (err) {
        console.error('PostgreSQL findByIdentifier error:', err.message);
      }
    }

    const db = readDB();
    return (db.users || []).find(
      u => (u.email && u.email.toLowerCase() === cleanIdentifier) || u.phone === cleanIdentifier
    ) || null;
  }

  static async findById(id) {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const userRes = await dbModule.query(
          'SELECT id, name, email, phone, role, address, created_at FROM users WHERE id = $1',
          [id]
        );
        if (userRes.rows.length > 0) {
          return userRes.rows[0];
        }
      } catch (err) {
        console.error('PostgreSQL findById error:', err.message);
      }
    }

    const db = readDB();
    const user = (db.users || []).find(u => u.id === id);
    if (user) {
      const { password, ...safeUser } = user;
      return safeUser;
    }
    return null;
  }

  static async create({ id, name, email, phone, hashedPassword, role = 'customer', address }) {
    const cleanEmail = email.trim().toLowerCase();

    if (dbModule.getIsPostgresConnected()) {
      try {
        const inserted = await dbModule.query(
          `INSERT INTO users (id, name, email, phone, password, password_hash, role, address)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, email, phone, role, address, created_at`,
          [id, name, cleanEmail, phone, hashedPassword, hashedPassword, role, address]
        );
        return inserted.rows[0];
      } catch (err) {
        console.error('PostgreSQL register error:', err.message);
      }
    }

    const db = readDB();
    const newUser = {
      id,
      name,
      email: cleanEmail,
      phone,
      password: hashedPassword,
      role,
      address,
      createdAt: new Date().toISOString()
    };

    db.users = db.users || [];
    db.users.push(newUser);
    writeDB(db);

    const { password, ...safeUser } = newUser;
    return safeUser;
  }

  static async getAll() {
    if (dbModule.getIsPostgresConnected()) {
      try {
        const result = await dbModule.query(
          'SELECT id, name, email, phone, role, address, created_at FROM users ORDER BY created_at DESC'
        );
        if (result.rows.length > 0) {
          return result.rows;
        }
      } catch (err) {
        console.error('PostgreSQL get users error:', err.message);
      }
    }

    const db = readDB();
    return (db.users || []).map(({ password, ...u }) => u);
  }
}

module.exports = UserModel;
