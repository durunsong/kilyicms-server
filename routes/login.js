const express = require("express");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// 秘钥用于签发 token
const secretKey = "kilyicms_secret_key";

// 读取 users.json 文件中的用户数据
const getUsers = () => {
  const data = fs.readFileSync(path.join(__dirname, "..", "data", "users.json"), "utf8");
  return JSON.parse(data);
};

// 创建 JWT
const createToken = (user) => {
  const payload = {
    userName: user.userName,
    account: user.account,
  };
  return jwt.sign(payload, secretKey, { expiresIn: "1h" }); // 签发 token
};

// 登录接口
router.post("/", (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "账号和密码都是必需的" });
  }

  const users = getUsers(); // 获取用户数据
  const user = users[userName];

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "用户名或密码错误" });
  }

  // 生成 token
  const token = createToken(user);
  const login_time = moment().format("YYYY-MM-DD HH:mm:ss");

  res.status(200).json({
    message: "登录成功",
    status: 200,
    token,
    login_time,
  });
});

module.exports = router;
