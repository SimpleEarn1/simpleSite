const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth'); // импортируем authMiddleware
const User = require('../models/User'); // модель пользователя

// GET /api/user/profile - получить профиль текущего пользователя
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; // authMiddleware кладёт id в req.user

    // Найти пользователя без пароля
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      email: user.email,
      balance: user.balance,
      referrerId: user.referrerId || null,
      createdAt: user.createdAt,
      isBlocked: user.isBlocked,
      // Можно добавить другие поля по необходимости
    });
  } catch (error) {
    console.error('Ошибка получения профиля:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;