const express = require('express');
const corsMiddleware = require('./corsMiddleware');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

module.exports = (app) => {
    // 使用 CORS 中间件
    app.use(corsMiddleware);

    // 使用内置的 JSON 和 URL 解析中间件
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // 其他中间件
    app.use(morgan('dev')); // 日志中间件
    app.use(cookieParser()); // 解析 Cookies
};
