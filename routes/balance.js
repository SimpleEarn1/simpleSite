const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth'); // middleware авторизации

// POST /api/balance/deposit — пополнение баланса авторизованного пользователя
router.post('/deposit', authMiddleware, async (req, res) => {
  const userId = req.user.id; // из токена, который добавляет authMiddleware
  const { amount } = req.body;

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ message: 'Сумма должна быть положительным числом' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    user.balance += amount;
    await user.save();

    res.json({ message: 'Баланс пополнен', balance: user.balance });
  } catch (err) {
    console.error('Ошибка пополнения:', err);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;