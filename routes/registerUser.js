const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

// 读取 users.json 文件中的用户数据
const getUsers = () => {
  const data = fs.readFileSync(path.join(__dirname, "..", "data", "users.json"), "utf8");
  return JSON.parse(data);
};

// 写入数据到 users.json
const writeUsers = (users) => {
  fs.writeFileSync(path.join(__dirname, "..", "data", "users.json"), JSON.stringify(users, null, 2));
};

// 注册用户接口
router.post("/", (req, res) => {
  const { userName, password, confirmPassword, description, roles } = req.body;

  // 检查必填字段
  if (!userName || !password || !confirmPassword) {
    return res.status(400).json({ status: 400, message: "用户名、密码和确认密码为必填项" });
  }

  // 检查密码是否一致
  if (password !== confirmPassword) {
    return res.status(400).json({ status: 400, message: "密码和确认密码不一致" });
  }

  const users = getUsers(); // 获取现有用户数据

  // 检查用户是否已存在
  if (users[userName]) {
    return res.status(409).json({ status: 409, message: "该用户名已被注册，请选择其他用户名" });
  }

  // 增加8小时以适应中国时区
  const create_time = moment().format("YYYY-MM-DD HH:mm:ss");
  const update_time = create_time;
  const account = userName; // 用户名作为账号
  const is_delete = 0;
  const nick_name = "新用户"; // 默认昵称
  const role_ids = [201]; // 普通用户角色ID
  const avatar = "https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800";

  // 密码加密
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ status: 500, message: "密码加密失败", error: err });
    }

    // 新用户对象
    const newUser = {
      uuid: uuidv4(),
      account,
      create_time,
      is_delete,
      password: hashedPassword,
      update_time,
      description: description || "",
      userName,
      nick_name,
      role_ids,
      avatar,
      roles: roles || ["user"], // 默认角色是普通用户
    };

    // 将新用户数据添加到 users 对象中
    users[userName] = newUser;

    // 保存更新后的用户数据到 JSON 文件
    writeUsers(users);

    res.status(200).json({ status: 200, message: "注册成功", data: newUser });
  });
});

module.exports = router;
