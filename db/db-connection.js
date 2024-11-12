require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

// 获取数据库连接字符串
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error('未提供数据库连接字符串!');
}

// 初始化 Neon 客户端
const sql = neon(databaseUrl);

module.exports = { sql }; // 导出数据库连接
