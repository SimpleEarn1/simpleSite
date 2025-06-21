const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
require('dotenv').config();  // Загружаем переменные окружения

const app = express();

// 🔧 Middleware для обработки JSON и form-urlencoded данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🌐 Настройка CORS (разрешить доступ frontend-у на Render)
app.use(cors({
  origin: 'https://simpleearn-1.onrender.com',
  credentials: true
}));

// 📦 Импорт маршрутов
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const balanceRoutes = require('./routes/balance');
const teamRoute = require('./routes/team');

// 🔌 Подключение маршрутов API
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/team', teamRoute);

// ✅ Проверка работоспособности сервера
app.get('/api', (req, res) => {
  res.send('✅ Сервер работает! Добро пожаловать на SimpleEarn 👋');
});

// 🧱 Подключение статики React (client/build)
app.use(express.static(path.join(__dirname, 'client', 'build')));

// ⚛️ Все остальные маршруты отдаются React-приложением
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// 🔗 Подключение к MongoDB и запуск сервера
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;

console.log("🔐 MONGODB_URI из .env:", MONGODB_URI);
console.log("JWT_SECRET =", process.env.JWT_SECRET);

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