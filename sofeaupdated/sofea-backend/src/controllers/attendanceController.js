const attendanceModel = require('../models/attendanceModel');
const registrationModel = require('../models/registrationModel');

const attendanceController = {
  async getByActivityId(req, res) {
    try {
      const records = await attendanceModel.findByActivityId(req.params.activityId);
      return res.json({ success: true, data: records });
    } catch (err) {
      console.error('Get attendance error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async markAttendance(req, res) {
    try {
      const { registration_id, status } = req.body;

      if (!registration_id) {
        return res.status(400).json({ success: false, message: 'registration_id is required.' });
      }

      const registration = await registrationModel.findById(registration_id);
      if (!registration) {
        return res.status(404).json({ success: false, message: 'Registration not found.' });
      }

      const existing = await attendanceModel.findByRegistrationId(registration_id);
      if (existing) {
        return res.status(409).json({ success: false, message: 'Attendance already marked for this registration.' });
      }

      const id = await attendanceModel.create({
        registration_id,
        status: status || 'present',
        marked_by: req.user.id
      });

      const record = await attendanceModel.findById(id);
      return res.status(201).json({ success: true, data: record });
    } catch (err) {
      console.error('Mark attendance error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  },

  async updateAttendance(req, res) {
    try {
      const record = await attendanceModel.findById(req.params.id);
      if (!record) {
        return res.status(404).json({ success: false, message: 'Attendance record not found.' });
      }

      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'status is required.' });
      }

      await attendanceModel.update(req.params.id, { status, marked_by: req.user.id });
      const updated = await attendanceModel.findById(req.params.id);
      return res.json({ success: true, data: updated });
    } catch (err) {
      console.error('Update attendance error:', err);
      return res.status(500).json({ success: false, message: 'Internal server error.' });
    }
  }
};

module.exports = attendanceController;
