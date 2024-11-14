require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');

const app = express();

// 加载中间件
require('../middleware/index')(app);
// OPTIONS 预检请求处理
app.options('*', (req, res) => {
  res.sendStatus(204);
});

// 设置静态资源目录
app.use(express.static(path.join(__dirname, '../public')));

// 设置视图引擎
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// 加载路由
require('../routes/index')(app);

// 处理 404 错误
app.use((req, res, next) => {
  next(createError(404));
});

// 错误处理
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error');
});

module.exports = app;
