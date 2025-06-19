const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();  // Загружаем .env в первую очередь

const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Импорт маршрутов
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const balanceRoutes = require('./routes/balance');
const teamRoute = require('./routes/team');

// Подключаем маршруты
app.use('/api/team', teamRoute);
console.log('userRoutes:', userRoutes);
// Подключаем маршруты
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.get('/', (req, res) => {
  res.send('✅ Сервер работает! Добро пожаловать на SimpleEarn 👋');
});

// Подключение к MongoDB
const MONGODB_URI = process.env.MONGODB_URI;
console.log("🔐 MONGODB_URI из .env:", MONGODB_URI);


mongoose.connect(MONGODB_URI, {// Подключение к MongoDB
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB подключена");

  // Запуск сервера после успешного подключения к БД
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ Ошибка подключения к MongoDB:", err.message);
});