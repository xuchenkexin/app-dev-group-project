const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const db = require('../db');

// Server-side in-memory store shared across all requests: { activityId → { code, expiresAt } }
const checkinCodes = new Map();

// SA Advisor: generate a check-in code for an activity
router.post('/generate/:activityId', authMiddleware, roleMiddleware('sa_advisor'), (req, res) => {
  const activityId = String(req.params.activityId);
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  checkinCodes.set(activityId, { code, expiresAt });
  return res.json({ success: true, data: { code, expires: expiresAt.toISOString() } });
});

// Any authenticated user: submit check-in code for an activity
router.post('/submit', authMiddleware, async (req, res) => {
  const { activity_id, code } = req.body;
  const userId = req.user.id;

  if (!activity_id || !code) {
    return res.status(400).json({ success: false, message: 'activity_id and code are required.' });
  }

  const entry = checkinCodes.get(String(activity_id));
  if (!entry) {
    return res.status(400).json({ success: false, message: 'No active check-in code for this activity.' });
  }
  if (new Date() > new Date(entry.expiresAt)) {
    checkinCodes.delete(String(activity_id));
    return res.status(400).json({ success: false, message: 'Check-in code has expired.' });
  }
  if (entry.code !== code.trim().toUpperCase()) {
    return res.status(400).json({ success: false, message: 'Invalid check-in code.' });
  }

  try {
    // Require an existing registration — cannot check in without registering first
    const [regs] = await db.query(
      "SELECT * FROM registrations WHERE user_id = ? AND activity_id = ? AND status = 'registered'",
      [userId, activity_id]
    );
    const registration = regs[0];

    if (!registration) {
      return res.status(400).json({
        success: false,
        message: 'You are not registered for this activity. Please register first.',
      });
    }

    const registrationId = registration.registration_id;

    // Idempotent: if already checked in, just return success
    const [existing] = await db.query(
      'SELECT * FROM attendance WHERE registration_id = ?',
      [registrationId]
    );
    if (existing[0]) {
      return res.json({ success: true, message: 'Already checked in.' });
    }

    // Create attendance record
    await db.query(
      "INSERT INTO attendance (registration_id, status, marked_by) VALUES (?, 'present', ?)",
      [registrationId, userId]
    );

    return res.json({ success: true, message: 'Check-in successful.' });
  } catch (err) {
    console.error('Submit check-in error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
