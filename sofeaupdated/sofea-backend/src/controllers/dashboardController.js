const db = require('../db');
const activityModel = require('../models/activityModel');
const transactionModel = require('../models/transactionModel');
const notificationModel = require('../models/notificationModel');

const dashboardController = {
  async getStats(req, res) {
    try {
      const [[{ total_activities }]] = await db.query(
        'SELECT COUNT(*) AS total_activities FROM activities'
      );
      const [[{ active_activities }]] = await db.query(
        "SELECT COUNT(*) AS active_activities FROM activities WHERE status = 'open'"
      );

      const monthlyTotal      = await transactionModel.getMonthlyTotal();
      const unreadNotifications = await notificationModel.getUnreadCount(req.user.id);
      const allActivities     = await activityModel.findAll();
      const recentActivities  = allActivities.slice(0, 5);
      const recentTransactions = await transactionModel.getRecent(5);

      return res.json({
        success: true,
        data: {
          total_activities,
          active_activities,
          monthly_transaction_total: Number(monthlyTotal),
          unread_notifications: unreadNotifications,
          recent_activities: recentActivities,
          recent_transactions: recentTransactions
        }
      });
    } catch (err) {
      console.error('Dashboard stats error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = dashboardController;
