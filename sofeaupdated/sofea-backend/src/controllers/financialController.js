const transactionModel = require('../models/transactionModel');

const financialController = {
  async getTransactions(req, res) {
    try {
      const transactions = await transactionModel.findAll();
      return res.json({ success: true, data: transactions });
    } catch (err) {
      console.error('Get transactions error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async createTransaction(req, res) {
    try {
      const { type, amount, description, category, date } = req.body;

      if (!type || !amount) {
        return res.status(400).json({ success: false, message: 'type and amount are required.' });
      }
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({ success: false, message: 'type must be income or expense.' });
      }
      if (isNaN(amount) || Number(amount) <= 0) {
        return res.status(400).json({ success: false, message: 'amount must be a positive number.' });
      }

      const id = await transactionModel.create({
        type,
        amount: Number(amount),
        description,
        category,
        date,
        recorded_by: req.user.id
      });

      const recent = await transactionModel.getRecent(1);
      return res.status(201).json({ success: true, data: recent[0] });
    } catch (err) {
      console.error('Create transaction error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async deleteTransaction(req, res) {
    try {
      const affected = await transactionModel.delete(req.params.id);
      if (!affected) {
        return res.status(404).json({ success: false, message: 'Transaction not found.' });
      }
      return res.json({ success: true, message: 'Transaction deleted successfully.' });
    } catch (err) {
      console.error('Delete transaction error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async getSummary(req, res) {
    try {
      const summary = await transactionModel.getSummary();
      return res.json({ success: true, data: summary });
    } catch (err) {
      console.error('Get summary error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = financialController;
