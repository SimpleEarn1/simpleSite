const jwt = require('jsonwebtoken');
const User = require('../models/User').default;

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ message: 'Нет токена. Доступ запрещён' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Недопустимый токен' });
  }
};

module.exports = authMiddleware;