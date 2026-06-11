require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth');
const activityRoutes = require('./src/routes/activities');
const registrationRoutes = require('./src/routes/registrations');
const attendanceRoutes = require('./src/routes/attendance');
const financialRoutes = require('./src/routes/financial');
const announcementRoutes = require('./src/routes/announcements');
const dashboardRoutes = require('./src/routes/dashboard');
const userRoutes = require('./src/routes/users');
const checkinRoutes = require('./src/routes/checkin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/transactions', financialRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/checkin', checkinRoutes);

app.get('/', (req, res) => {
  res.json({ success: true, message: 'SoFea Management System API is running' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('========================================');
  console.log(`  SoFea Backend API started successfully`);
  console.log(`  Server running on http://localhost:${PORT}`);
  console.log(`  CORS enabled for http://localhost:5173`);
  console.log('========================================');
});
