const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();  // Загружаем переменные окружения

const app = express();

// Middleware для обработки JSON
app.use(express.json());

// Импорт маршрутов
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const balanceRoutes = require('./routes/balance');
const teamRoute = require('./routes/team');

// Подключаем API маршруты
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/team', teamRoute);

// Тестовый API маршрут
app.get('/api', (req, res) => {
  res.send('✅ Сервер работает! Добро пожаловать на SimpleEarn 👋');
});

// Обслуживание статики React
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Отдача React-приложения на все остальные маршруты
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Подключение к MongoDB и запуск сервера
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

console.log("🔐 MONGODB_URI из .env:", MONGODB_URI);

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("✅ MongoDB подключена");
  app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
  });
})
.catch((err) => {
  console.error("❌ Ошибка подключения к MongoDB:", err.message);
});