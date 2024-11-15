const express = require('express');
const moment = require('moment');
const router = express.Router();
const { sql } = require('../db/db-connection');
const { hashPassword, formatDate } = require('../utils/utils');
const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/authMiddleware');

// 1. 新增用户
router.post('/', authMiddleware, async (req, res) => {
  const { user_name, password, description, roles } = req.body;
  // 检查必填字段
  if (!user_name || !password || !description || !roles) {
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
    let avatar = '';
    if (roles[0] == 'admin') {
      avatar = 'https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';
    } else {
      avatar = 'https://img0.baidu.com/it/u=826468538,1526483732&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500';
    }
    // 插入用户数据
    const query = `
      INSERT INTO users (uuid, user_name, password, description, roles, account, create_time, update_time, is_delete, nick_name, role_ids, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      uuid, user_name, hashedPassword, description, JSON.stringify(roles),
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
router.get('/', async (req, res) => {
  const { pageNum = 1, pageSize = 10, keywords = '' } = req.query;
  const page = Number(pageNum);
  const size = Number(pageSize);
  const startTime = req.query.startTime;
  const endTime = req.query.endTime;
  const offset = (page - 1) * size;

  try {
    // 基础查询
    let query = `SELECT * FROM users WHERE is_delete = 0`;
    let countQuery = `SELECT COUNT(*) FROM users WHERE is_delete = 0`;
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

    // 处理时间范围查询（直接使用原始时间字符串）
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

    // 执行查询
    const totalResult = await sql(countQuery, countParams);
    const total = Number(totalResult[0]?.count || 0);

    // 如果没有数据，直接返回空数组，不返回 404
    if (total === 0) {
      return res.json({
        status: 200,
        message: 'Query User Success',
        data: [],
        page: page,
        pageSize: size,
        total: 0,
      });
    }

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

    // 返回查询到的数据
    res.json({
      status: 200,
      message: 'Query User Success',
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

// 3. 更新用户
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params; // 从 URL 路径参数获取 id
  const currentUserId = req.user.id;
  // 不允许修改演示账号
  if (id == 1 || id == 2) {
    return res.status(409).json({ status: 409, message: '不能修改演示账号！！！' });
  }
  const { user_name, password, description, roles } = req.body;
  // 校验必填字段
  if (!id || !user_name || !password || roles === undefined) {
    return res.status(400).json({ status: 400, message: 'Missing required fields' });
  }
  try {
    // 获取更新时间
    const update_time = formatDate();
    // 检查 password 是否已加密（bcrypt 加密后的字符串通常以 $2b$ 开头）
    let hashedPassword;
    if (password.startsWith('$2b$')) {
      hashedPassword = password; // 如果是加密后的密码，直接使用
    } else {
      hashedPassword = await hashPassword(password); // 如果是明文密码，则加密
    }
    // 查询当前用户信息
    const userQuery = `SELECT user_name, password, roles FROM users WHERE id = $1`;
    const userResult = await sql(userQuery, [id]);
    // 校验查询结果
    if (!userResult || userResult.length === 0) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    // 获取当前用户的信息 --- 未更改前的
    const currentUser = userResult[0];
    // 解析 roles（处理 roles 为普通字符串或 JSON 字符串的情况）
    let currentUserRoles;
    try {
      currentUserRoles = JSON.parse(currentUser.roles);
    } catch (error) {
      currentUserRoles = currentUser.roles;
    }
    // 解析前端传入的 roles
    let parsedRoles;
    try {
      parsedRoles = JSON.parse(roles);
    } catch (error) {
      parsedRoles = roles;
    }
    // 判断是否修改了用户名、密码或角色
    const isUserNameChanged = currentUser.user_name !== user_name;
    const isPasswordChanged = currentUser.password !== hashedPassword;
    const isRolesChanged = JSON.stringify(currentUserRoles[0]) !== JSON.stringify(parsedRoles[0]);
    // 默认字段数据
    const account = 'testuser';
    const is_delete = 0;
    const nick_name = '管理员';
    const role_ids = [101, 102, 301];
    const avatar = 'https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';
    // 构建更新 SQL 语句
    const query = `
      UPDATE users SET 
        user_name = COALESCE($1, user_name), 
        password = COALESCE($2, password), 
        description = COALESCE($3, description), 
        roles = COALESCE($4, roles),
        update_time = $5, 
        account = $6, 
        is_delete = $7, 
        nick_name = $8,
        role_ids = $9, 
        avatar = $10 
      WHERE id = $11 
      RETURNING id, user_name, description, roles, update_time;
    `;
    // 构建查询参数
    const values = [
      user_name || null,
      hashedPassword || null,
      description || null,
      roles ? JSON.stringify(parsedRoles) : null,
      update_time,
      account,
      is_delete,
      nick_name,
      JSON.stringify(role_ids),
      avatar,
      id
    ];
    // 执行 SQL 更新操作
    const result = await sql(query, values);
    // 检查更新结果
    if (result.rowCount === 0) {
      return res.status(404).json({ status: 404, message: 'User not found' });
    }
    // 获取更新后的用户信息
    const updatedUser = result.rows?.[0] || {
      id,
      user_name,
      description,
      roles: parsedRoles,
      update_time,
    };
    // 判断是否需要重新登录
    if (id == currentUserId && (isUserNameChanged || isPasswordChanged || isRolesChanged)) {
      return res.status(200).json({
        status: 200,
        message: '更新当前用户成功，请重新登录！',
        data: updatedUser,
        requiresRelogin: true, // 前端可以根据这个字段判断是否需要重新登录
      });
    }
    // 返回更新后的用户数据
    res.status(200).json({
      status: 200,
      message: '用户更新成功',
      data: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: 500,
      message: '服务器内部错误',
      error: err.message
    });
  }
});

// 4. 删除用户（软删除）
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user.id;
  if (id == currentUserId) {
    return res.status(409).json({ status: 409, message: '不能删除当前登录的账号！！！' });
  }
  if (id == 1 || id == 2) {
    return res.status(409).json({ status: 409, message: '不能删除演示账号！！！' });
  }
  try {
    // 执行软删除操作
    const query = `UPDATE users SET is_delete = 1 WHERE id = $1`;
    const result = await sql(query, [id]);
    // 判断是否有更新操作
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 404,
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
