const express = require('express');
const router = express.Router();
const { sql } = require('../db/db-connection'); // 引入 Neon 数据库连接模块
const { v4: uuidv4 } = require('uuid');
const { hashPassword, formatDate } = require('../utils/utils');

// 注册接口
router.post('/', async (req, res) => {
  const { userName, password, confirmPassword, roles } = req.body;
  // 校验必填字段
  if (!userName || !password || !confirmPassword || !roles) {
    return res.status(400).json({ message: '用户名、密码、确认密码和角色是必填项' });
  }
  // 检查密码是否匹配
  if (password !== confirmPassword) {
    return res.status(400).json({ message: '密码和确认密码不匹配' });
  }
  try {
    // 检查用户名是否已存在（使用参数化查询避免 SQL 注入）
    const checkUserQuery = `
      SELECT * FROM users WHERE user_name = $1 AND is_delete = 0;
    `;
    const existingUser = await sql(checkUserQuery, [userName]);
    if (existingUser.length > 0) {
      return res.status(409).json({ status: 409, message: '用户名已存在,请换一个用户名再试' });
    }
    // 哈希化密码
    const hashedPassword = await hashPassword(password);
    // 生成 uuid 和时间戳
    const uuid = uuidv4();
    const create_time = formatDate()
    const update_time = create_time
    const is_delete = 0;  // 默认设置为未删除
    const nick_name = "管理员"; // 默认为用户名作为昵称
    const avatar = 'https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800'; // 可设置默认头像，或允许客户端传递
    // 角色可以是字符串，根据业务调整角色的存储格式
    const role_ids = [101, 102, 301];  // 默认转换为数组，可能需要做进一步转换
    // 插入新用户数据
    const insertUserQuery = `
      INSERT INTO users (uuid, user_name, password, description, roles, account, create_time, update_time, is_delete, nick_name, role_ids, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [
      uuid, userName, hashedPassword, '', JSON.stringify(roles),
      userName, create_time, update_time, is_delete, nick_name, JSON.stringify(role_ids), avatar
    ];
    const result = await sql(insertUserQuery, values);
    if (result.length === 0) {
      return res.status(500).json({ message: '用户注册失败，数据库插入失败' });
    }
    // 返回注册成功的用户数据
    res.status(201).json({ message: '用户注册成功', status: 201, data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '注册失败', error: error.message });
  }
});

module.exports = router;
