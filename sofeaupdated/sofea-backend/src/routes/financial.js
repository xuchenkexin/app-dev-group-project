const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financialController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/summary', authMiddleware, financialController.getSummary);
router.get('/', authMiddleware, financialController.getTransactions);
router.post('/', authMiddleware, roleMiddleware('sa_advisor', 'high_committee'), financialController.createTransaction);
router.delete('/:id', authMiddleware, roleMiddleware('sa_advisor', 'high_committee'), financialController.deleteTransaction);

module.exports = router;
