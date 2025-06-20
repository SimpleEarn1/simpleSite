const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authMiddleware, adminOnly } = require('../middleware/auth');  // Импортируем middleware

// Вход для админа
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });
  if (!admin || admin.role !== 'admin') {
    return res.status(401).json({ message: 'Нет доступа' });
  }
  if (admin.password !== password) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }

  const token = require('jsonwebtoken').sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

// Получить всех пользователей (без паролей)
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Изменить баланс пользователя
router.post('/users/:id/balance', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.balance = amount;
    await user.save();

    res.json({ message: 'Баланс обновлён', balance: user.balance });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить пользователя
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Пользователь удалён' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Блокировка/разблокировка пользователя
router.post('/users/:id/block', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { block } = req.body; // true или false
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.isBlocked = !!block;
    await user.save();

    res.json({ message: block ? 'Пользователь заблокирован' : 'Пользователь разблокирован' });
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// История операций пользователя
router.get('/users/:id/history', authMiddleware, adminOnly, async (req, res) => {
  try {
    const history = await Transaction.find({ userId: req.params.id }).sort({ date: -1 });
    res.json(history);
  } catch {
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;