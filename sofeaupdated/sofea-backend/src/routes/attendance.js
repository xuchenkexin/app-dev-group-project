const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/activity/:activityId', authMiddleware, attendanceController.getByActivityId);
router.post('/', authMiddleware, roleMiddleware('sa_advisor'), attendanceController.markAttendance);
router.put('/:id', authMiddleware, attendanceController.updateAttendance);

module.exports = router;
