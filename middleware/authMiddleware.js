// 中间件：验证 Token
const { verifyToken } = require('../utils/jwt');  // 假设你有一个 jwt 工具来验证 Token

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];  // 从请求头中获取 Token
  
  if (!token) {
    return res.status(401).send('Unauthorized');  // 如果没有 Token，返回 401 未授权
  }

  try {
    const decoded = verifyToken(token);  // 验证 Token
    if (!decoded) {
      return res.status(401).send('Invalid token');  // 如果 Token 无效，返回 401
    }
    req.user = decoded;  // 将解码后的用户信息存储在 `req.user` 中
    next();  // 继续执行下一个中间件或路由处理
  } catch (error) {
    return res.status(401).send('Invalid token');  // 捕获验证过程中的错误，返回 401
  }
};

module.exports = authMiddleware;


// 用法：
// router.get('/', authMiddleware, async (req, res) => {....
