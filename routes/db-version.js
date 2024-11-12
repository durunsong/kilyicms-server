const express = require('express');
const router = express.Router();
const { sql } = require('../db/db-connection'); // 引入数据库连接模块

// 获取数据库版本的接口
router.get('/', async (req, res) => {
    try {
        // 执行查询
        const result = await sql`SELECT version()`;
        const { version } = result[0]; // 从查询结果中获取数据库版本
        res.json({ version });
    } catch (error) {
        console.error('数据库错误:', error);
        res.status(500).json({ error: '数据库连接错误' });
    }
});

module.exports = router;
