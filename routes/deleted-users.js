const express = require('express');
const moment = require('moment');
const router = express.Router();
const { sql } = require('../db/db-connection');
const authMiddleware = require('../middleware/authMiddleware');

// 查询删除的用户
router.get('/', async (req, res) => {
    const { pageNum = 1, pageSize = 10, keywords = '' } = req.query;
    const page = Number(pageNum);
    const size = Number(pageSize);
    const startTime = req.query.startTime;
    const endTime = req.query.endTime;
    const offset = (page - 1) * size;
    try {
        // 修改查询条件为 is_delete = 1
        let query = `SELECT * FROM kilyicms_users WHERE is_delete = 1`;
        let countQuery = `SELECT COUNT(*) FROM kilyicms_users WHERE is_delete = 1`;
        const params = [];
        const countParams = [];
        let paramIndex = 1;
        // 处理关键词查询
        if (keywords) {
            params.push(`%${keywords}%`);
            countParams.push(`%${keywords}%`);
            query += ` AND (user_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            countQuery += ` AND (user_name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
            paramIndex++;
        }
        // 处理时间范围查询
        if (startTime && endTime) {
            params.push(startTime, endTime);
            countParams.push(startTime, endTime);
            query += ` AND create_time BETWEEN $${paramIndex}::timestamp AND $${paramIndex + 1}::timestamp`;
            countQuery += ` AND create_time BETWEEN $${paramIndex}::timestamp AND $${paramIndex + 1}::timestamp`;
            paramIndex += 2;
        }
        // 添加分页
        query += ` ORDER BY create_time DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
        params.push(size, offset);
        console.log('Query:', query);
        console.log('Params:', params);
        // 执行统计查询
        const totalResult = await sql(countQuery, countParams);
        const total = Number(totalResult[0]?.count || 0);
        // 如果没有数据，直接返回空数组
        if (total === 0) {
            return res.json({
                status: 200,
                message: 'Query Deleted Users Success',
                data: [],
                page: page,
                pageSize: size,
                total: 0,
            });
        }
        // 执行实际查询
        const result = await sql(query, params);
        // 格式化时间字段
        result.forEach(user => {
            if (user.create_time) {
                user.create_time = moment(user.create_time).format('YYYY-MM-DD HH:mm:ss');
            }
            if (user.update_time) {
                user.update_time = moment(user.update_time).format('YYYY-MM-DD HH:mm:ss');
            }
        });
        // 返回查询结果
        res.json({
            status: 200,
            message: 'Query Deleted Users Success',
            data: result,
            page: page,
            pageSize: size,
            total: total,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            message: 'Internal server error',
            error: err.message,
        });
    }
});

// 4. 删除用户（硬删除）
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        // 执行物理删除操作
        const query = `DELETE FROM kilyicms_users WHERE id = $1`;
        const result = await sql(query, [id]);
        // 判断是否成功删除
        if (result.rowCount === 0) {
            return res.status(409).json({
                status: 409,
                message: '用户不存在或已被删除'
            });
        }
        // 删除成功返回
        res.status(200).json({
            status: 200,
            message: '用户删除成功'
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