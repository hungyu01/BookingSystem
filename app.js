const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport'); // 引入 passport
const passportConfig = require('./config/passport'); 
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./db/db');

const app = express();

// 配置 passport
passportConfig(passport);

// 設置視圖路徑和模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

// 全局設置變數
app.use((req, res, next) => {
  res.locals.title = '空間預約系統'; // 設置全局變數 title
  res.locals.user = req.user;        // 設置全局變數 user
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// 使用 db.js 中的方法連接 MongoDB
connectDB(
  () => console.log('MongoDB 連接成功～'),
  (err) => console.error('MongoDB 連接失敗: ', err)
);

// 設置路由
app.use('/', require('./routes/web/index'));
app.use('/users', require('./routes/web/user'));
app.use('/api', require('./routes/api/api'));

// 處理 404 錯誤
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 錯誤處理中介軟體
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});

module.exports = app;
