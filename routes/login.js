const express = require("express");
const router = express.Router();
const moment = require("moment");
const jwt = require("jsonwebtoken");

// 秘钥用于签发 token
const secretKey = "kilyicms_secret_key";
const datas_admin = {
  message: "登录成功",
  status: 200,
  token: "",
  userInfo: {
    userName: "admin",
    account: "test_admin",
    avatar: "https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800",
    description: "This is an admin account!",
    create_time: "2024-08-15T16:37:57.000Z",
    update_time: "2024-08-15T16:37:57.000Z",
    is_delete: 0,
    token: "",
    nick_name: "管理员",
    role_ids: [101, 102, 301],
    login_time: "",
  },
};

const datas_user = {
  message: "登录成功",
  status: 200,
  token: "",
  userInfo: {
    userName: "user",
    account: "test_user",
    avatar:
      "https://img0.baidu.com/it/u=826468538,1526483732&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500",
    description: "This is a user account!",
    create_time: "2024-08-17T16:37:57.000Z",
    update_time: "2024-08-17T16:37:57.000Z",
    is_delete: 0,
    token: "",
    nick_name: "普通用户",
    role_ids: [301, 402, 509],
    login_time: "",
  },
};

router.post("/", function (req, res, next) {
  const currentTime= moment().add(8, 'hours').format("YYYY-MM-DD HH:mm:ss");
  // 创建 JWT
  const createToken = (userName) => {
    const payload = {
      userId: 41, // 模拟的用户 ID
      userName: userName, // 用户名
      iat: Math.floor(Date.now() / 1000), // 签发时间
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 3), // 3天后过期
    };
    return jwt.sign(payload, secretKey); // 签发 token
  };
  if (req.body.userName == "admin" && req.body.password == "123456") {
    const token = createToken("admin");
    res.status(200).json({
      ...datas_admin,
      token: token,
      userInfo: {
        ...datas_admin.userInfo,
        login_time: currentTime,
        token: token
      },
    });
  } else if (req.body.userName == "user" && req.body.password == "123456") {
    const token = createToken("user");
    res.status(200).json({
      ...datas_user,
      token: token,
      userInfo: {
        ...datas_admin.userInfo,
        login_time: currentTime,
        token: token
      },
    });
  } else {
    res.status(403).json({
      message: "登录失败",
      status: 403,
      data: {
        msg: "用户名或密码错误",
      },
    });
  }
});

module.exports = router;
