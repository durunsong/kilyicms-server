const express = require('express');
const router = express.Router();
const { sql } = require('../db/db-connection');
const { hashPassword, verifyToken, formatDate } = require('../utils/utils');
const { v4: uuidv4 } = require('uuid');

// 中间件：验证 Token
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Unauthorized');

  const decoded = verifyToken(token);
  if (!decoded) return res.status(401).send('Invalid token');

  req.user = decoded;
  next();
};

// 1. 新增用户
router.post('/', async (req, res) => {
  const { userName, password, description, roles } = req.body;
  // 检查必填字段
  if (!userName || !password || !description || !roles) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const hashedPassword = await hashPassword(password);
    const uuid = uuidv4();
    const create_time = formatDate();
    const update_time = formatDate();
    const account = 'testuser';
    const is_delete = 0;
    const nick_name = '管理员';
    const role_ids = [101, 102, 301];
    const avatar = 'https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';
    // 插入用户数据
    const query = `
      INSERT INTO users (uuid, user_name, password, description, roles, account, create_time, update_time, is_delete, nick_name, role_ids, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      uuid, userName, hashedPassword, description, JSON.stringify(roles),
      account, create_time, update_time, is_delete, nick_name,
      JSON.stringify(role_ids), avatar
    ];
    const result = await sql(query, values);
    // 检查结果并返回
    if (!result || result.length === 0) {
      return res.status(500).json({ message: 'Database insertion failed, no data returned.' });
    }
    // 直接返回插入的数据
    res.json({ status: 200, message: "创建成功", data: result[0] }); // 直接返回第一个用户数据对象
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "创建失败", error: err.message });
  }
});

// 2. 查询用户
// router.get('/', authMiddleware, async (req, res) => {
router.get('/', async (req, res) => {
  const { pageNum = 1, pageSize = 10, keywords = '', startTime, endTime } = req.query;
  const offset = (pageNum - 1) * pageSize;
  try {
    let query = `SELECT * FROM users WHERE is_delete = 0`;
    const params = [];
    if (keywords) {
      params.push(`%${keywords}%`);
      query += ` AND (user_name ILIKE $${params.length} OR description ILIKE $${params.length})`;
    }
    if (startTime && endTime) {
      params.push(startTime, endTime);
      query += ` AND create_time BETWEEN $${params.length - 1} AND $${params.length}`;
    }

    // 查询用户总数
    const countQuery = `SELECT COUNT(*) FROM users WHERE is_delete = 0` +
      (keywords ? ` AND (user_name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1})` : '') +
      (startTime && endTime ? ` AND create_time BETWEEN $${params.length + 2} AND $${params.length + 3}` : '');

    const countParams = keywords ? [...params, `%${keywords}%`] : params;
    if (startTime && endTime) {
      countParams.push(startTime, endTime);
    }

    const totalResult = await sql(countQuery, countParams);
    const total = totalResult[0].count;

    // 查询用户数据
    params.push(pageSize, offset);
    query += ` ORDER BY create_time DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;
    const result = await sql(query, params);

    // 如果查询结果为空或出错，返回一个适当的响应
    if (!result || result.length === 0) {
      return res.status(404).json({
        status: 404,
        message: 'No users found',
        page: pageNum,
        pageSize: pageSize,
        total: total
      });
    }
    // 返回查询到的数据
    res.json({
      status: 200,
      message: 'Query User Success',
      data: result,
      page: pageNum,
      pageSize: pageSize,
      total: total
    });
  } catch (err) {
    console.error(err);  // 打印错误信息
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// 3. 更新用户
router.put('/', async (req, res) => {
  const { id, userName, password, description, roles } = req.body;
  if (!id || !userName || !password || !description || !roles) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  try {
    const update_time = formatDate();
    const hashedPassword = await hashPassword(password);
    const account = 'testuser';
    const is_delete = 0;
    const nick_name = '管理员';
    const role_ids = [101, 102, 301];
    const avatar = 'https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';
    const query = `
      UPDATE users SET user_name = $1, password = $2, description = $3, roles = $4,
      update_time = $5, account = $6, is_delete = $7, nick_name = $8,
      role_ids = $9, avatar = $10 WHERE id = $11 RETURNING *;
    `;
    const values = [
      userName, hashedPassword, description, JSON.stringify(roles),
      update_time, account, is_delete, nick_name,
      JSON.stringify(role_ids), avatar, id
    ];
    const result = await sql(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. 删除用户（软删除）
router.delete('/', async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: 'Missing user ID' });
  try {
    const query = `UPDATE users SET is_delete = 1 WHERE id = $1`;
    await sql(query, [id]);
    res.json({ message: 'User soft-deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
