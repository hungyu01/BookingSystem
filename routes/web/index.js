const express = require('express');
const router = express.Router();
const Profile = require('../../models/ProfileModel');
const Reservation = require('../../models/ReservationModel');
const ensureAuthenticated = require('../../middleware/auth')

router.get('/', ensureAuthenticated, (req, res) => {
  res.redirect('/dashboard');
});

// 首頁路由
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

// 預約空間
router.post('/reserve', ensureAuthenticated, async (req, res) => {
  console.log('Received data:', req.body);  // 檢查接收到的數據
  const { date, space, startTime, endTime, username, purpose, email } = req.body;
  try {
    const reservation = new Reservation({ 
      date, 
      space, 
      startTime, 
      endTime, 
      username, 
      purpose, 
      email, 
      user: req.user._id 
    });
    await reservation.save();
    
    // 發送郵件功能
    const reservationTime = new Date(`${date}T${startTime}`);
    const reminderTime = new Date(reservationTime.getTime() - 15 * 60000); // 預約前 15 分鐘
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
      }
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: '會議提醒',
      text: `您好，您的會議將在 15 分鐘後開始，請使用以下鏈接加入會議: http://example.com/meeting/${reservation._id}`
    };
    setTimeout(() => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log('Error while sending email:', error);
        }
        console.log('Email sent:', info.response);
      });
    }, reminderTime - Date.now());
    res.json({ success: true, message: '預約成功' });
  } catch (err) {
    console.error('預約失敗:', err);
    res.json({ success: false, message: '預約失敗' });
  }
});


// 獲取特定日期的預約資料
router.get('/reservations', ensureAuthenticated, async (req, res) => {
  const { date } = req.query;
  try {
    const reservations = await Reservation.find({ date, user: req.user._id });
    res.json({ success: true, reservations });
  } catch (err) {
    console.error('獲取預約資料失敗:', err);
    res.json({ success: false, message: '獲取預約資料失敗' });
  }
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
      profile = new Profile({ user: req.user._id, spaces: [], startTime, endTime });
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
    const spaceIndex = profile.spaces.findIndex(space => space._id.toString() === req.params.id);
    if (spaceIndex === -1) {
      return res.status(404).send('Space not found.');
    }
    profile.spaces.splice(spaceIndex, 1);
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
