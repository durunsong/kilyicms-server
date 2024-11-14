const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const corsMiddleware = require('./corsMiddleware');

module.exports = (app) => {
    // 日志中间件
    app.use(logger('dev'));

    // 解析 JSON 和 URL 编码请求体
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 解析 Cookies
    app.use(cookieParser());

    // CORS 中间件
    app.use(corsMiddleware);
    app.options('*', (req, res) => res.sendStatus(200));
};
