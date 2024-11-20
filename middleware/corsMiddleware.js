const cors = require("cors");

const whitelist = [
    "https://vercel.com/",
    "https://vercel.app",
    "http://localhost:7000",  // 本地开发环境
    "https://kilyicms.vercel.app",  // 生产环境
    "https://kilyicms-db.vercel.app" // 生产环境
];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
};

const corsMiddleware = cors(corsOptions);
module.exports = corsMiddleware;
