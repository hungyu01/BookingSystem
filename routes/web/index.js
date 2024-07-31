const express = require('express');
const router = express.Router();
const Profile = require('../../models/ProfileModel');
const Reservation = require('../../models/ReservationModel');

router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/dashboard');
});

router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.render('dashboard', { title: 'Dashboard', user: req.user, spaces: [], timeSlots: [], profile: null, message: 'No profile found. Please set up your profile.' });
    }
    const spaces = profile.spaces;
    const timeRange = profile.timeRange;
    const timeSlots = generateTimeSlots(timeRange);
    res.render('dashboard', { title: 'Dashboard', user: req.user, spaces, timeSlots, profile });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.render('dashboard', { title: 'Dashboard', user: req.user, spaces: [], timeSlots: [], profile: null, message: 'Failed to load profile data.' });
  }
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

router.post('/profile', async (req, res) => {
  const { spaces, timeRange } = req.body;
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id, spaces: spaces.split(','), timeRange });
    } else {
      profile.spaces = spaces.split(',');
      profile.timeRange = timeRange;
    }
    await profile.save();
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
