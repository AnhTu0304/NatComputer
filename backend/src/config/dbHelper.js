const fs = require('fs');
const path = require('path');
const dbModule = require('../../db');

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'db.json');

function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return {
      users: [],
      categories: [],
      banners: [],
      products: [],
      orders: [],
      payments: [],
      coupons: [],
      notifications: [],
      sent_emails: []
    };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing DB:', err);
  }
}

module.exports = {
  dbModule,
  readDB,
  writeDB
};
