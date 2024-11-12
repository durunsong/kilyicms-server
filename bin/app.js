require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const indexRouter = require('../routes/index');
const usersRouter = require('../routes/users');
const dbVersionRouter = require('../routes/db-version');

const app = express();

app.use(bodyParser.json());
app.use(
    cors({
        origin: '*', // 或者指定允许的源
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
);
app.options('*', (req, res) => {
    res.sendStatus(200); // 处理预检请求
});

// 设置静态资源目录
app.use(express.static(path.join(__dirname, '../public')));

// 设置视图引擎
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

app.use(logger('dev')); // 使用日志中间件
app.use(express.json()); // 解析 JSON 格式请求体
app.use(express.urlencoded({ extended: false })); // 解析 URL 编码请求体
app.use(cookieParser()); // 解析 Cookies
app.use(express.static(path.join(__dirname, 'public'))); // 提供静态文件

// 配置路由
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/db-version', dbVersionRouter); // 数据库版本路由

// 处理 404 错误
app.use(function (req, res, next) {
  next(createError(404));
});

// 错误处理
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500).render('error');
});

module.exports = app;
