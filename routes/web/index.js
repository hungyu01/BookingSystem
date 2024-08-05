const express = require('express');
const router = express.Router();
const Profile = require('../../models/ProfileModel');
const Reservation = require('../../models/ReservationModel');
const ensureAuthenticated = require('../../middleware/auth')

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
    const timeRange = `${profile.startTime}-${profile.endTime}`;
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

router.get('/profile', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.render('profile', { title: 'User Profile', profile: profile || {} });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.render('profile', { title: 'User Profile', profile: {} });
  }
});

router.post('/profile', ensureAuthenticated, async (req, res) => {
  const { name, startTime, endTime } = req.body;
  try {
    let profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new Profile({ user: req.user._id, spaces: [{ name }], startTime, endTime });
    } else {
      if (name) {
        profile.spaces.push({ name });
      }
      profile.startTime = startTime;
      profile.endTime = endTime;
    }
    await profile.save();
    res.redirect('/profile');
  } catch (err) {
    console.error('儲存錯誤:', err);
    res.render('profile', { title: 'User Profile', profile, message: '儲存時失敗' });
  }
});

router.delete('/profile/spaces/:id', ensureAuthenticated, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).send('Profile not found.');
    }
    profile.spaces = profile.spaces.filter(space => space._id.toString() !== req.params.id);
    await profile.save();
    res.send('空間已成功刪除');
  } catch (err) {
    console.error('Error deleting space:', err);
    res.status(500).send('空間刪除失敗');
  }
});

// 更新時間範圍
router.post('/profile/time', ensureAuthenticated, async (req, res) => {
  const { startTime, endTime } = req.body;
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).send('Profile not found.');
    }
    profile.startTime = startTime;
    profile.endTime = endTime;
    await profile.save();
    res.redirect('/profile');
  } catch (err) {
    console.error('Error updating profile:', err);
    res.render('profile', { title: 'User Profile', profile, message: 'Failed to update time range.' });
  }
});

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
