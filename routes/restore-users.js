const express = require('express');
const router = express.Router();
const { sql } = require('../db/db-connection');
const authMiddleware = require('../middleware/authMiddleware');

// 5. 还原删除的用户
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // 查询该用户是否已被软删除
        const checkQuery = `SELECT is_delete FROM kilyicms_users WHERE id = $1`;
        const userResult = await sql(checkQuery, [id]);
        if (userResult.length === 0) {
            return res.status(409).json({
                status: 409,
                message: '用户不存在'
            });
        }
        // 检查是否是已删除用户
        const user = userResult[0];
        if (user.is_delete === 0) {
            return res.status(409).json({
                status: 409,
                message: '该用户未被删除，不需要还原'
            });
        }
        // 执行还原操作
        const restoreQuery = `UPDATE kilyicms_users SET is_delete = 0 WHERE id = $1`;
        const result = await sql(restoreQuery, [id]);
        // 判断是否有更新操作
        if (result.rowCount === 0) {
            return res.status(500).json({
                status: 500,
                message: '还原失败，数据库未更新'
            });
        }
        // 还原成功返回
        res.status(200).json({
            status: 200,
            message: '用户还原成功'
        });
    } catch (err) {
        // 处理服务器错误
        console.error(err);
        res.status(500).json({
            status: 500,
            message: '服务器内部错误',
            error: err.message
        });
    }
});

module.exports = router;