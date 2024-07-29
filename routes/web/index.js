const express = require('express');
const router = express.Router();
const Reservation = require('../../models/ReservationModel');

router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/dashboard');
});

router.get('/dashboard', (req, res) => {
  const spaces = req.user.spaces || [];
  const timeRange = req.user.timeRange || '8:00-22:00';
  const timeSlots = generateTimeSlots(timeRange);
  res.render('dashboard', { title: 'Dashboard', user: req.user, spaces, timeSlots });
});

router.post('/reservations', ensureAuthenticated, async (req, res) => {
  const { space, timeSlot, name, phone, email, purpose } = req.body;
  const existingReservation = await Reservation.findOne({ space, timeSlot });
  if (existingReservation) {
    return res.status(400).send('Time slot already booked.');
  }
  const reservation = new Reservation({ space, timeSlot, name, phone, email, purpose, userId: req.user.id });
  await reservation.save();
  res.redirect('/dashboard');
});

// 設定空間與時間 路由配置
router.get('/profile', (req, res) => {
  res.render('profile', { title: '使用者檔案', message: req.flash('error') });
});

router.post('/users/profile', async (req, res) => {
  const { spaces, timeRange } = req.body;
  try {
    req.user.spaces = spaces.split(',');
    req.user.timeRange = timeRange;
    await req.user.save();
    res.redirect('/dashboard');
  } catch (err) {
    res.render('profile', { title: '使用者檔案', message: 'Failed to save profile.' });
  }
});

// 帳號驗證方法
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

// Dashboard 表格的帶入
function generateTimeSlots(timeRange) {
  const [start, end] = timeRange.split('-').map(t => parseInt(t));
  const slots = [];
  for (let i = start; i <= end; i++) {
    slots.push(`${i}:00`);
  }
  return slots;
}

module.exports = router;
