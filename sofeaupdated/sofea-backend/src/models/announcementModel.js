const db = require('../db');

// announcements 实际字段: announcement_id, created_by, title, content, target_role, published_at

const announcementModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT an.*, u.name AS created_by_name
      FROM announcements an
      LEFT JOIN users u ON an.created_by = u.user_id
      ORDER BY an.published_at DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(`
      SELECT an.*, u.name AS created_by_name
      FROM announcements an
      LEFT JOIN users u ON an.created_by = u.user_id
      WHERE an.announcement_id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create({ title, content, created_by, target_role }) {
    const [result] = await db.query(
      'INSERT INTO announcements (title, content, created_by, target_role) VALUES (?, ?, ?, ?)',
      [title, content, created_by, target_role || 'all']
    );
    return result.insertId;
  },

  async delete(id) {
    const [result] = await db.query(
      'DELETE FROM announcements WHERE announcement_id = ?',
      [id]
    );
    return result.affectedRows;
  }
};

module.exports = announcementModel;
