const express = require('express');
const router = express.Router();
const { sql } = require('../db/db-connection'); // 假设你已设置 Neon 数据库连接
const authMiddleware = require('../middleware/authMiddleware'); // 引入中间件

// 获取用户详情接口
router.get("/", authMiddleware, async (req, res) => {
    const { user_name } = req.user; // 从 req.user 中获取用户信息
    try {
        // 查询数据库获取用户信息
        const query = `
            SELECT 
                id, account, create_time, update_time, is_delete, password, 
                description, user_name, nick_name, role_ids, avatar, uuid, roles
            FROM kilyicms_users
            WHERE user_name = $1 AND is_delete = 0
        `;
        const result = await sql(query, [user_name]);
        // 判断返回的数据结构是否正确
        if (!result || result.length === 0) {
            return res.status(409).json({
                status: 409,
                message: "用户不存在或已被删除"
            });
        }
        const user = Array.isArray(result) ? result[0] : result.rows[0];
        // 返回用户信息
        const userInfo = {
            user_name: user.user_name,
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
        return res.status(500).json({
            status: 500,
            message: "服务器错误，无法获取用户信息"
        });
    }
});

module.exports = router;
