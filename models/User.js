const mongoose = require('mongoose');

// Схема одной операции (транзакции)
const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ['deposit', 'withdraw'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

// Основная схема пользователя
const userSchema = new mongoose.Schema({
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  balance:        { type: Number, default: 0 },      // текущий баланс
  investedAmount: { type: Number, default: 0 },      // вложено
  profit:         { type: Number, default: 0 },      // накопленный доход
  lastWithdrawalDate: { type: Date, default: null }, // последняя дата снятия

  transactions: [transactionSchema], // 🟢 массив операций

  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // кто пригласил

  role:       { type: String, enum: ['user', 'admin'], default: 'user' }, // роль (для админки)
  isAdmin:    { type: Boolean, default: false }, // старый вариант — можно оставить для совместимости
  isBlocked:  { type: Boolean, default: false },

  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);