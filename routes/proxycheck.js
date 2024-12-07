const express = require('express');
const axios = require("axios");
const router = express.Router();

// 退出登录接口
router.get("/", async (req, res) => {
    const { ip } = req.query; // 从查询参数中获取 IP 地址
    // const apiKey = "你的_proxycheck_api_key"; // 替换为你的 API 密钥
    if (!ip) {
        return res.status(400).json({ error: "IP 地址是必需的" });
    }
    try {
        // 请求 proxycheck.io API
        const response = await axios.get(
            `https://proxycheck.io/v2/${ip}?vpn=1&asn=1`
        );

        // 提取所需字段
        const data = response.data[ip];
        if (data) {
            const filteredData = {
                ...data,
                status: 200,
            };
            return res.json(filteredData);
        } else {
            return res.status(404).json({ error: "未找到相关数据" });
        }
    } catch (error) {
        console.error("代理检查失败:", error.message);
        res.status(500).json({ error: "无法获取代理检查结果" });
    }
});

module.exports = router;
