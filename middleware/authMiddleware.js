// 中间件：验证 Token
const { verifyToken } = require('../utils/utils');  // 假设你有一个 JWT 工具来验证 Token

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // 从请求头获取 Token，格式为 "Bearer token"

    // 校验 Token 是否存在
    if (!token) {
        return res.status(401).json({ status: 401, message: '登录过期，请重新登录!' });
    }

    try {
        // 验证 Token 并解码
        const decoded = verifyToken(token);

        // 检查解码后的结果
        if (!decoded || !decoded.id) {
            return res.status(401).json({ status: 401, message: '登录过期，请重新登录!' });
        }

        // 将解码后的用户信息存储在 `req.user` 中，包含 `id` 和 `user_name`
        req.user = {
            id: decoded.id,             // 用户 ID
            user_name: decoded.user_name // 用户名，可选
        };

        // 继续执行下一个中间件或路由处理
        next();
    } catch (error) {
        // 捕获验证过程中的错误
        console.error('Token 验证错误:', error.message);
        return res.status(401).json({ status: 401, message: 'Token 验证失败', error: error.message });
    }
};

module.exports = authMiddleware;

// 用法：
// router.get('/', authMiddleware, async (req, res) => {....
