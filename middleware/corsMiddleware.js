// 跨域cors中间件
const cors = require('cors');

const whitelist = process.env.CORS_WHITELIST?.split(',') || ['*'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.includes('*') || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

module.exports = cors(corsOptions);
