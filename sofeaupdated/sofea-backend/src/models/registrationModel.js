const db = require('../db');

const registrationModel = {
  async findByActivityId(activityId) {
    const [rows] = await db.query(`
      SELECT r.*, u.name AS user_name, u.email AS user_email
      FROM registrations r
      JOIN users u ON r.user_id = u.user_id
      WHERE r.activity_id = ? AND r.status = 'registered'
      ORDER BY r.registered_at DESC
    `, [activityId]);
    return rows;
  },

  async findByUserAndActivity(userId, activityId) {
    const [rows] = await db.query(
      "SELECT * FROM registrations WHERE user_id = ? AND activity_id = ? AND status = 'registered'",
      [userId, activityId]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM registrations WHERE registration_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ activity_id, user_id }) {
    const [result] = await db.query(
      "INSERT INTO registrations (activity_id, user_id, status) VALUES (?, ?, 'registered')",
      [activity_id, user_id]
    );
    return result.insertId;
  },

  async cancel(id) {
    const [result] = await db.query(
      "UPDATE registrations SET status = 'cancelled' WHERE registration_id = ?",
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = registrationModel;
