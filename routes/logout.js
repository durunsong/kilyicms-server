const express = require('express');
const router = express.Router();

// 退出登录接口
router.get('/', (req, res) => {
    // 清除客户端的 JWT token
    res.clearCookie("kilyicms_token");
    // 返回退出成功响应
    res.status(200).json({ message: "退出登录成功", status: 200 });
});

module.exports = router;
