const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', activityController.getAll);
router.get('/:id', activityController.getById);
router.post('/', authMiddleware, roleMiddleware('sa_advisor'), activityController.create);
router.put('/:id', authMiddleware, roleMiddleware('sa_advisor'), activityController.update);
router.delete('/:id', authMiddleware, roleMiddleware('sa_advisor'), activityController.delete);

module.exports = router;
