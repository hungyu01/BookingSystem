const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../models/UserModel');

// 登入頁面
router.get('/login', (req, res) => {
  res.render('login', { title: '空間預約系統', message: req.flash('error') });
});

// 處理登入請求
router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
}));

// 註冊頁面
router.get('/register', (req, res) => {
  res.render('register', { title: '空間預約系統', message: req.flash('error') });
});

// 處理註冊請求路由
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    // 檢查用戶是否已存在
    let user = await User.findOne({ username });
    if (user) {
      req.flash('error', 'Username already exists.');
      return res.redirect('/users/register');
    }
    
    // 創建新用戶
    user = new User({ username, password });
    await user.save();
    res.redirect('/users/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'User registration failed.');
    res.redirect('/users/register');
  }
});

// 登出路由
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) {
      console.error('Logout error:', err);
      return res.redirect('/');
    }
    res.redirect('/users/login');
  });
});

module.exports = router;
