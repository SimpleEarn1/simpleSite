const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Получить всех пользователей (без пароля)
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Ошибка при получении пользователей:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Изменить баланс пользователя
router.post('/users/:id/balance', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.balance = amount;
    await user.save();

    res.json({ message: 'Баланс обновлён', balance: user.balance });
  } catch (err) {
    console.error('Ошибка при обновлении баланса:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить пользователя
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Заблокировать / разблокировать пользователя
router.post('/users/:id/block', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { block } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

    user.isBlocked = block;
    await user.save();

    res.json({ message: block ? 'Пользователь заблокирован' : 'Пользователь разблокирован' });
  } catch (err) {
    console.error('Ошибка при блокировке:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// История операций пользователя
router.get('/users/:id/history', authMiddleware, adminOnly, async (req, res) => {
  try {
    const userId = req.params.id;
    const history = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(history);
  } catch (error) {
    console.error('Ошибка получения истории:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;