const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Middleware: проверка JWT и загрузка пользователя
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Исправлено условие — проверяем, что authHeader отсутствует ИЛИ не начинается с 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет авторизации' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId); // ключ 'userId' должен быть в токене
    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = user;      // сохраняем объект пользователя
    req.userId = user.id; // удобно для краткой ссылки
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

// 🔒 Middleware: доступ только для админа
function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён (только для администратора)' });
  }
  next();
}

// ✅ Экспортируем middleware
module.exports = {
  authMiddleware,
  adminOnly
};