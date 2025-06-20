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