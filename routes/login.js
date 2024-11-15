const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { sql } = require('../db/db-connection'); // 引入Neon数据库连接模块
const secretKey = process.env.JWT_SECRET; // 从环境变量中获取密钥

// 登录接口
router.post('/', async (req, res) => {
    const { user_name, password } = req.body;
    // 校验必填字段
    if (!user_name || !password) {
        return res.status(400).json({ status: 400, message: "账号和密码都是必需的" });
    }
    try {
        // 查询用户信息
        const result = await sql('SELECT * FROM users WHERE user_name = $1 AND is_delete = 0', [user_name]);
        if (result.length === 0) {
            return res.status(409).json({ status: 409, message: "用户不存在" });
        }
        const user = result[0];
        const hashFromDb = user.password;
        // 验证密码是否匹配
        const passWordMatch = await bcrypt.compare(password, hashFromDb);
        if (!passWordMatch) {
            return res.status(409).json({ status: 409, message: "用户名或密码错误" });
        }
        // 生成 JWT Token
        const token = jwt.sign(
            { id: user.id, user_name: user.user_name },
            secretKey, // 替换为您的 JWT 秘钥
            { expiresIn: "1h" }
        );
        // 获取登录时间
        const login_time = moment().format("YYYY-MM-DD HH:mm:ss");
        // 返回响应
        res.status(200).json({ message: "登录成功", status: 200, token, login_time });
    } catch (error) {
        console.error('数据库错误:', error);
        res.status(500).json({ status: 500, message: "查询用户失败" });
    }
})

module.exports = router;
