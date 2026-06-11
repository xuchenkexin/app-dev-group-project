const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', announcementController.getAll);
router.get('/:id', announcementController.getById);
router.post('/', authMiddleware, roleMiddleware('sa_advisor'), announcementController.create);
router.delete('/:id', authMiddleware, roleMiddleware('sa_advisor', 'high_committee'), announcementController.delete);

module.exports = router;
