const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const SALT_ROUNDS = 10; // 加密的盐值
const JWT_SECRET = process.env.JWT_SECRET || '64305b2c17dc4d94f3e54cbd12b05696'; // JWT 密钥，可以从环境变量获取

/**
 * 对密码进行加密
 * @param {string} password - 明文密码
 * @returns {Promise<string>} - 返回加密后的密码
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * 校验密码是否正确
 * @param {string} password - 明文密码
 * @param {string} hashedPassword - 加密后的密码
 * @returns {Promise<boolean>} - 校验结果
 */
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * 生成 JWT Token
 * @param {Object} user - 用户信息对象（包含 id 和 account 等）
 * @returns {string} - 返回生成的 token
 */
const generateToken = (user) => {
  return jwt.sign({ id: user.id, account: user.account }, JWT_SECRET, { expiresIn: '1h' });
};

/**
 * 验证 JWT Token
 * @param {string} token - 前端传递的 JWT Token
 * @returns {Object|null} - 解码后的用户信息或 null（验证失败）
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * 格式化日期
 * @returns {string} - 返回格式化后的日期字符串 'YYYY-MM-DD HH:mm:ss'
 */
const formatDate = () => moment().format("YYYY-MM-DD HH:mm:ss");

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  formatDate,
};