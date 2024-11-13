const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { sql } = require('../db/db-connection'); // 假设你已设置 Neon 数据库连接
const secretKey = process.env.JWT_SECRET; // 从环境变量中获取密钥

// 获取用户详情接口
router.get("/", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // 从请求头获取 token
    if (!token) {
        return res.status(401).json({
            status: 401,
            message: "Token 不存在"
        });
    }
    try {
        const decoded = jwt.verify(token, secretKey);
        const userName = decoded.userName;
        if (!userName) {
            return res.status(403).json({ status: 'error', message: 'Token 无效或用户信息缺失' });
        }
        // 查询数据库获取用户信息
        const query = `
            SELECT 
                id, account, create_time, update_time, is_delete, password, 
                description, user_name, nick_name, role_ids, avatar, uuid, roles
            FROM users
            WHERE user_name = $1 AND is_delete = 0
        `;
        const result = await sql(query, [userName]);
        // 判断返回的数据结构是否正确
        if (!result || result.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "用户不存在或已被删除"
            });
        }
        const user = Array.isArray(result) ? result[0] : result.rows[0];
        // 返回用户信息
        const userInfo = {
            userName: user.user_name,
            account: user.account,
            avatar: user.avatar,
            description: user.description,
            create_time: user.create_time,
            update_time: user.update_time,
            is_delete: user.is_delete,
            nick_name: user.nick_name,
            role_ids: user.role_ids,
            id: user.id,
            roles: user.roles,
        };
        res.status(200).json({
            status: 200,
            message: "获取用户信息成功",
            userInfo
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({
            status: 403,
            message: "登录过期，请重新登录"
        });
    }
});


module.exports = router;