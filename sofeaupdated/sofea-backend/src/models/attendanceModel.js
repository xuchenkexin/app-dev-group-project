const db = require('../db');

const attendanceModel = {
  async findByActivityId(activityId) {
    const [rows] = await db.query(`
      SELECT att.*, u.name AS user_name, u.email AS user_email,
             m.name AS marked_by_name
      FROM attendance att
      JOIN registrations r ON att.registration_id = r.registration_id
      JOIN users u ON r.user_id = u.user_id
      LEFT JOIN users m ON att.marked_by = m.user_id
      WHERE r.activity_id = ?
      ORDER BY att.marked_at DESC
    `, [activityId]);
    return rows;
  },

  async findByRegistrationId(registrationId) {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE registration_id = ?',
      [registrationId]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM attendance WHERE attendance_id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ registration_id, status, marked_by }) {
    const [result] = await db.query(
      'INSERT INTO attendance (registration_id, status, marked_by) VALUES (?, ?, ?)',
      [registration_id, status || 'present', marked_by]
    );
    return result.insertId;
  },

  async update(id, { status, marked_by }) {
    const [result] = await db.query(
      'UPDATE attendance SET status = ?, marked_by = ?, marked_at = NOW() WHERE attendance_id = ?',
      [status, marked_by, id]
    );
    return result.affectedRows;
  }
};

module.exports = attendanceModel;
