const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const favicon = require('serve-favicon')
const indexRouter = require('./routes/web/index');
const spacesRouter = require('./routes/web/spaces');
const timeslotsRouter = require('./routes/web/timeslots');
const apiRouter = require('./routes/api/api');
const MongoStore = require('connect-mongo');
const { DBHOST, DBPORT, DBNAME } = require('./config/config');
const session = require('express-session');
// const usersRouter = require('./routes/web/users');

const app = express();

// Session setup with MongoDB store
app.use(session({
  name: 'sid', //設定 cookie 的 name，預設是: connect.sid
  secret: 'aiml05_02', // 簽名
  saveUninitialized: false, // 是否在每次請求時都設定一個 cookie 儲存 session id
  resave: true, //在每次請求後重新保存 session
  store: MongoStore.create({
      mongoUrl: `mongodb://${DBHOST}:${DBPORT}/${DBNAME}` //資料庫的連接
  }),
  cookie: {
      httpOnly: true, //開啟後前端不能透過 JS 操作
      maxAge: 1000 * 60 * 60 * 24 * 7 //控制 session 過期的時間
  },
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(favicon(path.join(__dirname,'public/images','favicon.ico')))
app.use('/public',express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/spaces', spacesRouter);
app.use('/timeslots', timeslotsRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
