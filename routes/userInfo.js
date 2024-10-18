const express = require("express");
const router = express.Router();
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

// 获取用户详情接口
router.get("/", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // 从请求头获取 token
    if (!token) {
        return res.status(401).json({ message: "Token 不存在" });
    }
    try {
        // 验证并解码 token
        const decoded = jwt.verify(token, secretKey);
        const users = getUsers(); // 获取用户数据
        const user = users[decoded.userName];
        if (!user) {
            return res.status(404).json({ message: "用户不存在" });
        }
        // 返回用户信息
        const userInfo = {
            userName: user.userName,
            account: user.account,
            avatar: user.avatar,
            description: user.description,
            create_time: user.create_time,
            update_time: user.update_time,
            is_delete: user.is_delete,
            nick_name: user.nick_name,
            role_ids: user.role_ids,
            id: user.id,
            roles: user.roles,
        };
        res.status(200).json({
            message: "获取用户信息成功",
            status: 200,
            userInfo,
        });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: "登录过期，请重新登录" });
    }
});

module.exports = router;
