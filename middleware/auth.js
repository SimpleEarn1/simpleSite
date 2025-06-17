const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔐 Middleware: проверка JWT-токена
async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Исправлено условие — проверяем, что authHeader отсутствует ИЛИ не начинается с 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Нет авторизации' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // секрет из .env

    // Находим пользователя по decoded.id (или decoded.userId — зависит, как генерируешь токен)
    const user = await User.findById(decoded.id); 

    if (!user) {
      return res.status(401).json({ message: 'Пользователь не найден' });
    }

    req.user = user; // сохраняем пользователя в req.user для дальнейших middleware и роутов
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Неверный токен' });
  }
}

// 🔒 Middleware: доступ только для администратора
function adminOnly(req, res, next) {
  // Исправлено условие — если нет req.user ИЛИ роль не admin
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Доступ запрещён (только для админа)' });
  }
  next();
}

// ✅ Экспортируем middleware
module.exports = {
  authMiddleware,
  adminOnly
};