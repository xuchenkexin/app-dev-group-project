const db = require('../db');

// transactions 实际字段: transaction_id, recorded_by, type, category, amount, description, date, created_at
// 注意: 无 activity_id 字段

const transactionModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT t.*, u.name AS recorded_by_name
      FROM transactions t
      LEFT JOIN users u ON t.recorded_by = u.user_id
      ORDER BY t.date DESC, t.created_at DESC
    `);
    return rows;
  },

  async create({ type, amount, description, category, recorded_by, date }) {
    const txDate = date || new Date().toISOString().split('T')[0];
    const [result] = await db.query(
      'INSERT INTO transactions (type, amount, description, category, recorded_by, date) VALUES (?, ?, ?, ?, ?, ?)',
      [type, amount, description || null, category || null, recorded_by, txDate]
    );
    return result.insertId;
  },

  async getSummary() {
    const [rows] = await db.query(`
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0      END), 0) AS total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0      END), 0) AS total_expense,
        COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE -amount END), 0) AS net_balance
      FROM transactions
    `);
    return rows[0];
  },

  async getMonthlyTotal() {
    const [rows] = await db.query(`
      SELECT COALESCE(SUM(amount), 0) AS monthly_total
      FROM transactions
      WHERE MONTH(date) = MONTH(NOW()) AND YEAR(date) = YEAR(NOW())
    `);
    return rows[0].monthly_total;
  },

  async delete(id) {
    const [result] = await db.query('DELETE FROM transactions WHERE transaction_id = ?', [id]);
    return result.affectedRows;
  },

  async getRecent(limit = 5) {
    const [rows] = await db.query(`
      SELECT t.*, u.name AS recorded_by_name
      FROM transactions t
      LEFT JOIN users u ON t.recorded_by = u.user_id
      ORDER BY t.date DESC, t.created_at DESC
      LIMIT ?
    `, [limit]);
    return rows;
  }
};

module.exports = transactionModel;
