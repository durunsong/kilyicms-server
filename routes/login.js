var express = require('express');
var router = express.Router();
const datas_admin = {
  "message": "登录成功",
  "status": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJ1c2VyTmFtZSI6ImFkbWluMTIzIiwiaWF0IjoxNzI3MjU2MzI1LCJleHAiOjE3MjcyNTk5MjV9.58y7cuU_tPIG94O9q0gtW-IG9DJO3Qny92gjsuXEDeg",
  "userInfo": {
    "userName": "admin123",
    "account": "testuser",
    "avatar": "https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800",
    "description": "sdfgvdbfg",
    "create_time": "2024-08-15T16:37:57.000Z",
    "update_time": "2024-08-15T16:37:57.000Z",
    "is_delete": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJ1c2VyTmFtZSI6ImFkbWluMTIzIiwiaWF0IjoxNzI3MjU2MzI1LCJleHAiOjE3MjcyNTk5MjV9.58y7cuU_tPIG94O9q0gtW-IG9DJO3Qny92gjsuXEDeg",
    "nick_name": "管理员",
    "role_ids": [
      101,
      102,
      301
    ],
    "login_time": "2024-09-25 17:25:25"
  }
};

const datas_user = {
  "message": "登录成功",
  "status": 200,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJ1c2VyTmFtZSI6ImFkbWluMTIzIiwiaWF0IjoxNzI3MjU2MzI1LCJleHAiOjE3MjcyNTk5MjV9.58y7cuU_tPIG94O9q0gtW-IG9DJO3Qny92gjsuXEDeg",
  "userInfo": {
    "userName": "admin",
    "account": "testuser",
    "avatar": "https://t11.baidu.com/it/u=4070862290,220377769&fm=30&app=106&f=JPEG?w=640&h=930&s=F9A1B15176236F15308C61DE03007032",
    "description": "sdfgvdbfg",
    "create_time": "2024-08-15T16:37:57.000Z",
    "update_time": "2024-08-15T16:37:57.000Z",
    "is_delete": 0,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJ1c2VyTmFtZSI6ImFkbWluMTIzIiwiaWF0IjoxNzI3MjU2MzI1LCJleHAiOjE3MjcyNTk5MjV9.58y7cuU_tPIG94O9q0gtW-IG9DJO3Qny92gjsuXEDeg",
    "nick_name": "普通用户",
    "role_ids": [
      301,
      402,
      509
    ],
    "login_time": "2024-09-25 17:25:25"
  }
};

router.post('/', function (req, res, next) {
  if (req.body.name == "admin" && req.body.password == "123456") {
    res.status(200).json({
      ...datas_admin
    });
  } else if (req.body.name == "user" && req.body.password == "123456") {
    res.status(200).json({
      ...datas_user
    });
  } else {
    res.status(200).json({
      "message": "登录失败",
      "status": 401,
      "data": {
        "msg": "用户名或密码错误"
      }
    });
  }
});

module.exports = router;
