const express = require("express");
const router = express.Router();

// 假设这是你的数据
const data = [
    {
        "id": 46,
        "account": "admin1234",
        "create_time": "2024-08-28 14:09:06",
        "is_delete": 0,
        "uuid": "",
        "password": "$2b$10$EKnchHJYYAjSgQMRlYSsNObqK2qNW7iKoJgnJg4808lb3uXVgCXpa",
        "update_time": "2024-08-28 14:09:06",
        "description": "",
        "token": null,
        "userName": "admin1234",
        "nick_name": "新用户",
        "role_ids": [201],
        "avatar": "https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800"
    },
    {
        "id": 45,
        "account": "testuser",
        "create_time": "2024-08-23 11:30:42",
        "is_delete": 0,
        "uuid": "",
        "password": "$2b$10$oEFcq/FOuDEoNaxPvuaT8eN5xRWzIzcqsJy8bDlxwuuv.3xaYlJR6",
        "update_time": "2024-08-28 07:30:55",
        "description": "十多个电放保函你发给放大",
        "token": null,
        "userName": "123321",
        "nick_name": "管理员",
        "role_ids": [101, 102, 301],
        "avatar": "https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800"
    },
    {
        "id": 44,
        "account": "testuser",
        "create_time": "2024-08-23 10:59:53",
        "is_delete": 0,
        "uuid": "",
        "password": "$2b$10$t0pAZzV9AeerV6Gjy16X2O5Y20N.1inSZadGi0uxLJSqR3aogALdi",
        "update_time": "2024-08-23 10:59:53",
        "description": "nkfgngoisdif",
        "token": null,
        "userName": "admin321",
        "nick_name": "管理员",
        "role_ids": [101, 102, 301],
        "avatar": "https://img1.baidu.com/it/u=1248484120,3563242407&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800"
    }
];

// 查询接口
router.get('/', (req, res) => {
    const { pageNum = 1, pageSize = 7, keyword = '', startTime, updateTime } = req.query;

    // 转换 pageNum 和 pageSize 为数字
    const page = parseInt(pageNum);
    const size = parseInt(pageSize);

    // 根据关键词过滤 (假设根据userName, nick_name或description进行搜索)
    let filteredData = data.filter(item => {
        const searchFields = [item.userName, item.nick_name, item.description].join(' ');
        return searchFields.includes(keyword);
    });

    // 根据开始时间和更新时间过滤
    if (startTime) {
        filteredData = filteredData.filter(item => new Date(item.create_time) >= new Date(startTime));
    }
    if (updateTime) {
        filteredData = filteredData.filter(item => new Date(item.update_time) <= new Date(updateTime));
    }

    // 分页
    const paginatedData = filteredData.slice((page - 1) * size, page * size);

    // 返回结果
    res.json({
        total: filteredData.length,
        pageNum: page,
        pageSize: size,
        data: paginatedData
    });
});

module.exports = router;
