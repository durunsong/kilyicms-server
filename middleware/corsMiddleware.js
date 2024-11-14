// 跨域cors中间件
const cors = require("cors");

const corsMiddleware = cors(
    {
        origin: '*', // 或者指定允许的源
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    }
); // 直接返回中间件函数

module.exports = corsMiddleware;