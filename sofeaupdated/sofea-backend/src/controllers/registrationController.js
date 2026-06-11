const registrationModel = require('../models/registrationModel');
const activityModel = require('../models/activityModel');

const registrationController = {
  async getByActivityId(req, res) {
    try {
      const registrations = await registrationModel.findByActivityId(req.params.activityId);
      return res.json({ success: true, data: registrations });
    } catch (err) {
      console.error('Get registrations error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async register(req, res) {
    try {
      const { activity_id } = req.body;
      const user_id = req.user.id;

      if (!activity_id) {
        return res.status(400).json({ success: false, message: 'activity_id is required.' });
      }

      const activity = await activityModel.findById(activity_id);
      if (!activity) {
        return res.status(404).json({ success: false, message: 'Activity not found.' });
      }
      if (activity.status !== 'open') {
        return res.status(400).json({ success: false, message: 'Activity is not open for registration.' });
      }
      if (activity.max_slots && activity.registered_count >= activity.max_slots) {
        return res.status(400).json({ success: false, message: 'Activity is full.' });
      }

      const existing = await registrationModel.findByUserAndActivity(user_id, activity_id);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Already registered for this activity.' });
      }

      const id = await registrationModel.create({ activity_id, user_id });
      const registration = await registrationModel.findById(id);
      return res.status(201).json({ success: true, data: registration });
    } catch (err) {
      console.error('Register error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async cancel(req, res) {
    try {
      const registration = await registrationModel.findById(req.params.id);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      const isOwner   = registration.user_id === req.user.id;
      const isAdvisor = req.user.role === 'sa_advisor';
      if (!isOwner && !isAdvisor) {
        return res.status(403).json({ success: false, message: 'Forbidden.' });
      }

      await registrationModel.cancel(req.params.id);
      return res.json({ success: true, message: 'Registration cancelled successfully.' });
    } catch (err) {
      console.error('Cancel registration error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = registrationController;
