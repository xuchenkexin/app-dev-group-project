const db = require('../db');

const activityModel = {
  async findAll() {
    const [rows] = await db.query(`
      SELECT a.*, u.name AS created_by_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.activity_id = a.activity_id AND r.status = 'registered') AS registered_count
      FROM activities a
      LEFT JOIN users u ON a.created_by = u.user_id
      ORDER BY a.date DESC
    `);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(`
      SELECT a.*, u.name AS created_by_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.activity_id = a.activity_id AND r.status = 'registered') AS registered_count
      FROM activities a
      LEFT JOIN users u ON a.created_by = u.user_id
      WHERE a.activity_id = ?
    `, [id]);
    return rows[0] || null;
  },

  async create({ title, description, date, venue, status, max_slots, created_by }) {
    const [result] = await db.query(
      'INSERT INTO activities (title, description, date, venue, status, max_slots, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, date, venue, status || 'open', max_slots, created_by]
    );
    return result.insertId;
  },

  async update(id, { title, description, date, venue, status, max_slots }) {
    const [result] = await db.query(
      'UPDATE activities SET title=?, description=?, date=?, venue=?, status=?, max_slots=? WHERE activity_id=?',
      [title, description, date, venue, status, max_slots, id]
    );
    return result.affectedRows;
  },

  async delete(id) {
    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Delete attendance records linked to this activity's registrations
      await conn.query(
        `DELETE att FROM attendance att
         JOIN registrations r ON att.registration_id = r.registration_id
         WHERE r.activity_id = ?`,
        [id]
      );

      // 2. Delete registrations for this activity
      await conn.query('DELETE FROM registrations WHERE activity_id = ?', [id]);

      // 3. Delete the activity itself
      const [result] = await conn.query('DELETE FROM activities WHERE activity_id = ?', [id]);

      await conn.commit();
      return result.affectedRows;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }
};

module.exports = activityModel;
