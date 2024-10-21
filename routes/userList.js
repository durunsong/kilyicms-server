const express = require('express');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

const router = express.Router();

// 构建 users.json 的绝对路径
const dataPath = path.join(__dirname, '../data/users.json');

// 辅助函数：读取文件数据
const readData = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// 辅助函数：写入文件数据
const writeData = (data) => {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

// 1. 获取用户列表 (支持分页和关键词查询)
router.get('/', (req, res) => {
  const { pageNum = 1, pageSize = 10, keyword = '' } = req.query;
  const data = readData();
  let users = Object.values(data); // 将对象转换为数组

  // 关键词过滤
  if (keyword) {
    users = users.filter(user =>
      user.userName.includes(keyword) ||
      user.account.includes(keyword) ||
      user.nick_name.includes(keyword)
    );
  }

  // 分页处理
  const startIndex = (pageNum - 1) * pageSize;
  const endIndex = pageNum * pageSize;
  const paginatedUsers = users.slice(startIndex, endIndex);

  res.json({
    total: users.length,
    page: Number(pageNum),
    pageSize: Number(pageSize),
    data: paginatedUsers,
    message: "查询成功",
    status: 200
  });
});

// 2. 创建新用户
router.post('/', (req, res) => {
  const { userName, password, description, roles } = req.body;

  // 增加8小时以适应中国时区
  const create_time = moment().add(8, 'hours').format('YYYY-MM-DD HH:mm:ss');
  const update_time = create_time;
  const account = 'testuser';
  const is_delete = 0;
  const nick_name = '管理员';
  const role_ids = [101, 102, 301];
  const avatar = 'https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';

  // 生成 UUID
  const uuid = uuidv4();

  // 读取现有用户数据
  const data = readData();

  // 查重：检查是否已存在相同的 userName
  if (data[userName]) {
    return res.status(400).json({ status: 400, message: '用户名已存在，请换个名字试试' });
  }

  // 先对密码进行加密
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ status: 500, message: '密码加密失败', error: err });
    }

    // 创建新的用户对象
    const newUser = {
      uuid,
      account,
      create_time,
      is_delete,
      password: hashedPassword,
      update_time,
      description,
      userName,
      nick_name,
      role_ids,
      avatar,
      roles,
    };

    // 将新用户添加到数据中
    data[userName] = newUser;
    writeData(data);

    res.status(200).json({ status: 200, message: '创建成功', data: newUser });
  });
});


// 3. 更新用户
router.put('/:id', (req, res) => {
  const { id, userName } = req.params;
  if (userName == 'admin' || userName == 'user') {
    return res.status(403).json({ message: '禁止删除演示账号' });
  }
  const updatedUser = req.body;
  const data = readData();

  if (!data[id]) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 更新用户数据
  data[id] = { ...data[id], ...updatedUser, update_time: new Date().toISOString() };
  writeData(data);

  res.json(data[id]);
});

// 4. 删除用户
router.delete('/:id', (req, res) => {
  const { id, userName } = req.params;
  if (userName == 'admin' || userName == 'user') {
    return res.status(403).json({ message: '禁止删除演示账号' });
  }
  const data = readData();

  if (!data[id]) {
    return res.status(404).json({ message: 'User not found' });
  }

  // 删除用户
  delete data[id];
  writeData(data);

  res.json({ message: 'User deleted successfully' });
});

module.exports = router;
