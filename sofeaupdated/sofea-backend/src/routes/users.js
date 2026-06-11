const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await userModel.findAll();
    return res.json({ success: true, data: users });
  } catch (err) {
    console.error('Get users error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

module.exports = router;
