var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// 新增：引入数据库连接
const db = require('./db');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// ========== 新增跨域 + 查询接口 ==========
// 允许前端跨域访问
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  next();
});

// 查询用户列表接口，读取mysql的user表
app.get('/api/getUserList', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user');
    res.json({
      code: 200,
      msg: '查询成功',
      data: rows
    });
  } catch (err) {
    res.json({
      code: 500,
      msg: '数据库连接失败',
      error: err.message
    });
  }
});
// ======================================

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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