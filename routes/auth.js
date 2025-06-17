const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, referrerCode } = req.body;

    // 1. Проверка полей
    if (!email || !password) {
      return res.status(400).json({ message: 'Поля email и password обязательны' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль должен быть минимум 6 символов' });
    }

    // 2. Проверка, существует ли такой пользователь
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    // 3. Поиск пригласившего по referrerCode (можно использовать _id или email)
    let referrer = null;
    if (referrerCode) {
      // попробуем найти по ID или email
      referrer = await User.findOne({
        $or: [
          { _id: referrerCode },
          { email: referrerCode }
        ]
      });
    }

    // 4. Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Создаем пользователя
    const newUser = new User({
      email,
      password: hashedPassword,
      referrerId: referrer ? referrer._id : null
    });

    await newUser.save();

    res.status(201).json({ message: 'Пользователь зарегистрирован' });
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

module.exports = router;