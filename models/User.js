const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  balance: { type: Number, default: 0 },          // текущий доступный баланс
  investedAmount: { type: Number, default: 0 },   // основной капитал
  profit: { type: Number, default: 0 },           // накопленные проценты
  lastWithdrawalDate: { type: Date, default: null }, // последняя дата снятия

  referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // кто пригласил

  role: { type: String, default: 'user' },        // роль ('user' или 'admin')
  isBlocked: { type: Boolean, default: false },   // заблокирован ли аккаунт
  createdAt: { type: Date, default: Date.now }    // дата регистрации
});

module.exports = mongoose.model('User', userSchema);