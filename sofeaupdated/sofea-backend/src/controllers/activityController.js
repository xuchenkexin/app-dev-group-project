const activityModel = require('../models/activityModel');

const activityController = {
  async getAll(req, res) {
    try {
      const activities = await activityModel.findAll();
      return res.json({ success: true, data: activities });
    } catch (err) {
      console.error('Get activities error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async getById(req, res) {
    try {
      const activity = await activityModel.findById(req.params.id);
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }
      return res.json({ success: true, data: activity });
    } catch (err) {
      console.error('Get activity error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async create(req, res) {
    try {
      const { title, description, date, venue, status, max_slots } = req.body;

      if (!title || !date || !venue) {
        return res.status(400).json({ success: false, message: 'Title, date, and venue are required.' });
      }

      const id = await activityModel.create({
        title, description, date, venue, status, max_slots,
        created_by: req.user.id
      });

      const activity = await activityModel.findById(id);
      return res.status(201).json({ success: true, data: activity });
    } catch (err) {
      console.error('Create activity error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async update(req, res) {
    try {
      const existing = await activityModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }

      const { title, description, date, venue, status, max_slots } = req.body;
      await activityModel.update(req.params.id, {
        title:       title       ?? existing.title,
        description: description ?? existing.description,
        date:        date        ?? existing.date,
        venue:       venue       ?? existing.venue,
        status:      status      ?? existing.status,
        max_slots:   max_slots   ?? existing.max_slots
      });

      const updated = await activityModel.findById(req.params.id);
      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error('Update activity error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async delete(req, res) {
    try {
      const existing = await activityModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }

      await activityModel.delete(req.params.id);
      return res.json({ success: true, message: 'Activity deleted successfully.' });
    } catch (err) {
      console.error('Delete activity error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = activityController;
