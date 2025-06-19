const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// GET /api/user/profile — получить профиль текущего пользователя
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      name: user.name || user.email,
      email: user.email,
      balance: user.balance,
      transactions: user.transactions || [],
      referrerId: user.referrerId || null,
      createdAt: user.createdAt,
      isBlocked: user.isBlocked,
      // Можно добавить другие поля по необходимости
    });
  } catch (error) {
    console.error('❌ Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;