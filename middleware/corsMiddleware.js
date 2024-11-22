// // set cookie时的配置
// const cors = require("cors");

// const whitelist = [
//     "http://localhost:7000",  // 本地开发环境
//     "https://kilyicms.vercel.app",  // 生产环境
//     "https://kilyicms-db.vercel.app" // 生产环境
// ];

// const corsOptions = {
//     origin: function (origin, callback) {
//         if (!origin || whitelist.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Not allowed by CORS"));
//         }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     credentials: true,
// };

// const corsMiddleware = cors(corsOptions);
// module.exports = corsMiddleware;

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
