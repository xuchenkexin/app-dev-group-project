const db = require('../db');

// notifications 实际字段: notification_id, announcement_id, user_id, is_read, sent_at
// 通知内容通过 JOIN announcements 获取，无独立 message 字段

const notificationModel = {
  async findByUserId(userId) {
    const [rows] = await db.query(`
      SELECT n.*, a.title AS announcement_title, a.content AS announcement_content
      FROM notifications n
      LEFT JOIN announcements a ON n.announcement_id = a.announcement_id
      WHERE n.user_id = ?
      ORDER BY n.sent_at DESC
    `, [userId]);
    return rows;
  },

  async getUnreadCount(userId) {
    const [rows] = await db.query(
      'SELECT COUNT(*) AS count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );
    return rows[0].count;
  },

  async markAsRead(id) {
    const [result] = await db.query(
      'UPDATE notifications SET is_read = 1 WHERE notification_id = ?',
      [id]
    );
    return result.affectedRows;
  },

  async create({ user_id, announcement_id }) {
    const [result] = await db.query(
      'INSERT INTO notifications (user_id, announcement_id, is_read) VALUES (?, ?, 0)',
      [user_id, announcement_id]
    );
    return result.insertId;
  }
};

module.exports = notificationModel;
