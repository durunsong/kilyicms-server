const express = require('express');
const router = express.Router();
const { sql } = require('../db/db-connection');

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await sql`SELECT * FROM users`;
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 创建新用户
router.post('/', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await sql`
            INSERT INTO users (name, email) VALUES (${name}, ${email})
            RETURNING id, name, email
        `;
    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 获取指定用户
router.get('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await sql`SELECT * FROM users WHERE id = ${userId}`;
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 更新用户
router.put('/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const updatedUser = await sql`
            UPDATE users SET name = ${name}, email = ${email}
            WHERE id = ${userId}
            RETURNING id, name, email
        `;
    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await sql`DELETE FROM users WHERE id = ${userId} RETURNING id`;
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;