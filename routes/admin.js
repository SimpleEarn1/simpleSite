const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// 🔐 Вход в админ-панель
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const admin = await User.findOne({ email });

  if (!admin || (!admin.isAdmin && admin.role !== 'admin')) {
    return res.status(401).json({ message: 'Нет доступа' });
  }

  if (admin.password !== password) {
    return res.status(401).json({ message: 'Неверный пароль' });
  }

  const token = jwt.sign(
    { id: admin._id, isAdmin: true, role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

// 📋 Получить всех пользователей (без пароля)
router.get('/users', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    console.error('Ошибка при получении пользователей:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// 💵 Изменить баланс
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

// ❌ Удалить пользователя
router.delete('/users/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Пользователь удалён' });
  } catch (err) {
    console.error('Ошибка при удалении пользователя:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// ⛔️ Блокировка / разблокировка
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

// 📜 История операций
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
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🛡️ Обычная проверка токена (для всех пользователей)
const authMiddleware = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет токена. Доступ запрещён' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Недопустимый токен' });
  }
};

// 🔐 Проверка, что пользователь — админ
const adminOnly = (req, res, next) => {
  if (req.user?.isAdmin || req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Только для администраторов' });
};

module.exports = {
  authMiddleware,
  adminOnly
};