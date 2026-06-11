const announcementModel = require('../models/announcementModel');

const announcementController = {
  async getAll(req, res) {
    try {
      const announcements = await announcementModel.findAll();
      return res.json({ success: true, data: announcements });
    } catch (err) {
      console.error('Get announcements error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async getById(req, res) {
    try {
      const announcement = await announcementModel.findById(req.params.id);
      if (!announcement) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
      }
      return res.json({ success: true, data: announcement });
    } catch (err) {
      console.error('Get announcement error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async create(req, res) {
    try {
      const { title, content } = req.body;

      if (!title || !content) {
        return res.status(400).json({ success: false, message: 'title and content are required.' });
      }

      const id = await announcementModel.create({ title, content, created_by: req.user.id });
      const announcement = await announcementModel.findById(id);
      return res.status(201).json({ success: true, data: announcement });
    } catch (err) {
      console.error('Create announcement error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async delete(req, res) {
    try {
      const existing = await announcementModel.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, message: 'Announcement not found.' });
      }

      if (req.user.role === 'high_committee' && existing.created_by !== req.user.id) {
        return res.status(403).json({ success: false, message: 'You can only delete your own announcements.' });
      }

      await announcementModel.delete(req.params.id);
      return res.json({ success: true, message: 'Announcement deleted successfully.' });
    } catch (err) {
      console.error('Delete announcement error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = announcementController;
