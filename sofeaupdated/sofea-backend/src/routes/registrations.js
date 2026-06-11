const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/activity/:activityId', authMiddleware, registrationController.getByActivityId);
router.post('/', authMiddleware, registrationController.register);
router.put('/:id/cancel', authMiddleware, registrationController.cancel);

module.exports = router;
