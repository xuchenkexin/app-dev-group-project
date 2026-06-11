const db = require('../db');

const userModel = {
  async findByEmail(email) {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT user_id, name, email, role, created_at FROM users WHERE user_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findAll() {
    const [rows] = await db.query(
      'SELECT user_id, name, email, role, created_at FROM users ORDER BY created_at ASC'
    );
    return rows;
  },

  async create({ name, email, password, role }) {
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, password, role]
    );
    return result.insertId;
  }
};

module.exports = userModel;
